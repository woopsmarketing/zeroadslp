import { Section } from "./Section";

const ITEMS = [
  "GA4 / GTM / 전환 이벤트 점검",
  "네이버 / 구글 / 메타 / 카카오 운영",
  "광고주 직접 결제",
  "주간 개선 루프",
];

export function TrustBar() {
  return (
    <Section id="trust" className="bg-bg-soft py-6 sm:py-8">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
        {ITEMS.map((label, i) => (
          <li
            key={label}
            className="flex items-center gap-3 text-xs font-bold tracking-tight text-ink-muted sm:text-sm"
          >
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{label}</span>
            {i < ITEMS.length - 1 ? (
              <span aria-hidden className="hidden text-line-strong sm:inline">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
