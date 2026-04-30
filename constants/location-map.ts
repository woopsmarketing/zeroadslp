/**
 * Google Ads ValueTrack {LOCATION(City)} 코드 → 한국어 지역명 매핑.
 *
 * ⚠️ 본 코드들은 placeholder 임. 빌드 후 Google Ads "위치 ID" 도구
 * (https://developers.google.com/google-ads/api/reference/data/geotargets)
 * 에서 실제 캠페인이 타겟팅한 지역의 정확 ID 로 갱신 필요.
 */
export const LOCATION_MAP: Record<string, string> = {
  "1009871": "서울",
  "1011554": "강남구",
  "1009872": "부산",
  "1009873": "대구",
  "1009874": "인천",
  "1009875": "광주",
  "1009876": "대전",
  "1009877": "울산",
  "1009878": "세종",
  "1009879": "경기",
  "1009880": "강원",
  "1009881": "충북",
  "1009882": "충남",
  "1009883": "전북",
  "1009884": "전남",
  "1009885": "경북",
  "1009886": "경남",
  "1009887": "제주",
};

export function fallbackLocation(code?: string | string[]): string {
  const c = Array.isArray(code) ? code[0] : code;
  return c && LOCATION_MAP[c] ? LOCATION_MAP[c] : "";
}
