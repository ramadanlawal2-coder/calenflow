"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Home,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
}

const items: readonly NavItem[] = [
  { href: "/setup", label: "My page", icon: Home, exact: true },
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    icon: CalendarDays,
    exact: false,
  },
  {
    href: "/dashboard/availability",
    label: "Availability",
    icon: Clock3,
    exact: false,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-[480px] items-stretch justify-around px-2 pb-safe-nav pt-1">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-control px-2 text-[11px] font-bold transition-colors",
                active
                  ? "text-primary"
                  : "text-muted hover:text-ink",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn("size-5", active && "stroke-[2.4]")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
