import { LoaderCircle } from "lucide-react";

import { Logo } from "@/components/brand/logo";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <Logo size="md" />
      <LoaderCircle
        aria-hidden="true"
        className="size-5 animate-spin text-primary"
      />
      <p className="text-sm font-medium text-muted">Loading CalenFlow…</p>
    </div>
  );
}
