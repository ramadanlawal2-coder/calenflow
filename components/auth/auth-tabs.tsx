"use client";

import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

const tabs: readonly { value: AuthMode; label: string }[] = [
  { value: "signin", label: "Sign In" },
  { value: "signup", label: "Create Account" },
];

export interface AuthTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Account access"
      className="grid grid-cols-2 gap-1 rounded-control bg-input p-1"
    >
      {tabs.map((tab) => {
        const active = tab.value === mode;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "min-h-11 rounded-[10px] px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
