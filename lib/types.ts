/**
 * Core domain types for CalenFlow.
 *
 * All persisted data lives inside a single `BookingData` document so a host's
 * profile, weekly availability and bookings stay in sync.
 */

export type MeetingDuration = 15 | 30 | 45 | 60;

export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface AvailabilityDay {
  enabled: boolean;
  /** 24-hour time, HH:mm */
  start: string;
  /** 24-hour time, HH:mm */
  end: string;
}

export type WeeklyAvailability = Record<DayKey, AvailabilityDay>;

export interface HostProfile {
  id: string;
  fullName: string;
  username: string;
  meetingTitle: string;
  durationMinutes: MeetingDuration;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestNote?: string;
  /** Calendar date, YYYY-MM-DD */
  date: string;
  /** 24-hour time, HH:mm */
  time: string;
  durationMinutes: number;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
}

export interface BookingData {
  version: 1;
  host: HostProfile | null;
  availability: WeeklyAvailability;
  bookings: Booking[];
}

export type BookingFilter = "all" | "upcoming" | "past" | "cancelled";

export interface TimeSlot {
  time: string;
  label: string;
  period: "morning" | "afternoon" | "evening";
}

export interface SetupFormValues {
  fullName: string;
  username: string;
  meetingTitle: string;
  durationMinutes: MeetingDuration;
}

export type SetupFormErrors = Partial<Record<keyof SetupFormValues, string>>;

export interface GuestDetailsValues {
  fullName: string;
  email: string;
  note: string;
}

export type GuestDetailsErrors = Partial<Record<keyof GuestDetailsValues, string>>;

export type AvailabilityErrors = Partial<Record<DayKey, string>>;
