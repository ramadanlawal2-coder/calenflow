"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CalenFlow render error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6">
      <Logo size="md" />

      <span className="inline-flex size-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <TriangleAlert aria-hidden="true" className="size-7" />
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Something went off schedule
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
          CalenFlow hit an unexpected error. Your saved bookings are still in
          this browser — try reloading the page.
        </p>
      </div>

      <Button type="button" onClick={reset} className="w-full max-w-xs">
        <RotateCcw aria-hidden="true" className="size-4" />
        Try again
      </Button>
    </main>
  );
}
