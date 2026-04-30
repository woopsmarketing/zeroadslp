"use client";

import { useCallback } from "react";
import { trackKakaoClick } from "@/lib/analytics";

type Props = {
  href: string;
  variantRef: string;
  variantKey: string;
  placement: string;
  label: string;
  tone?: "primary" | "ghost" | "invert";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition will-change-transform";

const tones = {
  primary:
    "bg-accent text-white hover:bg-accent-hover hover:translate-y-[-1px] shadow-[0_12px_30px_-10px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]",
  ghost:
    "border border-line-strong text-ink hover:border-ink hover:bg-bg-soft",
  invert:
    "bg-white text-ink hover:bg-white/90 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)]",
} as const;

const sizes = {
  sm: "h-10 px-5 rounded-full text-sm",
  md: "h-12 px-6 rounded-full text-base",
  lg: "h-14 px-8 rounded-full text-lg",
} as const;

export function KakaoCta({
  href,
  variantRef,
  variantKey,
  placement,
  label,
  tone = "primary",
  size = "md",
  className = "",
}: Props) {
  const onClick = useCallback(() => {
    trackKakaoClick(variantRef, variantKey, placement);
  }, [variantRef, variantKey, placement]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-placement={placement}
      className={`${base} ${tones[tone]} ${sizes[size]} ${className}`}
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M5 10h10m0 0-4-4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
