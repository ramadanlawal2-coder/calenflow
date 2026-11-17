"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { resetDemo } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import { useBookingData } from "@/providers/booking-data-provider";

export function HostHeader() {
  const { data, isReady } = useBookingData();
  const hostName = isReady && data.host ? data.host.fullName : "CalenFlow Host";
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setConfirmingReset(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setConfirmingReset(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setConfirmingReset(false);
  };

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }

    resetDemo();
    window.location.assign("/welcome");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="pt-safe">
        <div className="mx-auto flex min-h-14 w-full max-w-[480px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/setup"
            aria-label="CalenFlow home"
            className="inline-flex min-h-11 items-center rounded-control"
          >
            <Logo size="sm" />
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMenuOpen((open) => !open);
                setConfirmingReset(false);
              }}
              aria-expanded={menuOpen}
              aria-controls="host-menu"
              aria-label={
                isReady && data.host
                  ? `Open menu for ${hostName}`
                  : "Open host menu"
              }
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-opacity hover:opacity-90"
            >
              <Avatar name={hostName} size="md" />
            </button>

            {menuOpen ? (
              <div
                id="host-menu"
                className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-float"
              >
                {isReady && data.host ? (
                  <div className="border-b border-line px-3 py-2">
                    <p className="truncate text-sm font-bold text-ink">
                      {hostName}
                    </p>
                    <p className="truncate text-xs text-muted">
                      @{data.host.username}
                    </p>
                  </div>
                ) : null}

                <Link
                  href="/setup"
                  onClick={closeMenu}
                  className="mt-1 flex min-h-11 items-center gap-2.5 rounded-control px-3 text-sm font-semibold text-ink transition-colors hover:bg-input"
                >
                  <Pencil aria-hidden="true" className="size-4 text-muted" />
                  Edit booking page
                </Link>

                <button
                  type="button"
                  onClick={handleReset}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2.5 rounded-control px-3 text-left text-sm font-semibold transition-colors",
                    confirmingReset
                      ? "bg-danger-soft text-danger"
                      : "text-ink hover:bg-input",
                  )}
                >
                  <RotateCcw
                    aria-hidden="true"
                    className={cn(
                      "size-4",
                      confirmingReset ? "text-danger" : "text-muted",
                    )}
                  />
                  {confirmingReset ? "Tap again to reset" : "Reset demo"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
