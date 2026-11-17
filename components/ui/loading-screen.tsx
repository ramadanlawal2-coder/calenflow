import { LoaderCircle } from "lucide-react";

import { Logo } from "@/components/brand/logo";

export function LoadingScreen({
  label = "Loading your workspace…",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50dvh] flex-col items-center justify-center gap-4 px-4 py-12 text-center"
    >
      <Logo size="md" />
      <LoaderCircle
        aria-hidden="true"
        className="size-5 animate-spin text-primary"
      />
      <p className="text-sm font-medium text-muted">{label}</p>
    </div>
  );
}
