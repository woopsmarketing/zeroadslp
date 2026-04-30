// LP-B 채널 detect 규칙 미러 테스트.
// content/channels.ts 의 detectChannel 변경시 본 미러도 동기화.
import { test } from "node:test";
import assert from "node:assert/strict";

const VALID_CHANNELS = ["naver", "google", "meta", "kakao", "youtube", "default"];

function detectSpec(kw, ch) {
  const chStr = Array.isArray(ch) ? ch[0] : ch;
  if (chStr && VALID_CHANNELS.includes(chStr)) return chStr;
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

test("ch 명시 — 그대로", () => {
  assert.equal(detectSpec(undefined, "naver"), "naver");
  assert.equal(detectSpec(undefined, "google"), "google");
  assert.equal(detectSpec(undefined, "meta"), "meta");
  assert.equal(detectSpec(undefined, "kakao"), "kakao");
  assert.equal(detectSpec(undefined, "youtube"), "youtube");
});

test("ch 무효 + kw 없음 → default", () => {
  assert.equal(detectSpec(undefined, "instagram"), "default");
  assert.equal(detectSpec(undefined, undefined), "default");
});

test("kw 한국어 매체명 매칭", () => {
  assert.equal(detectSpec("네이버광고대행"), "naver");
  assert.equal(detectSpec("구글 애즈 운영"), "google");
  assert.equal(detectSpec("메타 광고"), "meta");
  assert.equal(detectSpec("페이스북 광고"), "meta");
  assert.equal(detectSpec("인스타 광고"), "meta");
  assert.equal(detectSpec("카카오 비즈보드"), "kakao");
  assert.equal(detectSpec("유튜브 광고"), "youtube");
});

test("kw 영문 매체명 매칭", () => {
  assert.equal(detectSpec("naver ads"), "naver");
  assert.equal(detectSpec("Google Ads agency"), "google");
});

test("일반 키워드 → default", () => {
  assert.equal(detectSpec("광고대행"), "default");
  assert.equal(detectSpec(""), "default");
});

test("배열 입력 → 첫 요소", () => {
  assert.equal(detectSpec(["네이버광고", "ignored"]), "naver");
  assert.equal(detectSpec(undefined, ["google", "ignored"]), "google");
});
