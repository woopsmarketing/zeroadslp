declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set" | "js" | "consent",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type EventParams = Record<string, unknown>;

/** GTM/GA4 통합 dataLayer push. GTM 컨테이너가 없어도 안전하게 no-op. */
export function pushDataLayer(payload: EventParams): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** 단순 GA4 이벤트 (gtag 직접). dataLayer 와 별개로 호환 유지. */
export function trackEvent(name: string, params?: EventParams): void {
  pushDataLayer({ event: name, ...(params ?? {}) });
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

export function trackVariantView(ref: string, variant: string): void {
  trackEvent("variant_view", { ref, variant });
}

export function trackKakaoClick(
  ref: string,
  variant: string,
  placement: string
): void {
  trackEvent("kakao_click", { ref, variant, placement });
}

export function trackPhoneClick(ref: string, variant: string): void {
  trackEvent("phone_click", { ref, variant });
}

export function trackFormView(ref: string, variant: string): void {
  trackEvent("form_view", { ref, variant });
}

/**
 * 폼 제출 — GA4 generate_lead + Google Ads conversion 트리거 (GTM 측에서 매핑).
 * Enhanced Conversions: user_data 에 email_sha256, phone_sha256 동봉.
 */
export function trackLeadSubmit(payload: {
  ref: string;
  variant: string;
  lp_source: string;
  category?: string | null;
  channel?: string | null;
  email_sha256?: string;
  phone_sha256?: string;
  extras?: EventParams;
}): void {
  pushDataLayer({
    event: "lead_submit",
    user_data: {
      email_sha256: payload.email_sha256 ?? "",
      phone_sha256: payload.phone_sha256 ?? "",
    },
    ...payload.extras,
    ref: payload.ref,
    variant: payload.variant,
    lp_source: payload.lp_source,
    category: payload.category ?? null,
    channel: payload.channel ?? null,
  });
}

export {};
