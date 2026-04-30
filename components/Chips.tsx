import { Section, SectionEyebrow } from "./Section";

type Props = {
  items: readonly string[];
  active?: string;
  eyebrow: string;
  title: string;
};

/**
 * 산업/매체 칩 나열 — QS(검색광고 품질 점수) 보강용 키워드 표면.
 * IndustryChips, ChannelChips 의 공통 구현.
 */
export function Chips({ items, active, eyebrow, title }: Props) {
  return (
    <Section className="bg-bg py-12 sm:py-20">
      <div className="flex flex-col items-center gap-7 text-center">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-3xl">
          {title}
        </h2>
        <ul className="flex flex-wrap justify-center gap-2.5">
          {items.map((label) => {
            const isActive = active === label;
            return (
              <li
                key={label}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition ${
                  isActive
                    ? "border border-accent bg-accent-soft text-accent-deep"
                    : "border border-line bg-bg-soft text-ink-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

export function IndustryChips({
  items,
  active,
}: {
  items: readonly string[];
  active?: string;
}) {
  return (
    <Chips
      items={items}
      active={active}
      eyebrow="운영 산업"
      title="이런 산업도 함께 운영합니다."
    />
  );
}

export function ChannelChips({
  items,
  active,
}: {
  items: readonly string[];
  active?: string;
}) {
  return (
    <Chips
      items={items}
      active={active}
      eyebrow="운영 매체"
      title="매체에 갇히지 않습니다."
    />
  );
}
