import { SITE } from "@/shared/site";

type LogoProps = {
  variant?: "full" | "mark";
  size?: number;
  className?: string;
};

export function Logo({ variant = "full", size = 20, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark size={size} />
      {variant === "full" ? (
        <span className="text-base font-bold tracking-tight">{SITE.brand}</span>
      ) : null}
    </span>
  );
}

export function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={SITE.brand}
    >
      <circle
        cx="12"
        cy="12"
        r="7.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </g>
      <circle cx="12" cy="12" r="2.25" fill="var(--color-accent)" />
    </svg>
  );
}
