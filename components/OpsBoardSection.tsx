import Image from "next/image";
import { Section, SectionEyebrow } from "./Section";

const VISIBLE_ITEMS = [
  {
    title: "무슨 일이 진행 중인지 보입니다",
    desc: "캠페인·예산·전환·문의 흐름을 한눈에 봅니다.",
  },
  {
    title: "대행사가 뭘 했는지 보입니다",
    desc: "소재 수정·예산 조정·전환 셋업·테스트 내역까지 확인합니다.",
  },
  {
    title: "주간 개선 루프가 보입니다",
    desc: "분석 → 수정 → 재테스트 흐름을 리포트와 보드에서 함께 봅니다.",
  },
];

const PROOF_BADGES = [
  "매일 업데이트",
  "공유 URL 제공",
  "광고주 직접 확인",
];

export function OpsBoardSection() {
  return (
    <Section id="ops-board" className="bg-bg-soft py-24 sm:py-32">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionEyebrow>운영 가시성</SectionEyebrow>
          <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            광고 운영,{" "}
            <span className="text-accent">맡기고 끝나지 않습니다.</span>
          </h2>
          <p className="max-w-2xl text-base text-ink-muted sm:text-lg">
            전환·예산·문의 흐름·진행 중 액션까지 — 광고주 전용 운영 보드 공유 URL로 매일 직접 확인합니다.
          </p>
        </div>

        {/* 썸네일 + 배지 */}
        <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div className="overflow-hidden rounded-3xl border border-line-strong bg-bg shadow-[0_30px_80px_-30px_rgba(15,23,42,0.22)]">
            <div className="flex items-center gap-2 border-b border-line bg-bg-soft px-5 py-3">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-red-400" />
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 truncate text-xs font-medium text-ink-subtle sm:text-sm">
                board.zeroads.kr/share/···
              </span>
            </div>
            <Image
              src="/dashboard-hero.webp"
              width={985}
              height={617}
              alt="광고주 전용 운영 보드 미리보기 — 광고비·전환·문의 흐름 한눈에"
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 55vw, 700px"
              className="h-auto w-full"
            />
          </div>

          <ul className="flex flex-col gap-3">
            {PROOF_BADGES.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 rounded-2xl border border-line bg-bg p-4 text-sm font-bold tracking-tight text-ink sm:text-base"
              >
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white"
                >
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path
                      d="M2.5 7.5l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 카드 — 고객이 보는 것 */}
        <ul className="grid w-full gap-5 text-left md:grid-cols-3">
          {VISIBLE_ITEMS.map((it, i) => (
            <li
              key={it.title}
              className="flex flex-col gap-3 rounded-2xl border border-line-strong bg-bg p-6 sm:p-7"
            >
              <span className="font-mono text-xs font-bold tracking-widest text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
                {it.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {it.desc}
              </p>
            </li>
          ))}
        </ul>

        <p className="max-w-2xl text-center text-sm leading-relaxed text-ink-muted sm:text-base">
          <span className="font-bold text-ink">대행사가 뭘 하는지 모르는 상태로 두지 않습니다.</span>
          <br className="hidden sm:inline" />
          <span className="text-ink-subtle"> 진단 신청 시 샘플 보드도 함께 안내드립니다.</span>
        </p>
      </div>
    </Section>
  );
}
