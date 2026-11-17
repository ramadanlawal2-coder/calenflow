"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, UserRound, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";

const NAV_ITEMS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#experience", label: "App Experience" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
] as const;

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1120px] items-center justify-between gap-6 px-5 sm:px-6">
        <Link
          href="/"
          aria-label="CalenFlow home"
          className="inline-flex min-h-11 items-center rounded-control"
        >
          <Logo size="md" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/welcome"
            className="inline-flex min-h-11 items-center rounded-control px-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            href="/welcome"
            className="inline-flex min-h-11 items-center rounded-control bg-primary px-4 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(79,72,225,0.85)] transition-colors hover:bg-accent"
          >
            Get Started Free
          </Link>
          <Link
            href="/welcome"
            aria-label="Open the CalenFlow demo"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-primary transition-colors hover:bg-input"
          >
            <UserRound aria-hidden="true" className="size-5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-control border border-line bg-surface text-ink transition-colors hover:bg-input lg:hidden"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="landing-mobile-menu"
          className="border-t border-line bg-canvas px-5 pb-5 pt-2 lg:hidden"
        >
          <nav aria-label="Mobile" className="grid">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center border-b border-line/70 text-sm font-semibold text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 grid gap-2">
            <Link
              href="/welcome"
              className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-surface px-4 text-sm font-semibold text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/welcome"
              className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
