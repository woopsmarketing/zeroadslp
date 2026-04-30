import type { ReactNode } from "react";

/**
 * 헤드라인 텍스트에서 accentWords 에 해당하는 부분만 색 강조 span 으로 감싼다.
 * 한국어는 단어 경계가 명확하지 않아 substring 매칭 사용.
 */
export function highlightHeadline(
  text: string,
  accentWords?: string[]
): ReactNode {
  if (!accentWords || accentWords.length === 0) return text;

  const sorted = [...accentWords].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");

  const parts = text.split(re);
  return parts.map((part, i) => {
    if (sorted.includes(part)) {
      return (
        <span key={i} className="text-accent">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
