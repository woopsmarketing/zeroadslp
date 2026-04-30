/**
 * Enhanced Conversions 용 SHA-256 해시.
 * Google Ads 권장: 입력값을 normalize (trim + lowercase) 후 해시.
 * 전화번호는 +82… E.164 형식 권장이지만 본 구현은 비숫자 제거만 처리.
 */
export async function sha256(input: string): Promise<string> {
  if (!input) return "";
  const normalized = input.trim().toLowerCase();
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}
