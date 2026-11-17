import { addDays } from "date-fns";

import {
  formatDateKey,
  formatTimeLabel,
  isPastDateKey,
  isValidDateKey,
  isValidTime,
  parseDateKey,
  getDayKey,
  timeToMinutes,
  toDateTime,
  formatHours,
} from "@/lib/date";
import type {
  AvailabilityDay,
  AvailabilityErrors,
  BookingData,
  DayKey,
  TimeSlot,
  WeeklyAvailability,
} from "@/lib/types";

export function generateSlotTimes(
  day: AvailabilityDay,
  durationMinutes: number,
): string[] {
  if (!day.enabled || durationMinutes <= 0) {
    return [];
  }

  if (!isValidTime(day.start) || !isValidTime(day.end)) {
    return [];
  }

  const start = timeToMinutes(day.start);
  const end = timeToMinutes(day.end);

  if (end <= start) {
    return [];
  }

  const slots: string[] = [];

  for (let cursor = start; cursor + durationMinutes <= end; cursor += durationMinutes) {
    const hours = Math.floor(cursor / 60);
    const minutes = cursor % 60;
    slots.push(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    );
  }

  return slots;
}

function timesOverlap(
  startA: string,
  durationA: number,
  startB: string,
  durationB: number,
): boolean {
  const a = timeToMinutes(startA);
  const b = timeToMinutes(startB);

  return a < b + durationB && b < a + durationA;
}

export function getAvailabilityForDateKey(
  availability: WeeklyAvailability,
  dateKey: string,
): AvailabilityDay | null {
  if (!isValidDateKey(dateKey)) {
    return null;
  }

  return availability[getDayKey(parseDateKey(dateKey))];
}

/**
 * All bookable times for a date, already filtered for:
 * - disabled/unavailable weekdays
 * - slots in the past (including earlier slots today)
 * - confirmed bookings that overlap the slot
 */
export function getAvailableSlots(
  data: BookingData,
  dateKey: string,
  now: Date = new Date(),
): string[] {
  const host = data.host;

  if (!host || !isValidDateKey(dateKey) || isPastDateKey(dateKey, now)) {
    return [];
  }

  const day = getAvailabilityForDateKey(data.availability, dateKey);

  if (!day) {
    return [];
  }

  const candidates = generateSlotTimes(day, host.durationMinutes);
  const isToday = dateKey === formatDateKey(now);

  return candidates.filter((time) => {
    const slotStart = toDateTime(dateKey, time);

    if (Number.isNaN(slotStart.getTime())) {
      return false;
    }

    if (isToday && slotStart.getTime() <= now.getTime()) {
      return false;
    }

    const isBooked = data.bookings.some(
      (booking) =>
        booking.status === "confirmed" &&
        booking.date === dateKey &&
        timesOverlap(
          time,
          host.durationMinutes,
          booking.time,
          booking.durationMinutes,
        ),
    );

    return !isBooked;
  });
}

function getPeriod(time: string): TimeSlot["period"] {
  const minutes = timeToMinutes(time);

  if (minutes < 12 * 60) {
    return "morning";
  }

  if (minutes < 17 * 60) {
    return "afternoon";
  }

  return "evening";
}

export function getAvailableTimeSlots(
  data: BookingData,
  dateKey: string,
  now: Date = new Date(),
): TimeSlot[] {
  return getAvailableSlots(data, dateKey, now).map((time) => ({
    time,
    label: formatTimeLabel(time),
    period: getPeriod(time),
  }));
}

export function isSlotAvailable(
  data: BookingData,
  dateKey: string,
  time: string,
  now: Date = new Date(),
): boolean {
  return getAvailableSlots(data, dateKey, now).includes(time);
}

export function getNextAvailableDateKey(
  data: BookingData,
  from: Date = new Date(),
  daysToSearch = 60,
): string | null {
  for (let offset = 0; offset < daysToSearch; offset += 1) {
    const dateKey = formatDateKey(addDays(from, offset));

    if (getAvailableSlots(data, dateKey, from).length > 0) {
      return dateKey;
    }
  }

  return null;
}

export function isDateEnabled(
  availability: WeeklyAvailability,
  dateKey: string,
): boolean {
  const day = getAvailabilityForDateKey(availability, dateKey);
  return Boolean(day?.enabled);
}

export function validateAvailability(
  availability: WeeklyAvailability,
): AvailabilityErrors {
  const errors: AvailabilityErrors = {};

  (Object.keys(availability) as DayKey[]).forEach((dayKey) => {
    const day = availability[dayKey];

    if (!day.enabled) {
      return;
    }

    if (!isValidTime(day.start) || !isValidTime(day.end)) {
      errors[dayKey] = "Choose a valid start and end time.";
      return;
    }

    if (timeToMinutes(day.end) <= timeToMinutes(day.start)) {
      errors[dayKey] = "End time must be after start time.";
    }
  });

  return errors;
}

export function getDayHours(day: AvailabilityDay): number {
  if (!day.enabled || !isValidTime(day.start) || !isValidTime(day.end)) {
    return 0;
  }

  const minutes = timeToMinutes(day.end) - timeToMinutes(day.start);
  return minutes > 0 ? minutes / 60 : 0;
}

export function formatDayHours(day: AvailabilityDay): string {
  return formatHours(getDayHours(day));
}
