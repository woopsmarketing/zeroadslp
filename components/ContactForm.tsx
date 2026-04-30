"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SITE } from "@/shared/site";
import { Section, SectionEyebrow } from "./Section";
import { trackFormView, trackLeadSubmit } from "@/lib/analytics";
import { sha256, normalizePhone } from "@/lib/crypto";
import { sharedContent } from "@/content/shared";

type LpSource = "home" | "industry" | "agency";

/**
 * 서버에서 가공된 hidden 필드만 보냄.
 * - lp_source / category / channel / intent: 페이지 식별
 * - loc: location-map.ts 로 한글 변환된 값
 * raw URL 파라미터(loc_physical/loc_interest/kw/gclid/matchtype/device/utm_*)는
 * client collectAuto() 가 매 제출시 window.location.href 에서 fresh 캡처.
 */
type Hidden = {
  lp_source: LpSource;
  category?: string | null;
  channel?: string | null;
  intent?: string | null;
  loc?: string;
};

type Props = {
  hidden: Hidden;
  variantRef: string;
  variantKey: string;
};

const BUSINESS_TYPES = [
  "치과",
  "병원·한의원",
  "인테리어",
  "세무사·회계사",
  "쇼핑몰",
  "학원",
  "F&B (카페·음식점)",
  "기타",
];

export function ContactForm({ hidden, variantRef, variantKey }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 폼 영역 도달시 form_view 1회 발사 (IntersectionObserver)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired) {
            fired = true;
            trackFormView(variantRef, variantKey);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variantRef, variantKey]);

  // URL searchParams + referrer + user-agent 캡처.
  // ValueTrack(loc_physical/loc_interest/matchtype/device/gclid)
  // + UTM(source/medium/campaign/content/term) 표준화.
  function collectAuto() {
    const empty = {
      page_url: "",
      referrer: "",
      user_agent: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      gclid: "",
      ymclid: "",
      loc_physical: "",
      loc_interest: "",
      matchtype: "",
      device: "",
      intent: "",
      kw: "",
    };
    if (typeof window === "undefined") return empty;
    const u = new URL(window.location.href);
    const get = (k: string) => u.searchParams.get(k) ?? "";
    return {
      ...empty,
      page_url: window.location.href,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content"),
      utm_term: get("utm_term"),
      gclid: get("gclid"),
      ymclid: get("ymclid"),
      loc_physical: get("loc_physical"),
      loc_interest: get("loc_interest"),
      matchtype: get("matchtype"),
      device: get("device"),
      intent: get("intent"),
      // legacy kw — utm_term 으로 점진 이전. 둘 다 잡아둠
      kw: get("utm_term") || get("kw"),
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setErrorMsg(null);
    setStatus("submitting");

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    if (!data.name || !data.phone || !data.business) {
      setErrorMsg("필수 항목을 모두 입력해주세요.");
      setStatus("error");
      return;
    }
    if (!data.consent) {
      setErrorMsg("개인정보 수집·이용에 동의해주세요.");
      setStatus("error");
      return;
    }

    const auto = collectAuto();
    const phone = normalizePhone(data.phone ?? "");
    const phone_sha256 = phone ? await sha256(phone) : "";
    // 이메일 필드 제거 — Enhanced Conversions 매칭은 phone_sha256 만으로 진행
    const email_sha256 = "";

    const payload = {
      ...data,
      phone,
      ...auto,
      ...hidden,
      submitted_at: new Date().toISOString(),
    };

    // 1) dataLayer push (GTM 트리거 4개 발사)
    trackLeadSubmit({
      ref: variantRef,
      variant: variantKey,
      lp_source: hidden.lp_source,
      category: hidden.category,
      channel: hidden.channel,
      email_sha256,
      phone_sha256,
      extras: {
        business: data.business,
        site_url: data.site_url ?? "",
        utm_source: auto.utm_source,
        utm_medium: auto.utm_medium,
        utm_campaign: auto.utm_campaign,
        utm_content: auto.utm_content,
        utm_term: auto.utm_term,
        matchtype: auto.matchtype,
        device: auto.device,
        loc_physical: auto.loc_physical,
        loc_interest: auto.loc_interest,
        gclid: auto.gclid,
        intent: auto.intent || hidden.intent || "",
      },
    });

    // 2) /api/lead 백엔드 (검증 + 알림 + DB)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "submit failed");
      }
      const json = (await res.json()) as { id?: string };
      const idParam = json.id ? `?lead_id=${encodeURIComponent(json.id)}` : "";
      window.location.href = `/thanks${idParam}`;
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setStatus("error");
    }
  }

  return (
    <Section id="contact" className="bg-bg pb-20 pt-8 sm:pb-28 sm:pt-10">
      <div ref={sectionRef} className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionEyebrow>광고비 누수 진단</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            지금 상태를{" "}
            <span className="text-accent">30분 안에 진단</span>해 드립니다.
          </h2>
          <p className="max-w-2xl text-base text-ink-muted sm:text-lg">
            광고 계정·GA4/GTM·전환 이벤트·랜딩페이지·문의 흐름까지 — 어디서 새는지 분해해서 알려드립니다.
          </p>
        </div>

        <p className="text-center text-sm text-ink-muted sm:text-base">
          메시지가 더 편하시면 →{" "}
          <a
            href={SITE.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="contactform_kakao_inline"
            className="font-bold text-accent-deep underline-offset-4 hover:underline"
          >
            카톡으로 바로 진단 받기
          </a>
        </p>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex w-full max-w-2xl flex-col gap-5 rounded-3xl border border-line bg-bg-soft p-6 sm:p-8"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="이름" required>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputCls}
                placeholder="홍길동"
              />
            </Field>

            <Field label="연락처 (휴대폰)" required>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                pattern="[0-9\\-\\s]+"
                className={inputCls}
                placeholder="010-1234-5678"
              />
            </Field>
          </div>

          <Field label="사업 종류" required>
            <select name="business" required className={inputCls} defaultValue="">
              <option value="" disabled>
                선택
              </option>
              {BUSINESS_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="홈페이지 / 사이트 주소">
            <input
              name="site_url"
              type="url"
              autoComplete="url"
              inputMode="url"
              className={inputCls}
              placeholder="https:// (있으면 진단 정확도 ↑)"
            />
          </Field>

          <label className="flex items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              required
              className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
            />
            <span>
              <span className="font-bold text-ink">
                개인정보 수집·이용 동의 (필수)
              </span>
              <br />
              상담 응대 목적으로만 수집·이용되며 1년간 보관 후 파기합니다.{" "}
              <a
                href="/privacy"
                className="text-accent-deep underline"
                target="_blank"
                rel="noreferrer"
              >
                자세히
              </a>
            </span>
          </label>

          {/* hidden 추적 필드 — page 가 서버에서 가공한 값.
              UTM / matchtype / device / loc_physical / loc_interest 등 raw URL
              파라미터는 client collectAuto() 가 매 제출시 fresh 캡처해서 흘림. */}
          <input type="hidden" name="lp_source" value={hidden.lp_source} />
          <input type="hidden" name="category" value={hidden.category ?? ""} />
          <input type="hidden" name="channel" value={hidden.channel ?? ""} />
          <input type="hidden" name="intent" value={hidden.intent ?? ""} />
          <input type="hidden" name="loc" value={hidden.loc ?? ""} />

          {errorMsg ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-lg font-bold tracking-tight text-white shadow-[0_12px_30px_-10px_color-mix(in_oklab,var(--color-accent)_55%,transparent)] transition hover:bg-accent-hover hover:translate-y-[-1px] disabled:opacity-60"
          >
            {status === "submitting" ? "보내는 중..." : "30분 무료 진단 신청"}
          </button>

          <p className="text-center text-xs text-ink-subtle">
            * 영업일 기준 24시간 내 답변. 또는{" "}
            <a
              href="https://pf.kakao.com/_RWCTX/chat"
              target="_blank"
              rel="noreferrer"
              className="text-accent-deep underline"
            >
              카카오톡 채널
            </a>
            로도 가능합니다.
          </p>
        </form>

        <p className="text-center text-xs text-ink-subtle">{sharedContent.promiseLine}</p>
      </div>
    </Section>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold tracking-tight text-ink">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </span>
      {children}
    </label>
  );
}
