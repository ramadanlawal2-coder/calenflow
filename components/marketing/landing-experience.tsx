import { Video } from "lucide-react";

import { cn } from "@/lib/utils";

const SESSIONS = [
  {
    name: "Marcus Rodriguez",
    initials: "MR",
    time: "09:30 AM – 10:00 AM",
    badgeClass: "bg-[#e7e4ff] text-primary",
  },
  {
    name: "Sarah Lin",
    initials: "SL",
    time: "11:00 AM – 11:30 AM",
    badgeClass: "bg-[#e7e4ff] text-primary",
  },
  {
    name: "David Thorne",
    initials: "DT",
    time: "02:00 PM – 02:45 PM",
    badgeClass: "bg-[#d3f8e8] text-[#0f7a54]",
  },
] as const;

export function LandingExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-24 bg-canvas py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-card border border-line/70 bg-surface p-5 shadow-card sm:p-8">
          <h2
            id="experience-heading"
            className="text-2xl font-extrabold tracking-tight text-ink"
          >
            Upcoming Sessions
          </h2>

          <div className="mt-5 space-y-3">
            {SESSIONS.map((session) => (
              <div
                key={session.name}
                className="flex items-center gap-3 rounded-[14px] bg-input px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    session.badgeClass,
                  )}
                >
                  {session.initials}
                </span>

                <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                  {session.name}
                </p>

                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-bold text-ink sm:text-xs">
                    {session.time}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                    <Video aria-hidden="true" className="size-3" />
                    Google Meet
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
