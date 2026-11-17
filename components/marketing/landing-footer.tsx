import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow Automation", href: "#how-it-works" },
  { label: "Calendar Integration", href: "#experience" },
] as const;

const RESOURCE_LINKS = [
  { label: "Customer Stories", href: "#testimonials" },
  { label: "Documentation", href: "#how-it-works" },
] as const;

const COMPANY_ITEMS = [
  "About Us",
  "Careers",
  "Privacy Policy",
  "Terms of Service",
  "Security",
] as const;

export function LandingFooter() {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-8 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="CalenFlow home"
              className="inline-flex min-h-11 items-center rounded-control"
            >
              <Logo size="sm" />
            </Link>

            <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-muted">
              Smart scheduling built for modern teams, founders, and
              professionals.
            </p>

            <NewsletterForm />
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Product</h3>
            <ul className="mt-3 space-y-1">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Resources</h3>
            <ul className="mt-3 space-y-1">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Company</h3>
            <ul className="mt-3 space-y-1">
              {COMPANY_ITEMS.map((item) => (
                <li key={item}>
                  <span className="inline-flex min-h-9 items-center text-sm text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-muted">
            © 2026 CalenFlow Inc. All rights reserved. Precision scheduling
            software.
          </p>
        </div>
      </div>
    </footer>
  );
}
