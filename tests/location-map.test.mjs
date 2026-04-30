// LOCATION_MAP fallback 테스트 — placeholder 코드가 ID 갱신되어도 fallback 로직은 유지.
import { test } from "node:test";
import assert from "node:assert/strict";

const SAMPLE_MAP = {
  "1009871": "서울",
  "1011554": "강남구",
};

function fallbackSpec(code, map = SAMPLE_MAP) {
  const c = Array.isArray(code) ? code[0] : code;
  return c && map[c] ? map[c] : "";
}

test("등록된 코드 → 지역명", () => {
  assert.equal(fallbackSpec("1009871"), "서울");
  assert.equal(fallbackSpec("1011554"), "강남구");
});

test("미등록 코드 → 빈 문자열", () => {
  assert.equal(fallbackSpec("9999999"), "");
});

test("undefined/empty → 빈 문자열", () => {
  assert.equal(fallbackSpec(undefined), "");
  assert.equal(fallbackSpec(""), "");
});

test("배열 입력 → 첫 요소 사용", () => {
  assert.equal(fallbackSpec(["1009871", "x"]), "서울");
});
