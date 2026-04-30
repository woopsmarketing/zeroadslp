import { SITE } from "@/shared/site";
import { Section, SectionEyebrow } from "./Section";
import { DiagnosisResultCard } from "./DiagnosisResultCard";

const CHECK_ITEMS = [
  { title: "광고비가 어디로 새는지", desc: "키워드별·시간대별 낭비 구간." },
  { title: "전환 추적이 정확한지", desc: "GA4 / GTM / 픽셀 셋업 점검." },
  { title: "LP가 전환에 적합한지", desc: "헤드라인·CTA·폼 흐름 검토." },
  { title: "다음 30일 액션 플랜", desc: "예산·매체·키워드·소재 우선순위." },
];

export function DiagnosisReportSample() {
  return (
    <Section id="diagnosis" className="bg-bg py-20 sm:py-24">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionEyebrow>30분 무료 진단</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            진단은 이렇게{" "}
            <span className="text-accent">4가지 누수 구간</span>을 분해해 드립니다.
          </h2>
          <p className="max-w-2xl text-sm text-ink-muted sm:text-base">
            진단에서 확인하는 항목과, 결과 리포트가 전달되는 형태입니다.
          </p>
        </div>

        {/* 위: 4개 체크 항목 */}
        <ul className="grid w-full gap-4 text-left sm:grid-cols-2">
          {CHECK_ITEMS.map((it, i) => (
            <li
              key={it.title}
              className="flex gap-4 rounded-2xl border border-line bg-bg-soft p-6"
            >
              <span className="font-mono text-xs font-bold tracking-widest text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  {it.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {it.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* 아래: 샘플 결과 카드 */}
        <div className="flex w-full max-w-3xl flex-col items-center gap-3">
          <p className="text-xs font-semibold tracking-tight text-ink-subtle sm:text-sm">
            ↓ 진단 후 받게 되는 리포트 예시
          </p>
          <DiagnosisResultCard />
        </div>

        <a
          href={SITE.kakaoChannel}
          target="_blank"
          rel="noopener noreferrer"
          data-placement="diagnosis_sample_kakao"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-white shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] ring-1 ring-accent/20 transition hover:bg-accent-hover hover:translate-y-[-1px]"
        >
          카톡으로 진단 받기
        </a>
      </div>
    </Section>
  );
}
