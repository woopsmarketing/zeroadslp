/**
 * LP-B 종합 광고대행 — 헤드라인 통합 단일.
 *
 * 매체별 헤드라인 분리는 폐기 (2026-04-28 결정). 본문이 동일하기 때문.
 * 다만 `?ch=` / `?kw=` 파라미터는 다음 용도로 살아있음:
 *   1) 디자인 액센트 컬러 (`data-channel` cascade — 구글=빨강 / 네이버=초록)
 *   2) GA4 segmentation (variantKey = `agency_${channel}`)
 *   3) 활성 ChannelChip 강조
 *   4) eyebrow 라벨 — 매체 매칭 (선택)
 *   5) hidden field 추적
 */
export type ChannelSlug =
  | "default"
  | "naver"
  | "google"
  | "meta"
  | "kakao"
  | "youtube";

export const VALID_CHANNELS: readonly ChannelSlug[] = [
  "default",
  "naver",
  "google",
  "meta",
  "kakao",
  "youtube",
] as const;

export const AGENCY_HEADLINE =
  "광고대행 — 네이버·구글·메타·카카오·유튜브 통합 운영";
export const AGENCY_ACCENT_WORDS = ["통합 운영"];
export const AGENCY_SUBHEAD =
  "광고 계정·GA4·GTM·랜딩페이지·문의 흐름까지 진단하고 매주 개선합니다. 운영 현황은 광고주 전용 보드 공유 URL로 매일 직접 확인합니다.";

/**
 * intent 파라미터 — "광고 문제형" 키워드 (예: "광고 효과 안나옴", "대행사 답답")
 * 진입자에게 공감 톤 헤드라인으로 스위칭.
 */
export const VALID_INTENTS = ["problem"] as const;
export type IntentSlug = (typeof VALID_INTENTS)[number];

export function detectIntent(value?: string | string[]): IntentSlug | "" {
  const v = Array.isArray(value) ? value[0] : value;
  if (v && (VALID_INTENTS as readonly string[]).includes(v))
    return v as IntentSlug;
  return "";
}

export const INTENT_PROBLEM = {
  headline: "광고비가 어디로 새는지, 모르고 계셨나요?",
  accentWords: ["광고비가 어디로 새는지"] as string[],
  subhead:
    "30분 무료 진단으로 광고비·전환·낭비 키워드를 직접 보여드립니다.",
};

export function detectChannel(
  kw?: string | string[],
  ch?: string | string[]
): ChannelSlug {
  const chStr = Array.isArray(ch) ? ch[0] : ch;
  if (chStr && (VALID_CHANNELS as readonly string[]).includes(chStr)) {
    return chStr as ChannelSlug;
  }

  const kwStr = Array.isArray(kw) ? kw[0] : kw;
  if (!kwStr) return "default";
  const lower = kwStr.toLowerCase();
  if (lower.includes("네이버") || lower.includes("naver")) return "naver";
  if (
    lower.includes("구글") ||
    lower.includes("google") ||
    lower.includes("애즈") ||
    lower.includes("ads")
  )
    return "google";
  if (
    lower.includes("메타") ||
    lower.includes("meta") ||
    lower.includes("페이스북") ||
    lower.includes("facebook") ||
    lower.includes("인스타") ||
    lower.includes("instagram")
  )
    return "meta";
  if (lower.includes("카카오") || lower.includes("kakao")) return "kakao";
  if (lower.includes("유튜브") || lower.includes("youtube")) return "youtube";
  return "default";
}

export function channelToDesignChannel(
  channel: ChannelSlug
): "google" | "naver" | "mixed" {
  if (channel === "google") return "google";
  if (channel === "naver") return "naver";
  return "mixed";
}

/** eyebrow 라벨 — 매체 검색에서 도착한 경우 작은 매칭 신호용 */
export function channelEyebrow(channel: ChannelSlug): string {
  switch (channel) {
    case "naver":
      return "네이버 검색광고";
    case "google":
      return "구글 광고";
    case "meta":
      return "메타(페이스북·인스타그램) 광고";
    case "kakao":
      return "카카오 광고";
    case "youtube":
      return "유튜브 광고";
    default:
      return "종합 광고대행";
  }
}

/** ChannelChips active 강조용 — 매체 한국어 라벨 */
export function channelToChipLabel(channel: ChannelSlug): string | undefined {
  const map: Record<ChannelSlug, string | undefined> = {
    default: undefined,
    naver: "네이버",
    google: "구글",
    meta: "메타(페이스북·인스타그램)",
    kakao: "카카오",
    youtube: "유튜브",
  };
  return map[channel];
}
