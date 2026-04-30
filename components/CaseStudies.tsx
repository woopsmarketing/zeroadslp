import { Section, SectionEyebrow } from "./Section";

export type CaseScenario = {
  /** 가상 시나리오 라벨 — 실 광고주 명 X */
  segment: string;
  before: string;
  diagnosis: string;
  action: string;
  result: string;
};

const DEFAULT_SCENARIOS: CaseScenario[] = [
  {
    segment: "클릭은 나오는데 문의가 없던 계정",
    before: "광고비 250만원, 클릭 1,200회, 문의 8건",
    diagnosis: "랜딩 CTA 약함 + 전환 추적 누락",
    action: "헤드라인·CTA·폼 개편 + GA4 이벤트 재설정",
    result: "문의율 1.8배, CPL 32% 절감",
  },
  {
    segment: "문의는 있는데 질이 낮던 계정",
    before: "광고비 180만원, 문의 35건, 계약 11%",
    diagnosis: "광범위 키워드 비중 60% + 폼 필터 없음",
    action: "정보성 키워드 제외 + 폼에 예산 필터",
    result: "유효 문의율 2.4배, 계약 11% → 24%",
  },
  {
    segment: "추적이 안 되던 계정",
    before: "광고비 320만원, 전환 데이터 신뢰 불가",
    diagnosis: "GA4 측정 ID 중복 + GTM 트리거 누락",
    action: "GA4·GTM 재설계 + Enhanced Conversions 셋업",
    result: "전환 측정 정확도 확보, ROAS 판단 가능",
  },
];

export function CaseStudies({
  scenarios = DEFAULT_SCENARIOS,
}: {
  scenarios?: CaseScenario[];
}) {
  return (
    <Section id="cases" className="bg-bg-soft py-16 sm:py-28">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionEyebrow>진단 리포트 샘플</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            실제 진단은{" "}
            <span className="text-accent">이런 방식</span>으로 진행됩니다.
          </h2>
          <p className="max-w-2xl text-sm text-ink-muted sm:text-base">
            아래는 <span className="font-bold text-ink">진단 리포트 샘플</span>입니다.
            실 광고주 사례는 60일 운영 후 동의하에 갱신됩니다.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          {scenarios.map((s) => (
            <article
              key={s.segment}
              className="flex flex-col gap-4 rounded-2xl border border-line-strong bg-bg p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)] sm:p-7"
            >
              <header className="flex flex-col gap-2.5 border-b border-line pb-4">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-deep">
                  Sample
                </span>
                <h3 className="text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
                  {s.segment}
                </h3>
              </header>

              <Row label="문제" content={s.before} />
              <Row label="진단" content={s.diagnosis} />
              <Row label="조치" content={s.action} />
              <div className="mt-1 rounded-xl border border-accent/40 bg-accent-soft p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-accent-deep">
                  결과
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink">
                  {s.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Row({ label, content }: { label: string; content: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p className="text-sm leading-snug text-ink-muted">{content}</p>
    </div>
  );
}
