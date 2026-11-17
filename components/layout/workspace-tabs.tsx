"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/availability",
    label: "Availability",
    icon: Clock3,
  },
] as const;

export function WorkspaceTabs() {
  const pathname = usePathname();

  return (
    <div className="rounded-card bg-input p-1">
      <div className="grid grid-cols-2 gap-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-ink",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
