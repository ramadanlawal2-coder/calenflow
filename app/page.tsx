import type { Metadata } from "next";

import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingExperience } from "@/components/marketing/landing-experience";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingPricing } from "@/components/marketing/landing-pricing";
import { LandingSteps } from "@/components/marketing/landing-steps";
import { LandingTestimonials } from "@/components/marketing/landing-testimonials";

export const metadata: Metadata = {
  title: { absolute: "CalenFlow — Share one link. Get booked in seconds." },
  description:
    "Create a shareable booking page in minutes. Set your availability, share one link, and let clients book a time that works for everyone.",
};

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingSteps />
        <LandingExperience />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
