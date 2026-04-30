import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  business?: string;
  /** 새 필드 — 사이트 URL */
  site_url?: string;
  /** 새 필드 — running / paused / none */
  ad_status?: string;
  budget?: string;
  message?: string;
  consent?: string;
  // 페이지 식별 (서버 가공)
  lp_source?: string;
  category?: string;
  channel?: string;
  intent?: string;
  loc?: string; // 한글 변환됨
  // ValueTrack — Google Ads 표준
  loc_physical?: string;
  loc_interest?: string;
  matchtype?: string;
  device?: string;
  gclid?: string;
  ymclid?: string;
  // UTM 표준
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // legacy
  kw?: string;
  // 메타
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  submitted_at?: string;
};

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // 1) 검증 — 4필드 모드 (이름/연락처/업종 필수, 카톡 메인 정책)
  if (!body.name || !body.phone || !body.business) {
    return NextResponse.json(
      { error: "missing_required_fields" },
      { status: 400 }
    );
  }
  if (body.consent !== "yes") {
    return NextResponse.json({ error: "missing_consent" }, { status: 400 });
  }

  // 2) DB 저장 — Supabase env 가 있으면 저장, 없으면 stub id 발급
  let id = `stub_${Date.now()}`;
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supaUrl && supaKey) {
    try {
      const r = await fetch(`${supaUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
          "content-type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        const arr = (await r.json()) as Array<{ id?: string | number }>;
        const first = arr?.[0];
        if (first?.id != null) id = String(first.id);
      } else {
        console.error("[lead] supabase insert failed:", r.status, await r.text());
      }
    } catch (e) {
      console.error("[lead] supabase error:", e);
    }
  }

  // 3) Slack 알림 (env 있을 때만)
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl) {
    try {
      await fetch(slackUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: `:new: 새 리드 — ${body.name} (${body.phone}) · ${
            body.lp_source ?? "?"
          }/${body.category ?? body.channel ?? "-"} · ${body.business ?? "-"}${
            body.site_url ? ` · ${body.site_url}` : ""
          }`,
        }),
      });
    } catch (e) {
      console.error("[lead] slack error:", e);
    }
  }

  // 4) 카톡 알림톡 — Solapi env 있을 때만 (실제 발송 페이로드는 솔라피 가입 후 템플릿 등록 필요)
  const solapiKey = process.env.SOLAPI_API_KEY;
  const solapiSecret = process.env.SOLAPI_API_SECRET;
  if (solapiKey && solapiSecret) {
    // 실제 발송은 템플릿 ID 등록 후 활성화. Phase 0 에서는 키 존재만 확인하고 로그.
    console.info("[lead] solapi configured, alimtalk template integration pending");
  }

  return NextResponse.json({ id });
}
