import { SITE } from "@/shared/site";
import { Section, SectionEyebrow } from "./Section";

const PAIN_POINTS = [
  {
    title: "클릭은 많은데 문의가 없다",
    desc: "광고비는 새는데 전환은 묶임. LP 또는 폼 문제일 가능성이 큽니다.",
  },
  {
    title: "매주 PDF 받지만 어디서 새는지 모른다",
    desc: "리포트 받아도 답답함은 그대로. 키워드별·시간대별 낭비가 안 보임.",
  },
  {
    title: "ROAS 계산을 못 해본 지 오래됐다",
    desc: "전환 추적(GA4·픽셀) 셋업이 안 돼있거나, 끊긴 상태일 수 있습니다.",
  },
  {
    title: "대행사에 물어보면 다음 주에 답이 온다",
    desc: "운영 관성으로 굴러갈 뿐, 광고주가 직접 데이터를 볼 수 없는 구조.",
  },
];

const DIAGNOSIS_MATRIX = [
  {
    symptom: "노출이 안 됨",
    cause: "타겟·입찰·예산",
    fix: "광고 셋업",
  },
  {
    symptom: "클릭이 안 됨",
    cause: "소재·카피",
    fix: "광고 소재 개선",
  },
  {
    symptom: "클릭은 되는데 문의 없음",
    cause: "랜딩·제안·신뢰",
    fix: "LP 개선",
  },
  {
    symptom: "문의는 있는데 매출 안 남",
    cause: "세일즈·상품·응대",
    fix: "폼·CRM 컨설팅",
  },
];

export function PainPoints() {
  return (
    <Section id="pain" className="bg-bg-soft py-20 sm:py-24">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionEyebrow>이런 문제, 있으시죠?</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            광고는 돌고 있는데, <span className="text-accent">답답하지 않으세요?</span>
          </h2>
        </div>

        <ul className="grid w-full gap-4 text-left sm:grid-cols-2">
          {PAIN_POINTS.map((p) => (
            <li
              key={p.title}
              className="flex gap-3.5 rounded-2xl border border-line bg-bg p-6"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-deep"
              >
                ?
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-bg p-6 sm:p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              광고가 안 될 때, <span className="text-accent">어디가 막혔는지 분해해서 봅니다.</span>
            </h3>
          </div>

          {/* desktop: 표 / mobile: 카드 */}
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-bold uppercase tracking-wider text-ink-muted">
                  <th className="py-3 pr-4">증상</th>
                  <th className="py-3 px-4">진짜 원인</th>
                  <th className="py-3 pl-4">우리가 손대는 곳</th>
                </tr>
              </thead>
              <tbody>
                {DIAGNOSIS_MATRIX.map((row) => (
                  <tr key={row.symptom} className="border-b border-line/60 last:border-0">
                    <td className="py-3.5 pr-4 font-semibold text-ink">{row.symptom}</td>
                    <td className="py-3.5 px-4 text-ink-muted">{row.cause}</td>
                    <td className="py-3.5 pl-4 font-semibold text-accent-deep">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {DIAGNOSIS_MATRIX.map((row) => (
              <li key={row.symptom} className="flex flex-col gap-1.5 rounded-xl border border-line bg-bg-soft p-4">
                <p className="text-sm font-bold tracking-tight text-ink">{row.symptom}</p>
                <p className="text-xs text-ink-muted">→ 원인: {row.cause}</p>
                <p className="text-xs font-semibold text-accent-deep">→ 우리가 손대는 곳: {row.fix}</p>
              </li>
            ))}
          </ul>

          <p className="text-center text-sm text-ink-muted">
            광고를 잘한다는 건, <span className="font-bold text-ink">어디가 막혔는지 분해해서 보는 능력</span>입니다.
          </p>
        </div>

        <a
          href={SITE.kakaoChannel}
          target="_blank"
          rel="noopener noreferrer"
          data-placement="painpoints_kakao"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-white shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] ring-1 ring-accent/20 transition hover:bg-accent-hover hover:translate-y-[-1px]"
        >
          카톡으로 진단 받기
        </a>
      </div>
    </Section>
  );
}
