"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ThanksTracker({ leadId }: { leadId: string }) {
  useEffect(() => {
    trackEvent("lead_thanks_view", { lead_id: leadId });
  }, [leadId]);
  return null;
}
