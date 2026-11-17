import { CalendarCheck2, CalendarClock, Share2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Set Your Availability",
    description:
      "Connect your Google calendar, set your available hours, and automatically block weekends and focus time.",
    icon: CalendarClock,
  },
  {
    number: "02",
    title: "Share your custom link",
    description: "Share your booking link anywhere, effortlessly.",
    icon: Share2,
  },
  {
    number: "03",
    title: "Watch slots fill",
    description:
      "Invitees select an available slot that adapts automatically to their local timezone. Video meeting links are dynamically dispatched.",
    icon: CalendarCheck2,
  },
] as const;

export function LandingSteps() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-[#f1f0fb] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[42px]">
            How CalenFlow works in 3 simple steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Take back at least 5 hours of administrative coordination every week.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-card bg-surface p-6 shadow-[0_18px_40px_-32px_rgba(23,27,38,0.35)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-extrabold tracking-tight text-[#8f83e8]">
                    {step.number}
                  </span>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#eeecff] text-primary">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
