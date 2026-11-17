import {
  AtSign,
  CheckCircle2,
  MousePointerClick,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Instant Host Setup",
    description:
      "Choose your unique username and set meeting durations in seconds. Simple setup, no unnecessary steps.",
    icon: UserRound,
    iconClassName: "bg-[#eeecff] text-primary",
  },
  {
    title: "Smart Weekly Availability",
    description:
      "Set your weekly availability, add breaks between meetings, and let clients book in their local time zone.",
    icon: SlidersHorizontal,
    iconClassName: "bg-[#eeecff] text-primary",
  },
  {
    title: "3-Step Guest Booking",
    description:
      "No account needed for clients. Choose a date, confirm your time instantly, and receive a calendar invite automatically.",
    icon: MousePointerClick,
    iconClassName: "bg-[#d3f8e8] text-[#0f7a54]",
  },
] as const;

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-y border-line/60 bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[42px]">
            Scheduling made simple, smart, and seamless.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Make scheduling simple. Share your booking link and let clients book
            meetings without endless messages.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex h-full flex-col rounded-card border border-line/70 bg-surface p-6 shadow-card"
              >
                <span
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-[14px]",
                    feature.iconClassName,
                  )}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </span>

                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>

                <div className="mt-auto pt-6">
                  {feature.title === "Instant Host Setup" ? (
                    <HostSetupPreview />
                  ) : null}
                  {feature.title === "Smart Weekly Availability" ? (
                    <AvailabilityPreview />
                  ) : null}
                  {feature.title === "3-Step Guest Booking" ? (
                    <BookingPreview />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HostSetupPreview() {
  return (
    <div className="rounded-[14px] bg-input p-3">
      <p className="text-[11px] font-bold text-ink">Default Setup</p>

      <div className="mt-2 rounded-lg bg-surface px-3 py-2.5">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
          Your URL handle
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <AtSign aria-hidden="true" className="size-3 text-muted" />
          <span className="truncate text-[11px] font-semibold text-ink">
            calenflow.com/alexsmith
          </span>
          <CheckCircle2
            aria-hidden="true"
            className="ml-auto size-3.5 shrink-0 text-success"
          />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[15, 30, 45].map((duration) => (
          <span
            key={duration}
            className={cn(
              "flex flex-col items-center justify-center rounded-md py-1.5 text-center",
              duration === 30
                ? "bg-primary text-white"
                : "bg-surface text-ink",
            )}
          >
            <span className="text-xs font-extrabold leading-none">
              {duration}
            </span>
            <span
              className={cn(
                "mt-0.5 text-[8px] font-semibold",
                duration === 30 ? "text-white/90" : "text-muted",
              )}
            >
              min
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AvailabilityPreview() {
  const rows = [
    { day: "Mon – FRI", hours: "09:00 AM – 05:00 PM", open: true },
    { day: "Sat", hours: "12:00 PM – 03:00 PM", open: true },
    { day: "Sun", hours: "Focus & Rest Only", open: false },
  ] as const;

  return (
    <div className="space-y-2 rounded-[14px] bg-input p-3">
      {rows.map((row) => (
        <div
          key={row.day}
          className="flex items-center justify-between gap-2 rounded-md bg-surface px-2.5 py-2 text-[10px]"
        >
          <span className="font-bold text-ink">{row.day}</span>
          <span className="flex min-w-0 items-center gap-1.5 text-muted">
            <span className="truncate">{row.hours}</span>
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                row.open ? "bg-success" : "bg-faint/50",
              )}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

function BookingPreview() {
  return (
    <div className="rounded-[14px] bg-input p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-white">
          3
        </span>
        <p className="text-[10px] font-bold text-ink">One-Tap Confirmation</p>
      </div>

      <div className="mt-2 rounded-lg bg-surface p-3">
        <p className="text-[11px] font-bold text-ink">Investor Sync (30m)</p>
        <p className="mt-0.5 text-[10px] text-muted">
          Thursday, Oct 16 · 02:30 PM
        </p>
        <span className="mt-2 block rounded-md bg-primary px-2 py-1.5 text-center text-[10px] font-bold text-white">
          View Confirmed Invite
        </span>
      </div>
    </div>
  );
}
