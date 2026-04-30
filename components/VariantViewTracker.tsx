"use client";

import { useEffect } from "react";
import { trackVariantView } from "@/lib/analytics";

export function VariantViewTracker({
  variantRef,
  variantKey,
}: {
  variantRef: string;
  variantKey: string;
}) {
  useEffect(() => {
    trackVariantView(variantRef, variantKey);
  }, [variantRef, variantKey]);
  return null;
}
