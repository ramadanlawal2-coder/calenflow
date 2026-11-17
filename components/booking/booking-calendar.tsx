"use client";

import { useState } from "react";
import { format, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  getCalendarDays,
  getDayKey,
  getTodayKey,
  formatDateKey,
  formatMonthLabel,
  parseDateKey,
} from "@/lib/date";
import { CALENDAR_WEEKDAYS } from "@/lib/constants";
import type { WeeklyAvailability } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface BookingCalendarProps {
  availability: WeeklyAvailability;
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
}

export function BookingCalendar({
  availability,
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const [month, setMonth] = useState<Date>(() =>
    selectedDate ? parseDateKey(selectedDate) : new Date(),
  );

  const todayKey = getTodayKey();
  const days = getCalendarDays(month);
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const currentMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const previousDisabled = monthStart.getTime() <= currentMonthStart.getTime();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold tracking-tight text-ink">
          {formatMonthLabel(month)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            disabled={previousDisabled}
            onClick={() =>
              setMonth((current) =>
                new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
            className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-input disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setMonth((current) =>
                new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
            className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-input"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {CALENDAR_WEEKDAYS.map((label) => (
          <span
            key={label}
            className="py-1 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-faint"
          >
            {label}
          </span>
        ))}

        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const isCurrentMonth = isSameMonth(day, month);
          const isPast = dateKey < todayKey;
          const dayAvailability = availability[getDayKey(day)];
          const hasAvailability = dayAvailability.enabled;
          const disabled = !isCurrentMonth || isPast || !hasAvailability;
          const selected = selectedDate === dateKey;
          const today = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-current={today ? "date" : undefined}
              aria-label={`${format(day, "EEEE, MMMM d, yyyy")}${
                disabled ? ", unavailable" : ""
              }`}
              onClick={() => onSelectDate(dateKey)}
              className={cn(
                "flex aspect-square w-full items-center justify-center rounded-full text-sm font-semibold transition-colors",
                !isCurrentMonth && "invisible",
                selected && "bg-primary text-white shadow-sm hover:bg-primary",
                !selected &&
                  today &&
                  !disabled &&
                  "bg-input text-primary ring-1 ring-primary/40",
                !selected &&
                  !today &&
                  !disabled &&
                  "text-ink hover:bg-input",
                disabled && "cursor-not-allowed text-faint/50",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
