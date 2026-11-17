"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Copy } from "lucide-react";

import { copyText, getBookingUrl } from "@/lib/utils";

function useCopyState() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function markCopied() {
    setCopied(true);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return { copied, markCopied };
}

export function CompactCopyButton() {
  const { copied, markCopied } = useCopyState();

  async function handleCopy() {
    const success = await copyText(getBookingUrl("ada-strategy"));

    if (success) {
      markCopied();
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy the example booking link"
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#efedff] px-2 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-[#e4e1ff]"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3" />
      ) : (
        <Copy aria-hidden="true" className="size-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CtaCopyBar() {
  const [username, setUsername] = useState("yourname");
  const { copied, markCopied } = useCopyState();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = username.trim();
    const target = trimmed.length > 0 ? trimmed : "yourname";
    const success = await copyText(getBookingUrl(target));

    if (success) {
      markCopied();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-full max-w-[470px] flex-col gap-2 rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(20,16,80,0.7)] sm:flex-row sm:items-center"
    >
      <label htmlFor="landing-username" className="sr-only">
        Choose your booking username
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-1 px-3 text-sm">
        <span className="shrink-0 text-muted">calenflow.com/</span>
        <input
          id="landing-username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent py-2.5 font-semibold text-ink outline-none placeholder:text-[#6b6a7a]"
          placeholder="yourname"
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-accent"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </form>
  );
}
