import Link from "next/link";
import { Check } from "lucide-react";

const INCLUDED = [
  "1 active calendar connection",
  "Unlimited booking appointments",
  "Google Meet",
  "Automated email confirmations",
] as const;

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-canvas pb-20 pt-8 sm:pb-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[42px]">
            Simple, honest pricing for everyone
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Start for free without entering a credit card.
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[428px] rounded-card border border-line/70 bg-surface p-6 shadow-card sm:p-8">
          <h3 className="text-lg font-extrabold tracking-tight text-ink">
            Free Forever
          </h3>

          <p className="mt-4 flex items-end gap-1">
            <span className="text-5xl font-extrabold leading-none tracking-tight text-ink">
              $0
            </span>
            <span className="pb-1 text-sm font-medium text-muted">/month</span>
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted">
            Perfect for freelancers and individuals starting with easy online
            bookings.
          </p>

          <ul className="mt-5 space-y-2.5">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-ink"
              >
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-ink"
                />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/welcome"
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-control bg-input px-4 text-sm font-semibold text-ink transition-colors hover:bg-line"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
