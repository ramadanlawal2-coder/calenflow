import type { BookingFilter, DayKey, MeetingDuration } from "@/lib/types";

export const APP_NAME = "CalenFlow";

export const STORAGE_KEYS = {
  bookingData: "calenflow:v1:booking-data",
} as const;

/**
 * Thin onboarding flags. These are UI-only: they never contain account
 * credentials and are read exclusively inside browser effects or handlers.
 */
export const ONBOARDING_KEYS = {
  splashSeen: "calenflow:v1:splash-seen",
  authSeen: "calenflow:v1:auth-seen",
} as const;

/** Sunday-first, matching JavaScript's Date#getDay(). */
export const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const satisfies readonly DayKey[];

/** Monday-first order used by the availability editor. */
export const WEEK_DAYS: readonly { key: DayKey; label: string; short: string }[] =
  [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ];

export const CALENDAR_WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const MEETING_DURATIONS = [15, 30, 45, 60] as const;

export const DEFAULT_MEETING_DURATION: MeetingDuration = 30;

export const DEFAULT_DAY_START = "09:00";
export const DEFAULT_DAY_END = "17:00";

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 40;

export const RESERVED_USERNAMES: ReadonlySet<string> = new Set([
  "admin",
  "api",
  "auth",
  "book",
  "dashboard",
  "help",
  "settings",
  "support",
]);

export const BOOKING_FILTERS: readonly {
  value: BookingFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export const MAX_GUEST_NOTE_LENGTH = 500;
