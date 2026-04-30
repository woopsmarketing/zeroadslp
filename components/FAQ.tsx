import { Section, SectionEyebrow } from "./Section";
import type { FaqItem } from "@/content/shared";

export function FAQ({
  items,
  title = "먼저 궁금한 것들.",
}: {
  items: readonly FaqItem[];
  title?: string;
}) {
  return (
    <Section id="faq" className="bg-bg py-24 sm:py-32">
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-5">
          <SectionEyebrow>자주 묻는 질문</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-line bg-bg-soft text-left">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="group border-b border-line bg-bg last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-6 text-base font-bold tracking-tight text-ink sm:p-7 sm:text-lg">
                <span>{item.q}</span>
                <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line text-ink-muted transition group-open:rotate-45 group-open:border-accent group-open:bg-accent-soft group-open:text-accent">
                  <svg
                    viewBox="0 0 14 14"
                    className="h-3.5 w-3.5"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-line px-6 pb-6 pt-4 sm:px-7">
                <p className="max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
