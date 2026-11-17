import { CalendarPlus } from "lucide-react";

import { CtaCopyBar } from "@/components/marketing/copy-demo-link";

export function LandingCta() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#5e5cee_0%,#4f48e1_45%,#3e36b6_100%)] px-5 py-16 text-center text-white sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-1/2 size-[420px] -translate-y-1/2 rounded-full border-[38px] border-white/10" />
        <div className="absolute -left-28 bottom-0 size-[260px] rounded-full border-[28px] border-white/5" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
          <CalendarPlus aria-hidden="true" className="size-7" />
        </span>

        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Ready to take complete control
          <br className="hidden sm:block" /> of your calendar?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
          Join professionals saving time and simplifying their schedules with
          CalenFlow. Get started today!
        </p>

        <CtaCopyBar />

        <p className="mt-4 text-[11px] text-white/85">
          No credit card required · Instant setup in 60 seconds
        </p>
      </div>
    </section>
  );
}
