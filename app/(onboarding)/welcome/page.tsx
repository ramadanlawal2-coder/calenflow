import type { Metadata } from "next";

import { EntryGate } from "@/components/onboarding/entry-gate";

export const metadata: Metadata = {
  title: { absolute: "CalenFlow — Effortless calendar booking" },
  description:
    "Effortless calendar booking and zero back-and-forth scheduling. Create your shareable CalenFlow page in minutes.",
};

export default function WelcomePage() {
  return <EntryGate />;
}
