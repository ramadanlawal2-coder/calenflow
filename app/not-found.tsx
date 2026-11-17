import Link from "next/link";
import { CalendarX2 } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6">
      <Logo size="md" />

      <span className="inline-flex size-16 items-center justify-center rounded-full bg-input text-primary">
        <CalendarX2 aria-hidden="true" className="size-7" />
      </span>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          404 · Page not found
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          This page took a different time slot
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
          The link you followed doesn&apos;t exist anymore. Check the username,
          or head back to CalenFlow to create or open a booking page.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        <ButtonLink href="/" fullWidth>
          Go to CalenFlow
        </ButtonLink>
        <Link
          href="/dashboard/bookings"
          className="inline-flex min-h-11 items-center justify-center rounded-control text-sm font-semibold text-primary transition-colors hover:bg-input"
        >
          Open my dashboard
        </Link>
      </div>
    </main>
  );
}
