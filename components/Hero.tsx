import { SITE } from "@/shared/site";
import { highlightHeadline } from "@/lib/highlight";
import { Section } from "./Section";
import { KakaoCta } from "./KakaoCta";

type Props = {
  headline: string;
  accentWords?: string[];
  subhead: string;
  eyebrow?: string;
  /** primary = 카톡 채팅 직결 (메인 CTA). label 만 LP 별 카피로 변동 가능. */
  ctaPrimary: { label: string; href: string };
  /** secondary = 폼 점프 (보조). 기본 #contact. */
  ctaSecondary?: { label: string; href: string };
  /** GA4/dataLayer 추적용 */
  variantRef: string;
  variantKey: string;
};

const HERO_PROOF_ITEMS = [
  "광고주 전용 운영 보드 공유",
  "매일 확인 가능",
  "30분 무료 진단",
];

export function Hero({
  headline,
  accentWords,
  subhead,
  eyebrow,
  ctaPrimary,
  ctaSecondary,
  variantRef,
  variantKey,
}: Props) {
  return (
    <Section
      id="hero"
      className="pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-24"
    >
      <div className="flex flex-col gap-12 sm:gap-14">
        <header className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
              aria-hidden
            />
            <span>{SITE.brand}</span>
          </a>
          <a
            href="#process"
            className="hidden text-sm font-medium text-ink-muted hover:text-ink sm:inline"
          >
            운영 방식 보기 →
          </a>
        </header>

        <div className="flex flex-col items-center gap-7 text-center">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-accent-soft px-3.5 py-1.5 text-xs font-bold tracking-tight text-accent-deep">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </span>
          ) : null}

          <h1 className="max-w-4xl text-[clamp(2.25rem,6.4vw,4.75rem)] font-black leading-[1.05] tracking-[-0.035em] text-ink">
            {highlightHeadline(headline, accentWords)}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            {subhead}
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <KakaoCta
              href={ctaPrimary.href}
              variantRef={variantRef}
              variantKey={variantKey}
              placement="hero_primary"
              label={ctaPrimary.label}
              tone="primary"
              size="lg"
            />
            {ctaSecondary ? (
              <a
                href={ctaSecondary.href}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-line-strong bg-bg px-8 text-base font-bold tracking-tight text-ink transition hover:border-ink hover:bg-bg-soft hover:translate-y-[-1px]"
              >
                {ctaSecondary.label}
              </a>
            ) : null}
          </div>

          {/* CTA 직하 작은 보조 proof 줄 — 무거운 카드 없이 신뢰 시그널만 */}
          <ul
            aria-label="제로애드 핵심 약속"
            className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
          >
            {HERO_PROOF_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-xs font-semibold tracking-tight text-ink-muted sm:text-sm"
              >
                <span aria-hidden className="text-accent">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
