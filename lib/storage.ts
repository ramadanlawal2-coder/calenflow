import {
  DAY_KEYS,
  DEFAULT_DAY_END,
  DEFAULT_DAY_START,
  DEFAULT_MEETING_DURATION,
  MEETING_DURATIONS,
  STORAGE_KEYS,
} from "@/lib/constants";
import { isValidDateKey, isValidTime, timeToMinutes } from "@/lib/date";
import type {
  Booking,
  BookingData,
  DayKey,
  HostProfile,
  MeetingDuration,
  WeeklyAvailability,
} from "@/lib/types";
import { createId, isValidUsername } from "@/lib/utils";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMeetingDuration(value: unknown): value is MeetingDuration {
  return (
    value === MEETING_DURATIONS[0] ||
    value === MEETING_DURATIONS[1] ||
    value === MEETING_DURATIONS[2] ||
    value === MEETING_DURATIONS[3]
  );
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

export function createDefaultAvailability(): WeeklyAvailability {
  return {
    sunday: {
      enabled: false,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    monday: {
      enabled: true,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    tuesday: {
      enabled: true,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    wednesday: {
      enabled: true,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    thursday: {
      enabled: true,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    friday: {
      enabled: true,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
    saturday: {
      enabled: false,
      start: DEFAULT_DAY_START,
      end: DEFAULT_DAY_END,
    },
  };
}

export function createDefaultBookingData(): BookingData {
  return {
    version: 1,
    host: null,
    availability: createDefaultAvailability(),
    bookings: [],
  };
}

function normalizeHost(value: unknown): HostProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const fullName =
    typeof value.fullName === "string" ? value.fullName.trim() : "";
  const username =
    typeof value.username === "string" ? value.username.trim().toLowerCase() : "";
  const meetingTitle =
    typeof value.meetingTitle === "string" ? value.meetingTitle.trim() : "";

  if (
    fullName.length === 0 ||
    !isValidUsername(username) ||
    meetingTitle.length === 0
  ) {
    return null;
  }

  const createdAt = stringOr(value.createdAt, new Date().toISOString());

  return {
    id: stringOr(value.id, createId()),
    fullName,
    username,
    meetingTitle,
    durationMinutes: isMeetingDuration(value.durationMinutes)
      ? value.durationMinutes
      : DEFAULT_MEETING_DURATION,
    createdAt,
    updatedAt: stringOr(value.updatedAt, createdAt),
  };
}

function normalizeAvailability(value: unknown): WeeklyAvailability {
  const fallback = createDefaultAvailability();

  if (!isRecord(value)) {
    return fallback;
  }

  const normalized: WeeklyAvailability = { ...fallback };

  DAY_KEYS.forEach((dayKey: DayKey) => {
    const rawDay = value[dayKey];

    if (!isRecord(rawDay)) {
      return;
    }

    const enabled =
      typeof rawDay.enabled === "boolean"
        ? rawDay.enabled
        : fallback[dayKey].enabled;
    const start =
      typeof rawDay.start === "string" && isValidTime(rawDay.start)
        ? rawDay.start
        : fallback[dayKey].start;
    const end =
      typeof rawDay.end === "string" && isValidTime(rawDay.end)
        ? rawDay.end
        : fallback[dayKey].end;

    const hasValidRange = timeToMinutes(end) > timeToMinutes(start);

    normalized[dayKey] = {
      enabled: enabled && hasValidRange,
      start,
      end,
    };
  });

  return normalized;
}

function normalizeBooking(value: unknown): Booking | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "string" ? value.id : "";
  const guestName =
    typeof value.guestName === "string" ? value.guestName.trim() : "";
  const guestEmail =
    typeof value.guestEmail === "string" ? value.guestEmail.trim() : "";
  const date = typeof value.date === "string" ? value.date : "";
  const time = typeof value.time === "string" ? value.time : "";
  const durationMinutes =
    typeof value.durationMinutes === "number" &&
    Number.isFinite(value.durationMinutes) &&
    value.durationMinutes > 0
      ? Math.round(value.durationMinutes)
      : 0;
  const status =
    value.status === "confirmed" || value.status === "cancelled"
      ? value.status
      : null;

  if (
    id.length === 0 ||
    guestName.length === 0 ||
    guestEmail.length === 0 ||
    !isValidDateKey(date) ||
    !isValidTime(time) ||
    durationMinutes === 0 ||
    status === null
  ) {
    return null;
  }

  const guestNote =
    typeof value.guestNote === "string" && value.guestNote.trim().length > 0
      ? value.guestNote
      : undefined;
  const cancelledAt =
    typeof value.cancelledAt === "string" ? value.cancelledAt : undefined;

  return {
    id,
    guestName,
    guestEmail,
    guestNote,
    date,
    time,
    durationMinutes,
    status,
    createdAt: stringOr(value.createdAt, new Date().toISOString()),
    cancelledAt,
  };
}

function normalizeBookings(value: unknown): Booking[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeBooking)
    .filter((booking): booking is Booking => booking !== null);
}

export function normalizeBookingData(value: unknown): BookingData {
  if (!isRecord(value)) {
    return createDefaultBookingData();
  }

  return {
    version: 1,
    host: normalizeHost(value.host),
    availability: normalizeAvailability(value.availability),
    bookings: normalizeBookings(value.bookings),
  };
}

export function parseBookingData(raw: string): BookingData {
  try {
    const parsed: unknown = JSON.parse(raw);
    return normalizeBookingData(parsed);
  } catch {
    return createDefaultBookingData();
  }
}

/**
 * Read the latest persisted document. Only call this from browser event
 * handlers or effects — never during server rendering.
 */
export function readBookingData(): BookingData {
  if (typeof window === "undefined") {
    return createDefaultBookingData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.bookingData);

    if (raw === null) {
      return createDefaultBookingData();
    }

    return parseBookingData(raw);
  } catch {
    return createDefaultBookingData();
  }
}
