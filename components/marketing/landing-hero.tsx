import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Video,
  Zap,
} from "lucide-react";

import { CompactCopyButton } from "@/components/marketing/copy-demo-link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DURATIONS = [
  { value: 15, active: false },
  { value: 30, active: true },
  { value: 45, active: false },
  { value: 60, active: false },
] as const;

const CALENDAR_DAYS = [
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1", muted: false },
  { label: "2", muted: false },
  { label: "3", muted: false },
  { label: "4", muted: false },
  { label: "5", muted: false },
  { label: "6", muted: false },
  { label: "7", muted: false },
  { label: "8", muted: false },
  { label: "9", muted: false },
  { label: "10", muted: false },
  { label: "11", muted: false },
  { label: "12", muted: false },
  { label: "13", muted: false },
  { label: "14", muted: false },
  { label: "15", muted: false, selected: true },
  { label: "16", muted: false },
  { label: "17", muted: false },
  { label: "18", muted: false },
  { label: "19", muted: false },
] as const;

const TIMES = [
  { time: "09:30 AM", state: "Available" },
  { time: "11:00 AM", state: "Selected" },
  { time: "02:00 PM", state: "Available" },
  { time: "04:30 PM", state: "Available" },
] as const;

export function LandingHero() {
  return (
    <section className="animate-fade-in relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(94,92,238,0.14),transparent_65%)]"
      />

      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[2.4rem] font-extrabold leading-[1.07] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
            Share one link. Get
            <br className="hidden sm:block" /> booked in seconds.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            <span className="block font-semibold text-ink">
              Simple Scheduling, Made Easy.
            </span>
            Set your availability, share your booking link, and let clients book a
            time that works for everyone.
          </p>

          <div className="mt-7 flex justify-center">
            <Link
              href="/welcome"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-control bg-primary px-6 text-sm font-bold text-white shadow-[0_16px_34px_-18px_rgba(79,72,225,0.9)] transition-colors hover:bg-accent"
            >
              Create your free booking page
              <Zap aria-hidden="true" className="size-4 fill-current" />
            </Link>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 text-xs font-medium text-muted sm:flex-row sm:gap-5">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
              Over 45,000+ meetings booked this month
            </span>
            <span aria-hidden="true" className="hidden size-1 rounded-full bg-line sm:block" />
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className="size-3.5 fill-[#f5a524] text-[#f5a524]"
                  />
                ))}
              </span>
              4.9/5 score
            </span>
          </div>
        </div>

        <div
          role="group"
          aria-label="CalenFlow product preview"
          className="mt-12 rounded-[26px] bg-[#eceafb] p-4 shadow-[0_30px_70px_-52px_rgba(38,32,120,0.55)] sm:mt-16 sm:rounded-[32px] sm:p-7 lg:p-8"
        >
          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.18fr] lg:gap-5">
            <div className="rounded-[18px] bg-surface p-5 shadow-[0_14px_30px_-26px_rgba(23,27,38,0.45)] sm:rounded-[20px] sm:p-6">
              <div className="flex items-center gap-3">
                <Avatar name="Ada Lovelace" size="md" className="ring-0" />
                <p className="text-lg font-bold tracking-tight text-ink">
                  Ada Lovelace
                </p>
              </div>

              <div className="mt-5 rounded-[14px] bg-input p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Your personal booking link
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2">
                  <span className="truncate text-xs font-semibold text-primary">
                    calenflow.com/ada-strategy
                  </span>
                  <CompactCopyButton />
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-ink">
                Available Durations
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {DURATIONS.map((duration) => (
                  <span
                    key={duration.value}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg py-2 text-center",
                      duration.active
                        ? "bg-primary text-white shadow-[0_10px_18px_-12px_rgba(79,72,225,0.9)]"
                        : "bg-input text-ink",
                    )}
                  >
                    <span className="text-base font-extrabold leading-none">
                      {duration.value}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-[9px] font-semibold",
                        duration.active ? "text-white/90" : "text-muted",
                      )}
                    >
                      min
                    </span>
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs font-semibold text-ink">
                Connected Channel
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-input px-2.5 py-1.5 text-[11px] font-semibold text-ink">
                <Video aria-hidden="true" className="size-3.5 text-primary" />
                Google Meet
              </span>
            </div>

            <div className="rounded-[18px] bg-surface p-5 shadow-[0_14px_30px_-26px_rgba(23,27,38,0.45)] sm:rounded-[20px] sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                Client booking view
              </p>
              <p className="mt-1 text-lg font-bold tracking-tight text-ink">
                Select a Date &amp; Time
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1.15fr_1fr]">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink">October 2025</p>
                    <span aria-hidden="true" className="inline-flex items-center gap-1 text-muted">
                      <ChevronLeft className="size-3.5" />
                      <ChevronRight className="size-3.5" />
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[10px]">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                      <span
                        key={`${day}-${index}`}
                        className="font-semibold text-muted"
                      >
                        {day}
                      </span>
                    ))}
                    {CALENDAR_DAYS.map((day, index) => (
                      <span
                        key={`${day.label}-${index}`}
                        className={cn(
                          "mx-auto flex size-5 items-center justify-center rounded-full",
                          day.muted && "text-[#6b6a7a]",
                          !day.muted && !("selected" in day) && "text-ink",
                          "selected" in day &&
                            day.selected &&
                            "bg-primary font-bold text-white",
                        )}
                      >
                        {day.label}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                    Wednesday, Oct 15 available (4 slots)
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                    Available Timeslots
                  </p>
                  <div className="mt-2 space-y-2">
                    {TIMES.map((slot) => {
                      const selected = slot.state === "Selected";

                      return (
                        <div
                          key={slot.time}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px]",
                            selected
                              ? "bg-primary font-bold text-white shadow-[0_10px_18px_-14px_rgba(79,72,225,0.9)]"
                              : "bg-input text-ink",
                          )}
                        >
                          <span className="font-semibold">{slot.time}</span>
                          <span
                            className={cn(
                              "text-[10px]",
                              selected ? "text-white/90" : "text-muted",
                            )}
                          >
                            {slot.state}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-input px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-ink">
                    11:00 AM – 11:30 AM
                  </p>
                  <p className="text-[10px] text-muted">
                    Auto Google Meet invite sent
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success px-2 py-1 text-[10px] font-bold text-white">
                  <Check aria-hidden="true" className="size-3" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
