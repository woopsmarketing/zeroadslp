"use client";

import { useCallback } from "react";
import { trackPhoneClick } from "@/lib/analytics";

type Props = {
  phone: string;
  variantRef: string;
  variantKey: string;
  className?: string;
  iconOnly?: boolean;
  label?: string;
};

/**
 * tel: 링크 + phone_click 이벤트.
 * `phone` prop 비어있으면 null.
 */
export function PhoneCta({
  phone,
  variantRef,
  variantKey,
  className = "",
  iconOnly = false,
  label,
}: Props) {
  const onClick = useCallback(() => {
    trackPhoneClick(variantRef, variantKey);
  }, [variantRef, variantKey]);

  if (!phone) return null;
  const display = label ?? phone;
  const tel = phone.replace(/[^\d+]/g, "");

  return (
    <a
      href={`tel:${tel}`}
      onClick={onClick}
      data-placement="phone"
      className={className}
      aria-label={`전화 ${display}`}
    >
      <PhoneIcon className="h-4 w-4" />
      {iconOnly ? null : <span className="ml-2">{display}</span>}
    </a>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 4.5a1.5 1.5 0 0 1 1.5-1.5h1.6a1 1 0 0 1 .98.8l.6 3a1 1 0 0 1-.27.93L8.2 8.97a11 11 0 0 0 4.83 4.83l1.24-1.21a1 1 0 0 1 .93-.27l3 .6a1 1 0 0 1 .8.98V15.5A1.5 1.5 0 0 1 17.5 17h-1A12.5 12.5 0 0 1 4 4.5v0z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
