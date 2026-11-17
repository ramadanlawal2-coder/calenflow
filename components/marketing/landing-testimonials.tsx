import { Avatar } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    quote:
      "Switched to CalenFlow in minutes. My clients love its simple, fast, and seamless booking experience.",
    name: "Elena Rostova",
    role: "Design Lead, Studio Form",
  },
  {
    quote:
      "CalenFlow keeps my bookings accurate and my schedule stress-free.",
    name: "Tariq Mansoor",
    role: "Fractional CTO & Advisor",
  },
  {
    quote:
      "CalenFlow gives me the breathing room I need between meetings and keeps my schedule balanced.",
    name: "Chloe Bennett",
    role: "Executive Leadership Coach",
  },
] as const;

export function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-canvas pb-20 pt-4 sm:pb-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[42px]">
          Loved by operators who value their time
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col rounded-card border border-line/70 bg-surface p-6 shadow-card"
            >
              <blockquote className="text-[15px] leading-relaxed text-muted">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <Avatar name={testimonial.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {testimonial.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
