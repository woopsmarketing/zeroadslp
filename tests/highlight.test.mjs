// JS 미러 — TS 함수 highlightHeadline 의 동작 규칙을 동일 알고리즘으로 검증.
// 실제 함수가 변경되면 이 미러도 동기화 필요. 깨지면 알림.
import { test } from "node:test";
import assert from "node:assert/strict";

function highlightSpec(text, accentWords) {
  if (!accentWords || accentWords.length === 0) return [text];
  const sorted = [...accentWords].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part) => ({
    text: part,
    accent: sorted.includes(part),
  }));
}

test("accentWords 미지정시 원문 그대로", () => {
  const r = highlightSpec("매일 일일보고서를 직접 보세요.", undefined);
  assert.deepEqual(r, ["매일 일일보고서를 직접 보세요."]);
});

test("단일 accent 단어 강조", () => {
  const r = highlightSpec(
    "주간보고서? 월간보고서? 매일 일일보고서를 직접 보세요.",
    ["매일 일일보고서"]
  );
  const accentParts = r.filter((p) => p.accent);
  assert.equal(accentParts.length, 1);
  assert.equal(accentParts[0].text, "매일 일일보고서");
});

test("여러 accent 단어 모두 매칭", () => {
  const r = highlightSpec("광고 처음 시작 — 첫날부터 직접 보세요.", [
    "첫날부터",
    "직접",
  ]);
  const accents = r.filter((p) => p.accent).map((p) => p.text);
  assert.deepEqual(accents.sort(), ["직접", "첫날부터"].sort());
});

test("긴 매칭 우선 — 부분 중복시 큰 단어가 먼저", () => {
  const r = highlightSpec("매일 일일보고서를 매일 봅니다.", [
    "매일",
    "매일 일일보고서",
  ]);
  const accents = r.filter((p) => p.accent).map((p) => p.text);
  assert.ok(accents.includes("매일 일일보고서"), "긴 패턴 매칭");
  assert.ok(accents.includes("매일"), "남은 짧은 패턴 매칭");
});

test("정규식 메타문자 이스케이프 — 단어에 . 또는 ? 포함", () => {
  const r = highlightSpec("Q. 무엇인가요? A.", ["Q.", "A."]);
  const accents = r.filter((p) => p.accent).map((p) => p.text);
  assert.deepEqual(accents.sort(), ["A.", "Q."]);
});
