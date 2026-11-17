"use client";

import { useEffect } from "react";

import { LogoMark } from "@/components/brand/logo";

export interface SplashScreenProps {
  onSkip?: () => void;
}

export function SplashScreen({ onSkip }: SplashScreenProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const isSkipKey =
        event.key === "Enter" || event.key === " " || event.key === "Escape";

      if (!isSkipKey) {
        return;
      }

      event.preventDefault();
      onSkip?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSkip]);

  return (
    <div
      className="relative flex min-h-dvh cursor-pointer select-none flex-col items-center justify-center overflow-hidden px-6 pb-safe pt-safe text-center"
      onClick={() => onSkip?.()}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.16),transparent_68%)]" />
        <div className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(53,37,205,0.08),transparent_62%)]" />
        <div className="absolute -left-16 top-24 size-40 rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.35),transparent_70%)]" />
        <div className="absolute -right-20 bottom-28 size-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_70%)]" />
      </div>

      <div className="animate-fade-in relative flex flex-col items-center">
        <LogoMark size="lg" className="scale-150" />

        <p className="mt-10 text-4xl font-extrabold tracking-tight text-ink">
          Calen<span className="text-primary">Flow</span>
        </p>

        <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-muted">
          Effortless calendar booking &amp; zero back-and-forth scheduling
        </p>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSkip?.();
        }}
        className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] inline-flex min-h-11 items-center rounded-full px-4 text-[11px] font-semibold text-faint transition-colors hover:bg-input hover:text-ink"
      >
        Skip intro
      </button>
    </div>
  );
}
