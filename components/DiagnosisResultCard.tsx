type Severity = "critical" | "high" | "medium";

type Finding = {
  title: string;
  detail: string;
  severity: Severity;
};

const FINDINGS: Finding[] = [
  {
    title: "전환 추적 누락",
    detail: "GA4 전환 이벤트 일부 미작동, ROAS 판단 불가",
    severity: "critical",
  },
  {
    title: "랜딩 CTA 약함",
    detail: "첫 화면 CTA 인지율 낮음, 클릭→문의 이탈률 높음",
    severity: "high",
  },
  {
    title: "검색광고 키워드 낭비",
    detail: "정보성 광범위 키워드 비중 60% 이상",
    severity: "high",
  },
  {
    title: "문의폼 이탈 가능성",
    detail: "필드 9개 → 시작률 대비 완료율 격차 큼",
    severity: "medium",
  },
];

const SEVERITY_STYLE: Record<Severity, { label: string; cls: string }> = {
  critical: {
    label: "Critical",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
  high: {
    label: "High",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
  },
  medium: {
    label: "Medium",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function DiagnosisResultCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line-strong bg-bg shadow-[0_30px_80px_-30px_rgba(15,23,42,0.22)]">
      {/* 헤더 — REPORT · SAMPLE */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-bg-soft px-5 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[10px] font-bold text-white"
          >
            ⚑
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted sm:text-xs">
            Report · Sample
          </p>
        </div>
        <p className="text-[11px] text-ink-subtle sm:text-xs">
          광고비 누수 진단 결과
        </p>
      </div>

      {/* 결과 4행 — 압축 */}
      <ol className="divide-y divide-line">
        {FINDINGS.map((f, i) => {
          const style = SEVERITY_STYLE[f.severity];
          return (
            <li
              key={f.title}
              className="flex items-center gap-3 bg-bg px-5 py-3.5 sm:gap-4 sm:px-6 sm:py-4"
            >
              <span className="font-mono text-xs font-bold tabular-nums tracking-widest text-ink-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <h3 className="text-sm font-bold tracking-tight text-ink sm:flex-shrink-0 sm:text-base">
                  {f.title}
                </h3>
                <p className="text-xs leading-snug text-ink-muted sm:flex-1 sm:text-sm">
                  {f.detail}
                </p>
              </div>
              <span
                className={`flex-shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase sm:text-[11px] ${style.cls}`}
              >
                {style.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* 푸터 */}
      <div className="border-t border-line bg-bg-soft px-5 py-3 text-center sm:px-6 sm:py-4">
        <p className="text-[11px] text-ink-subtle sm:text-xs">
          * 가상 진단 샘플 · 실 진단은 광고주 계정 분석 후 작성됩니다.
        </p>
      </div>
    </div>
  );
}
