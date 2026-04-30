import { Section, SectionEyebrow } from "./Section";

type Step = {
  title: string;
  hint: string;
};

const STEPS: Step[] = [
  { title: "광고 계정", hint: "구조 점검" },
  { title: "추적 세팅", hint: "전환 이벤트 검증" },
  { title: "랜딩 점검", hint: "CTA·신뢰 요소" },
  { title: "문의 흐름", hint: "폼·CRM 확인" },
  { title: "주간 개선", hint: "매주 수정·재테스트" },
];

export function ServicesFlow() {
  return (
    <Section id="services" className="bg-bg py-14 sm:py-20">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionEyebrow>5단계 운영 흐름</SectionEyebrow>
          <h2 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-3xl md:text-4xl">
            한 영역만 잘해도 광고는 돌고,{" "}
            <span className="text-accent">한 영역이 막히면 광고비가 샙니다.</span>
          </h2>
        </div>

        {/* Desktop: 가로 stepper (5 노드 + 얇은 연결선) */}
        <ol className="hidden w-full items-center md:flex">
          {STEPS.map((s, i) => (
            <StepFragment
              key={s.title}
              step={s}
              index={i}
              last={i === STEPS.length - 1}
            />
          ))}
        </ol>

        {/* Mobile: 세로 stepper */}
        <ol className="flex w-full flex-col gap-0 md:hidden">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg text-sm font-bold tabular-nums text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < STEPS.length - 1 ? (
                  <span aria-hidden className="my-1 h-8 w-px bg-line-strong" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-0.5 pb-6">
                <p className="text-base font-bold tracking-tight text-ink">
                  {s.title}
                </p>
                <p className="text-sm text-ink-muted">{s.hint}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function StepFragment({
  step,
  index,
  last,
}: {
  step: Step;
  index: number;
  last: boolean;
}) {
  return (
    <>
      <li className="flex flex-1 flex-col items-center gap-2 px-2 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-bg-soft text-sm font-bold tabular-nums text-ink">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-sm font-bold tracking-tight text-ink">
          {step.title}
        </p>
        <p className="text-xs text-ink-muted">{step.hint}</p>
      </li>
      {!last ? (
        <li
          aria-hidden
          className="mx-1 h-px flex-1 bg-line-strong"
        />
      ) : null}
    </>
  );
}
