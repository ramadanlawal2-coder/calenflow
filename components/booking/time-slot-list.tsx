"use client";

import { Check, Clock3, Sun } from "lucide-react";

import type { TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TimeSlotListProps {
  slots: readonly TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotList({
  slots,
  selectedTime,
  onSelect,
}: TimeSlotListProps) {
  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const selected = selectedTime === slot.time;
        const Icon = slot.period === "morning" ? Sun : Clock3;

        return (
          <button
            key={slot.time}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "flex min-h-12 w-full items-center justify-between gap-3 rounded-control border px-4 text-sm font-semibold transition-colors",
              selected
                ? "border-primary bg-primary text-white"
                : "border-line bg-surface text-ink hover:border-accent/40 hover:bg-input",
            )}
          >
            <span className="inline-flex items-center gap-2">
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-4",
                  selected ? "text-white/80" : "text-primary",
                )}
              />
              {slot.label}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-semibold",
                selected ? "text-white/80" : "text-muted",
              )}
            >
              {selected ? (
                <>
                  <Check aria-hidden="true" className="size-3.5" />
                  Selected
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-success" />
                  Available
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
