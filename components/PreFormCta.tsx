import { SITE } from "@/shared/site";
import { Section } from "./Section";

const REASONS = [
  "광고비는 쓰는데 문의가 안 나오는 경우",
  "문의는 오는데 계약이 안 되는 경우",
  "어떤 채널이 먹히는지 판단이 안 되는 경우",
  "GA4 / 픽셀 / 전환 추적이 애매한 경우",
];

export function PreFormCta() {
  return (
    <Section id="why-now" className="bg-bg pb-2 pt-16 sm:pb-3 sm:pt-20">
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-line bg-bg-soft p-7 sm:p-9">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-deep">
              지금 진단이 필요한 경우
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              이런 경우 바로 진단이 필요합니다.
            </h3>
          </div>

          <ul className="flex flex-col gap-2.5 text-left sm:gap-3">
            {REASONS.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-4 text-base leading-relaxed text-ink-muted sm:p-5"
              >
                <span
                  aria-hidden
                  className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-accent"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <p className="text-base font-bold tracking-tight text-ink sm:text-lg">
              지금 상태를 <span className="text-accent">30분 안에</span> 진단해 드립니다.
            </p>
            <a
              href={SITE.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="preform_kakao"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-white shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] ring-1 ring-accent/20 transition hover:bg-accent-hover hover:translate-y-[-1px]"
            >
              카톡으로 진단 받기
            </a>
            <a
              href="#contact"
              className="text-xs font-medium text-ink-subtle underline-offset-4 hover:text-ink hover:underline"
            >
              또는 폼 작성 ↓
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
