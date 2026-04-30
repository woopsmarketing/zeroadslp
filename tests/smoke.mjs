// 통합 smoke — next start 띄워 실 페이지 응답 검증 (LP-A/B + 메인 + thanks + /api/lead).
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SMOKE_PORT ? Number(process.env.SMOKE_PORT) : 3456;
const BASE = `http://127.0.0.1:${PORT}`;

const ok = (m) => console.log(`  ✓ ${m}`);
const fail = (m) => console.error(`  ✗ ${m}`);
const info = (m) => console.log(`→ ${m}`);

// 포트 점유자 + 좀비 next-server 모두 정리.
async function cleanupZombies() {
  await new Promise((res) => {
    const p = spawn("sh", [
      "-c",
      `lsof -tiTCP:${PORT} -sTCP:LISTEN 2>/dev/null | xargs -r kill -9; pkill -9 -f "next-server" 2>/dev/null; pkill -9 -f "next start" 2>/dev/null; true`,
    ]);
    p.on("close", () => res());
  });
}
await cleanupZombies();
await sleep(500);

info(`server 시작: PORT=${PORT}`);
// detached: true → 자식까지 process group 으로 한번에 kill 가능.
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  cwd: path.resolve(__dirname, ".."),
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
});
let serverErr = "";
let serverOut = "";
server.stderr.on("data", (b) => (serverErr += b.toString()));
server.stdout.on("data", (b) => (serverOut += b.toString()));

async function waitReady(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) });
      if (r.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error("서버 ready 타임아웃");
}

async function getPage(p) {
  const r = await fetch(`${BASE}${p}`);
  if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`);
  return r.text();
}

async function postJson(p, body) {
  const r = await fetch(`${BASE}${p}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

const tests = [
  // ── 메인 / 브랜드 허브 ──
  {
    name: "/ 메인 — 브랜드 허브 헤드라인 (포지셔닝 카피)",
    fn: async () => {
      const html = await getPage("/");
      assert.ok(
        html.includes("광고비 새는 구멍을 막고"),
        "메인 헤드라인 — 포지셔닝 카피 미일치"
      );
      assert.ok(
        html.includes("매출 전환 구조를 고치는"),
        "메인 헤드라인 — 전환 구조 카피 미일치"
      );
      assert.ok(html.includes("제로애드"), "브랜드명 누락");
      assert.ok(html.includes("산업별 전문 LP"), "라인업 섹션 누락");
    },
  },
  {
    name: "ServicesFlow stepper — 5단계 타임라인 (모든 LP)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("한 영역만 잘해도 광고는 돌고"),
          `${p}: ServicesFlow H2 누락`
        );
        // 5 stepper 노드
        for (const step of [
          "광고 계정",
          "추적 세팅",
          "랜딩 점검",
          "문의 흐름",
          "주간 개선",
        ]) {
          assert.ok(
            html.includes(step),
            `${p}: ServicesFlow stepper '${step}' 누락`
          );
        }
      }
    },
  },
  {
    name: "PainPoints 진단 매트릭스 — 4행 (증상→원인→손대는 곳)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("어디가 막혔는지 분해해서"),
          `${p}: 진단 매트릭스 헤더 누락`
        );
        for (const row of [
          "노출이 안 됨",
          "클릭이 안 됨",
          "랜딩·제안·신뢰",
          "폼·CRM 컨설팅",
        ]) {
          assert.ok(html.includes(row), `${p}: 진단표 행 '${row}' 누락`);
        }
      }
    },
  },
  {
    name: "Process 섹션 완전 제거 (ServicesFlow 가 흡수)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          !html.includes("광고 셋업 + 추적 검증"),
          `${p}: Process step 3 카피 잔존`
        );
        assert.ok(
          !html.includes("월간 전략 미팅"),
          `${p}: Process step 5 잔존`
        );
        assert.ok(
          !html.includes('id="process"'),
          `${p}: Process 섹션 id 잔존`
        );
      }
    },
  },

  // ── LP-A 4개 정적 라우트 ──
  ...["dental", "clinic", "interior", "tax"].map((slug) => ({
    name: `/lp/industry/${slug} — 산업 LP 정상 응답`,
    fn: async () => {
      const html = await getPage(`/lp/industry/${slug}`);
      const labels = {
        dental: "치과",
        clinic: "병원",
        interior: "인테리어",
        tax: "세무사",
      };
      assert.ok(html.includes(labels[slug]), `${slug} 헤드라인 미일치`);
      assert.ok(
        html.includes("카톡으로 진단 받기"),
        "primary CTA(카톡) 누락 (LP-A)"
      );
    },
  })),

  // ── LP-A 동적 파라미터 ──
  {
    name: "/lp/industry/dental?loc=1009871 → '서울 치과 마케팅'",
    fn: async () => {
      const html = await getPage("/lp/industry/dental?loc=1009871");
      assert.ok(html.includes("서울 치과 마케팅"), "loc 매핑 미작동");
    },
  },
  {
    name: "/lp/industry/dental?loc=1011554 → '강남구 치과 마케팅'",
    fn: async () => {
      const html = await getPage("/lp/industry/dental?loc=1011554");
      assert.ok(html.includes("강남구 치과 마케팅"), "강남구 매핑 미작동");
    },
  },
  {
    name: "/lp/industry/dental?loc=9999999 → 기본 헤드라인 (fallback)",
    fn: async () => {
      const html = await getPage("/lp/industry/dental?loc=9999999");
      assert.ok(
        html.includes("치과 마케팅 전문"),
        "fallback 헤드라인 미작동"
      );
    },
  },
  {
    name: "/lp/industry/invalid → 404",
    fn: async () => {
      const r = await fetch(`${BASE}/lp/industry/nonexistent`);
      assert.equal(r.status, 404, `expected 404 got ${r.status}`);
    },
  },

  // ── LP-B (단순화: 통합 헤드라인 1개. ch/kw 는 추적·디자인 색·eyebrow 만 영향) ──
  {
    name: "/lp/agency — 통합 헤드라인 (ch 없음)",
    fn: async () => {
      const html = await getPage("/lp/agency");
      assert.ok(
        html.includes("네이버·구글·메타·카카오·유튜브 통합 운영"),
        "통합 헤드라인 미일치"
      );
      assert.ok(html.includes("종합 광고대행"), "default eyebrow 누락");
    },
  },
  {
    name: "/lp/agency?ch=naver → 같은 헤드라인 + 네이버 eyebrow + data-channel='naver'",
    fn: async () => {
      const html = await getPage("/lp/agency?ch=naver");
      assert.ok(
        html.includes("네이버·구글·메타·카카오·유튜브 통합 운영"),
        "통합 헤드라인 유지 안 됨"
      );
      assert.ok(html.includes("네이버 검색광고"), "naver eyebrow 누락");
      assert.ok(/data-channel="naver"/.test(html), "data-channel naver 누락");
    },
  },
  {
    name: "/lp/agency?ch=google → 통합 헤드라인 + 구글 eyebrow + data-channel='google'",
    fn: async () => {
      const html = await getPage("/lp/agency?ch=google");
      assert.ok(
        html.includes("네이버·구글·메타·카카오·유튜브 통합 운영"),
        "통합 헤드라인 유지 안 됨"
      );
      assert.ok(html.includes("구글 광고"), "google eyebrow 누락");
      assert.ok(/data-channel="google"/.test(html), "data-channel google 누락");
    },
  },
  {
    name: "/lp/agency?kw=네이버광고대행 → kw 에서 channel=naver 추출",
    fn: async () => {
      const html = await getPage(
        `/lp/agency?kw=${encodeURIComponent("네이버광고대행")}`
      );
      assert.ok(html.includes("네이버 검색광고"), "kw → naver eyebrow 미작동");
      assert.ok(/data-channel="naver"/.test(html), "kw → naver 색 미작동");
    },
  },
  {
    name: "/lp/agency?ch=meta → 통합 헤드라인 + 메타 eyebrow",
    fn: async () => {
      const html = await getPage("/lp/agency?ch=meta");
      assert.ok(
        html.includes("네이버·구글·메타·카카오·유튜브 통합 운영"),
        "통합 헤드라인 유지 안 됨"
      );
      assert.ok(
        html.includes("메타(페이스북·인스타그램) 광고"),
        "meta eyebrow 누락"
      );
    },
  },

  // ── 폼 / API ──
  {
    name: "모든 LP 에 ContactForm (id='contact') 마운트",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        assert.ok(
          html.includes('id="contact"') || html.includes("id='contact'"),
          `${p}: contact form 누락`
        );
      }
    },
  },
  {
    name: "POST /api/lead — 필수 누락시 400",
    fn: async () => {
      const r = await postJson("/api/lead", { name: "테스트" });
      assert.equal(r.status, 400);
      assert.ok(r.body.error, "error 응답 누락");
    },
  },
  {
    name: "POST /api/lead — consent 누락시 400 (4필드 모드)",
    fn: async () => {
      const r = await postJson("/api/lead", {
        name: "테스트",
        phone: "010-1234-5678",
        business: "치과",
      });
      assert.equal(r.status, 400);
      assert.equal(r.body.error, "missing_consent");
    },
  },
  {
    name: "POST /api/lead — business 누락시 400 (필수)",
    fn: async () => {
      const r = await postJson("/api/lead", {
        name: "테스트",
        phone: "010-1234-5678",
        consent: "yes",
        // business 누락
      });
      assert.equal(r.status, 400);
      assert.equal(r.body.error, "missing_required_fields");
    },
  },
  {
    name: "POST /api/lead — 성공시 200 + id (4필드)",
    fn: async () => {
      const r = await postJson("/api/lead", {
        name: "테스트",
        phone: "010-1234-5678",
        business: "치과",
        site_url: "https://example.com",
        consent: "yes",
        lp_source: "industry",
        category: "dental",
      });
      assert.equal(r.status, 200);
      assert.ok(r.body.id, "id 누락");
    },
  },

  // ── 정책/SEO ──
  {
    name: "/thanks 페이지 정상",
    fn: async () => {
      const html = await getPage("/thanks");
      assert.ok(html.includes("신청이 접수되었습니다"), "thanks 메시지 누락");
    },
  },
  {
    name: "/privacy 200",
    fn: async () => {
      const html = await getPage("/privacy");
      assert.ok(html.includes("개인정보처리방침"), "privacy 콘텐츠 누락");
    },
  },
  {
    name: "/terms 200",
    fn: async () => {
      const html = await getPage("/terms");
      assert.ok(html.includes("이용약관"), "terms 콘텐츠 누락");
    },
  },
  {
    name: "/robots.txt 정상",
    fn: async () => {
      const txt = await getPage("/robots.txt");
      assert.ok(txt.includes("Sitemap:"), "robots Sitemap 누락");
    },
  },
  {
    name: "/sitemap.xml 에 6개 LP URL 포함",
    fn: async () => {
      const xml = await getPage("/sitemap.xml");
      assert.ok(xml.includes("/lp/industry/dental"), "dental URL 누락");
      assert.ok(xml.includes("/lp/industry/clinic"), "clinic URL 누락");
      assert.ok(xml.includes("/lp/industry/interior"), "interior URL 누락");
      assert.ok(xml.includes("/lp/industry/tax"), "tax URL 누락");
      assert.ok(xml.includes("/lp/agency"), "agency URL 누락");
    },
  },
  {
    name: "사용자 노출 영역에 'OpsBoard' 단어 미노출",
    fn: async () => {
      const all = (
        await Promise.all(
          [
            "/",
            "/lp/industry/dental",
            "/lp/industry/clinic",
            "/lp/agency",
            "/privacy",
            "/terms",
          ].map((p) => getPage(p))
        )
      ).join("\n");
      assert.ok(!all.includes("OpsBoard"), "OpsBoard 단어 잔존");
    },
  },
  {
    name: "사용자 노출 영역에 '제로버블 마케팅' 잔존 X",
    fn: async () => {
      const homeHtml = await getPage("/");
      // 사업자 정보(제로버블 솔루션) 는 푸터에 정상 노출. "제로버블 마케팅" 만 X.
      assert.ok(
        !homeHtml.includes("제로버블 마케팅"),
        "구 브랜드명 잔존"
      );
    },
  },
  {
    name: "JSON-LD Organization 스키마 포함 (메인)",
    fn: async () => {
      const html = await getPage("/");
      assert.ok(
        html.includes('"@type":"Organization"'),
        "Organization 스키마 누락"
      );
    },
  },
  {
    name: "JSON-LD FAQPage 스키마 포함 (LP-A)",
    fn: async () => {
      const html = await getPage("/lp/industry/dental");
      assert.ok(html.includes('"@type":"FAQPage"'), "FAQPage 스키마 누락");
    },
  },

  // ── 추적 / hidden field ──
  // 정책: 서버에서 가공된 값(loc 한글, lp_source, category, channel, intent)만 hidden 으로 박음.
  // raw URL 파라미터(gclid/utm_*/matchtype/device/loc_physical 등)는 client collectAuto() 가
  // 폼 제출시 fresh 캡처해서 흘림. 서버 hidden 중복하지 않음.
  {
    name: "LP-A hidden field — 서버 가공 값(loc 한글, category)만 박힘",
    fn: async () => {
      const html = await getPage(
        "/lp/industry/dental?loc_physical=1009871&utm_term=치과&gclid=ABC123"
      );
      assert.ok(
        html.includes('name="loc" value="서울"'),
        "loc 한글 변환 hidden 누락"
      );
      assert.ok(
        html.includes('name="category" value="dental"'),
        "category hidden 누락"
      );
      assert.ok(
        html.includes('name="lp_source" value="industry"'),
        "lp_source hidden 누락"
      );
    },
  },
  {
    name: "LP-A loc_physical 우선, 없으면 loc_interest, 그래도 없으면 legacy loc",
    fn: async () => {
      // loc_physical 우선
      let html = await getPage(
        "/lp/industry/dental?loc_physical=1009872&loc_interest=1009871&loc=1009873"
      );
      assert.ok(html.includes("부산 치과 마케팅"), "loc_physical 우선 적용 안됨");
      // loc_interest fallback
      html = await getPage("/lp/industry/dental?loc_interest=1009873");
      assert.ok(html.includes("대구 치과 마케팅"), "loc_interest fallback 미작동");
      // legacy loc fallback
      html = await getPage("/lp/industry/dental?loc=1009871");
      assert.ok(html.includes("서울 치과 마케팅"), "legacy loc fallback 미작동");
    },
  },
  {
    name: "LP-B intent=problem → 공감 톤 헤드라인 스위칭",
    fn: async () => {
      const html = await getPage("/lp/agency?intent=problem");
      assert.ok(
        html.includes("모르고 계셨나요?"),
        "problem 헤드라인 스위칭 미작동"
      );
      assert.ok(
        html.includes('name="intent" value="problem"'),
        "intent hidden 누락"
      );
    },
  },
  {
    name: "LP-B intent 없을 때 — 통합 헤드라인 유지",
    fn: async () => {
      const html = await getPage("/lp/agency");
      assert.ok(
        html.includes("네이버·구글·메타·카카오·유튜브 통합 운영"),
        "default 헤드라인 변경됨"
      );
      assert.ok(
        !html.includes("모르고 계셨나요?"),
        "intent 없는데 problem 헤드라인 노출"
      );
    },
  },
  {
    name: "PainPoints 섹션 — 모든 LP 에 마운트",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        assert.ok(html.includes("이런 문제, 있으시죠?"), `${p}: PainPoints 누락`);
      }
    },
  },
  {
    name: "DiagnosisChecklist 컴포넌트 완전 제거 (DiagnosisReportSample 로 통합)",
    fn: async () => {
      // 옛 eyebrow 카피가 어디에도 안 남아있어야 함 (통합 후 제거)
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          !html.includes("무료 진단에서 확인하는 것"),
          `${p}: 옛 DiagnosisChecklist eyebrow 잔존`
        );
      }
    },
  },
  {
    name: "사례·KPI 가짜 수치 노출 X (general.md 신뢰 정책)",
    fn: async () => {
      // 옛날 placeholder 문구가 LP 에 다시 들어가지 않았는지 확인
      const banned = [
        "신환 유입 증가율",
        "월 신환",
        "CPL 7만원",
        "ROAS 1.8배",
        "월 견적 18 → 67건",
        "DTC 화장품 M",
      ];
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/interior",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        for (const w of banned) {
          assert.ok(!html.includes(w), `${p}: 가짜 사례 문구 '${w}' 노출`);
        }
      }
    },
  },
  {
    name: "LP-A 의료광고법 금칙어 미사용 (dental/clinic)",
    fn: async () => {
      const dental = await getPage("/lp/industry/dental");
      const clinic = await getPage("/lp/industry/clinic");
      const banned = ["완치", "특효", "기적"];
      const banned2 = ["1위", "최고", "최저가", "100% 보장", "무조건"];
      for (const w of [...banned, ...banned2]) {
        assert.ok(!dental.includes(w), `dental 에 금칙어 '${w}' 발견`);
        assert.ok(!clinic.includes(w), `clinic 에 금칙어 '${w}' 발견`);
      }
    },
  },
  {
    name: "OpsBoardSection — 운영 가시성 섹션 마운트 (모든 LP)",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        // H2 가 span 으로 split 되어 단일 문자열로 안 잡힘 — 두 토막 검사
        assert.ok(html.includes("광고 운영,"), `${p}: OpsBoardSection H2 앞부분 누락`);
        assert.ok(
          html.includes("맡기고 끝나지 않습니다"),
          `${p}: OpsBoardSection H2 뒷부분 누락`
        );
        assert.ok(
          html.includes("운영 가시성"),
          `${p}: 운영 가시성 eyebrow 누락`
        );
        // 3 카드
        for (const card of [
          "무슨 일이 진행 중인지 보입니다",
          "대행사가 뭘 했는지 보입니다",
          "주간 개선 루프가 보입니다",
        ]) {
          assert.ok(html.includes(card), `${p}: 카드 '${card}' 누락`);
        }
        // 신뢰 배지
        for (const badge of [
          "매일 업데이트",
          "공유 URL 제공",
          "광고주 직접 확인",
        ]) {
          assert.ok(html.includes(badge), `${p}: 배지 '${badge}' 누락`);
        }
        // 큰 '샘플 보드 보기' CTA 강등 — 작은 텍스트 한 줄로만 노출
        assert.ok(
          !html.includes("샘플 보드 보기"),
          `${p}: '샘플 보드 보기' 큰 CTA 가 잔존 (강등됐어야 함)`
        );
        assert.ok(
          html.includes("샘플 보드도 함께 안내드립니다"),
          `${p}: 강등된 보조 텍스트 누락`
        );
        assert.ok(
          html.includes("광고주 전용 운영 보드"),
          `${p}: '광고주 전용 운영 보드' 카피 누락`
        );
      }
    },
  },
  {
    name: "Hero subhead — 운영 가시성 한 줄 ('보드 공유 URL로 매일')",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("광고주 전용 보드"),
          `${p}: Hero subhead 운영 가시성 한 줄 누락`
        );
      }
    },
  },
  {
    name: "TrustBar — Hero 직하 마운트 (모든 LP)",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("GA4 / GTM / 전환 이벤트 점검"),
          `${p}: TrustBar 추적 항목 누락`
        );
        assert.ok(
          html.includes("주간 개선 루프"),
          `${p}: TrustBar 개선 루프 항목 누락`
        );
      }
    },
  },
  {
    name: "CaseStudies — '진단 리포트 샘플' 라벨 + 압축된 4단계 (모든 LP)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("진단 리포트 샘플"),
          `${p}: '진단 리포트 샘플' 라벨 누락`
        );
        assert.ok(
          html.includes("실제 진단은"),
          `${p}: '실제 진단은' 안내 누락`
        );
        // 4단계 — 한글 압축 라벨 + Sample 배지
        for (const step of ["문제", "진단", "조치", "결과", "Sample"]) {
          assert.ok(
            html.includes(step),
            `${p}: 진단 4단계 '${step}' 누락`
          );
        }
      }
    },
  },
  {
    name: "PreFormCta — '이런 경우 바로 진단' 블록 (폼 직전)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("이런 경우 바로 진단이 필요합니다"),
          `${p}: PreFormCta 헤더 누락`
        );
        assert.ok(
          html.includes("30분 안에"),
          `${p}: 30분 톤 누락`
        );
      }
    },
  },
  {
    name: "CTA 카피 — 모든 LP primary 통일 '카톡으로 진단 받기'",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("카톡으로 진단 받기"),
          `${p}: 카톡 메인 CTA 누락`
        );
      }
    },
  },
  {
    name: "옛 톤 분리 카피 잔존 X (카톡 통일 정책 반영)",
    fn: async () => {
      for (const p of ["/lp/industry/interior", "/lp/industry/tax"]) {
        const html = await getPage(p);
        assert.ok(
          !html.includes("내 광고 어디서 막히는지 확인하기"),
          `${p}: 옛 소상공인 톤 카피 잔존`
        );
      }
    },
  },
  {
    name: "ServicesFlow — 옛 카피들('성과 시스템', '5개 영역을 한 흐름으로') 잔존 X",
    fn: async () => {
      const html = await getPage("/");
      assert.ok(
        !html.includes("성과 시스템을 깝니다"),
        "옛 H2 카피 잔존 (성과 시스템)"
      );
      assert.ok(
        !html.includes("5개 영역을 한 흐름으로"),
        "옛 H2 카피 잔존 (5개 영역)"
      );
    },
  },
  {
    name: "ContactForm 4필드 모드 — ad_status / message / budget 제거 (카톡 메인)",
    fn: async () => {
      const html = await getPage("/");
      // 유지 필드
      assert.ok(html.includes('name="name"'), "name 필드 누락");
      assert.ok(html.includes('name="phone"'), "phone 필드 누락");
      assert.ok(html.includes('name="business"'), "business 필드 누락");
      assert.ok(html.includes('name="site_url"'), "site_url 필드 누락");
      assert.ok(html.includes('name="consent"'), "consent 필드 누락");
      // 제거된 필드 (4필드 간소화)
      assert.ok(!html.includes('name="ad_status"'), "ad_status 필드 잔존");
      assert.ok(!html.includes('name="message"'), "message 필드 잔존");
      assert.ok(!html.includes('name="budget"'), "budget 필드 잔존");
      assert.ok(!html.includes('name="email"'), "이메일 필드 잔존");
      assert.ok(!html.includes('name="region"'), "지역 필드 잔존");
      assert.ok(!html.includes('name="marketing"'), "마케팅 동의 잔존");
      // 폼 위 카톡 인라인 안내
      assert.ok(
        html.includes("카톡으로 바로 진단 받기"),
        "폼 위 카톡 인라인 안내 누락"
      );
    },
  },
  {
    name: "ContactForm 헤드라인 — '30분 안에 진단'",
    fn: async () => {
      const html = await getPage("/");
      assert.ok(
        html.includes("30분 안에 진단"),
        "폼 헤드라인 30분 톤 누락"
      );
      assert.ok(
        html.includes("30분 무료 진단 신청"),
        "폼 submit 버튼 카피 미일치"
      );
    },
  },
  {
    name: "Sticky mobile CTA — 폼 + 카톡 2버튼 분기",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes('data-placement="sticky_mobile_form"'),
          `${p}: sticky 폼 jump 누락`
        );
        assert.ok(
          html.includes('data-placement="sticky_mobile_kakao"'),
          `${p}: sticky 카톡 누락`
        );
      }
    },
  },
  {
    name: "DiagnosisReportSample — 통합 섹션 (4체크 + 결과 카드)",
    fn: async () => {
      for (const p of ["/", "/lp/industry/dental", "/lp/agency"]) {
        const html = await getPage(p);
        assert.ok(
          html.includes("4가지 누수 구간"),
          `${p}: DiagnosisReportSample H2 키워드 누락`
        );
        // 위 4 체크 항목 (구 DiagnosisChecklist 통합)
        for (const item of [
          "광고비가 어디로 새는지",
          "전환 추적이 정확한지",
          "LP가 전환에 적합한지",
          "다음 30일 액션 플랜",
        ]) {
          assert.ok(html.includes(item), `${p}: 체크 항목 '${item}' 누락`);
        }
        // 아래 결과 카드 (DiagnosisResultCard)
        assert.ok(
          html.includes("진단 후 받게 되는 리포트 예시"),
          `${p}: 결과 카드 인트로 누락`
        );
        for (const finding of [
          "전환 추적 누락",
          "랜딩 CTA 약함",
          "검색광고 키워드 낭비",
          "문의폼 이탈 가능성",
        ]) {
          assert.ok(html.includes(finding), `${p}: 진단 항목 '${finding}' 누락`);
        }
        assert.ok(html.includes("Critical"), `${p}: 심각도 배지 누락`);
      }
    },
  },
  {
    name: "Hero — 진단 카드 제거 (작은 proof 줄만 노출)",
    fn: async () => {
      const html = await getPage("/");
      // Hero 안에는 무거운 카드 없음 (DiagnosisReportSample 별도 섹션)
      // 작은 proof 줄 3개
      for (const item of [
        "광고주 전용 운영 보드 공유",
        "매일 확인 가능",
        "30분 무료 진단",
      ]) {
        assert.ok(
          html.includes(item),
          `Hero proof 줄 '${item}' 누락`
        );
      }
    },
  },
  {
    name: "섹션 순서 — Pain → Diagnosis → Flow → OpsBoard → Cases",
    fn: async () => {
      const html = await getPage("/");
      const idxPain = html.indexOf("이런 문제, 있으시죠?");
      const idxDiag = html.indexOf("4가지 누수 구간");
      const idxFlow = html.indexOf("5단계 운영 흐름");
      const idxOps = html.indexOf("운영 가시성");
      const idxCase = html.indexOf("진단 리포트 샘플");
      for (const [name, idx] of [
        ["Pain", idxPain],
        ["Diag", idxDiag],
        ["Flow", idxFlow],
        ["Ops", idxOps],
        ["Case", idxCase],
      ]) {
        assert.ok(idx > 0, `${name} 섹션 노출 안 됨`);
      }
      assert.ok(
        idxPain < idxDiag && idxDiag < idxFlow && idxFlow < idxOps && idxOps < idxCase,
        `섹션 순서 어긋남 (pain=${idxPain}, diag=${idxDiag}, flow=${idxFlow}, ops=${idxOps}, case=${idxCase})`
      );
    },
  },
  {
    name: "Pricing 섹션 완전 제거",
    fn: async () => {
      for (const p of [
        "/",
        "/lp/industry/dental",
        "/lp/industry/clinic",
        "/lp/industry/interior",
        "/lp/industry/tax",
        "/lp/agency",
      ]) {
        const html = await getPage(p);
        assert.ok(
          !html.includes('id="pricing"'),
          `${p}: Pricing 섹션 잔존 (id=pricing)`
        );
        assert.ok(
          !html.includes("포함 사항"),
          `${p}: Pricing 헤드라인 잔존`
        );
      }
    },
  },
];

let pass = 0;
let failCount = 0;

try {
  await waitReady();
  info(`서버 ready, ${tests.length}개 케이스 실행`);
  for (const t of tests) {
    try {
      await t.fn();
      ok(t.name);
      pass++;
    } catch (e) {
      fail(`${t.name} — ${e.message}`);
      failCount++;
    }
  }
} catch (e) {
  fail(`서버 ready 실패: ${e.message}`);
  if (serverErr)
    console.error("--- server stderr ---\n" + serverErr.slice(-2000));
  if (serverOut)
    console.error("--- server stdout ---\n" + serverOut.slice(-2000));
  failCount++;
} finally {
  // process group 전체 SIGTERM
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {}
  await sleep(800);
  try {
    process.kill(-server.pid, "SIGKILL");
  } catch {}
  await cleanupZombies();
}

console.log(`\n결과: ${pass} passed, ${failCount} failed`);
process.exit(failCount > 0 ? 1 : 0);
