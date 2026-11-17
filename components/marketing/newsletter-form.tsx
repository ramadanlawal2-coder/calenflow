"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email.trim().length === 0) {
      return;
    }

    setSubscribed(true);
  }

  return (
    <div>
      <p className="mt-2 text-xs font-semibold text-ink">
        Subscribe to product updates
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-2 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Work email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="Enter your work email"
          className="min-h-11 min-w-0 flex-1 rounded-control border border-line bg-surface px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#6b6a7a] focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-accent"
        >
          Subscribe
        </button>
      </form>

      {subscribed ? (
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] font-semibold text-success">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          You&apos;re on the list. This demo does not store your email.
        </p>
      ) : null}
    </div>
  );
}
