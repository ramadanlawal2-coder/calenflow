import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { DAY_KEYS } from "@/lib/constants";
import type { DayKey } from "@/lib/types";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";
export const TIME_KEY_FORMAT = "HH:mm";

export function formatDateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}

export function parseDateKey(dateKey: string): Date {
  return parseISO(`${dateKey}T00:00:00`);
}

export function toDateTime(dateKey: string, time: string): Date {
  return parseISO(`${dateKey}T${time}:00`);
}

export function getTodayKey(now: Date = new Date()): string {
  return formatDateKey(now);
}

export function getDayKey(date: Date): DayKey {
  return DAY_KEYS[date.getDay()] ?? "sunday";
}

export function getCalendarDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  });
}

export function formatMonthLabel(month: Date): string {
  return format(month, "MMMM yyyy");
}

export function formatLongDateKey(dateKey: string): string {
  return format(parseDateKey(dateKey), "EEEE, MMMM d, yyyy");
}

export function formatShortDateKey(dateKey: string): string {
  return format(parseDateKey(dateKey), "EEE, MMM d");
}

export function formatTimeLabel(time: string): string {
  if (!isValidTime(time)) {
    return time;
  }

  return format(toDateTime("2000-01-01", time), "h:mm a");
}

export function formatBookingDateTime(dateKey: string, time: string): string {
  return `${formatShortDateKey(dateKey)} · ${formatTimeLabel(time)}`;
}

export function formatDayRange(start: string, end: string): string {
  return `${formatTimeLabel(start)} – ${formatTimeLabel(end)}`;
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = parseDateKey(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return formatDateKey(date) === value;
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function timeToMinutes(time: string): number {
  const [hoursPart, minutesPart] = time.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const normalized = Math.max(0, Math.min(totalMinutes, 24 * 60));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function isTodayKey(dateKey: string, now: Date = new Date()): boolean {
  return dateKey === getTodayKey(now);
}

export function isPastDateKey(dateKey: string, now: Date = new Date()): boolean {
  return dateKey < getTodayKey(now);
}

export function formatHours(hours: number): string {
  if (hours <= 0) {
    return "0 hrs";
  }

  if (!Number.isInteger(hours)) {
    return `${hours.toFixed(1)} hrs`;
  }

  return hours === 1 ? "1 hr" : `${hours} hrs`;
}
