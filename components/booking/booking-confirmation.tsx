"use client";

import { format } from "date-fns";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Mail,
  User,
  XCircle,
} from "lucide-react";

import { BookingNotFound } from "@/components/booking/booking-not-found";
import { GuestHeader } from "@/components/layout/guest-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { StepProgress } from "@/components/ui/step-progress";
import {
  formatLongDateKey,
  formatTimeLabel,
  minutesToTime,
  timeToMinutes,
  toDateTime,
} from "@/lib/date";
import { formatDuration, getBookingPath } from "@/lib/utils";
import { useBookingData } from "@/providers/booking-data-provider";

export interface BookingConfirmationProps {
  username: string;
  bookingId: string;
}

function buildCalendarUrl({
  title,
  details,
  location,
  date,
  time,
  durationMinutes,
}: {
  title: string;
  details: string;
  location: string;
  date: string;
  time: string;
  durationMinutes: number;
}): string {
  const start = toDateTime(date, time);
  const end = toDateTime(
    date,
    minutesToTime(timeToMinutes(time) + durationMinutes),
  );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
    location,
    dates: `${format(start, "yyyyMMdd'T'HHmmss")}/${format(
      end,
      "yyyyMMdd'T'HHmmss",
    )}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function BookingConfirmation({
  username,
  bookingId,
}: BookingConfirmationProps) {
  const { data, isReady } = useBookingData();

  if (!isReady) {
    return <LoadingScreen label="Loading your confirmation…" />;
  }

  const host = data.host;
  const normalizedUsername = username.trim().toLowerCase();

  if (!host || host.username !== normalizedUsername) {
    return <BookingNotFound />;
  }

  const booking = data.bookings.find((item) => item.id === bookingId);
  const bookAgainHref = getBookingPath(host.username);

  if (!booking) {
    return (
      <div className="space-y-4 pb-4 pt-2">
        <GuestHeader
          title="Booking Confirmation"
          backHref={bookAgainHref}
          hostName={host.fullName}
        />

        <Card className="space-y-3 text-center">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-input text-primary">
            <CalendarDays aria-hidden="true" className="size-5" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">
            We couldn&apos;t find that booking
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            This confirmation link may be out of date. You can pick a new time
            from {host.fullName}&apos;s page whenever you&apos;re ready.
          </p>
          <ButtonLink href={bookAgainHref} fullWidth>
            Book another time
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const endTime = minutesToTime(
    timeToMinutes(booking.time) + booking.durationMinutes,
  );
  const reference = booking.id.replace(/-/g, "").slice(0, 8).toUpperCase();
  const isCancelled = booking.status === "cancelled";

  const calendarUrl = buildCalendarUrl({
    title: `${host.meetingTitle} with ${host.fullName}`,
    details: `Booked with ${host.fullName} via CalenFlow.\nGuest: ${booking.guestName} (${booking.guestEmail})\nReference: ${reference}`,
    location: "Google Meet / Zoom",
    date: booking.date,
    time: booking.time,
    durationMinutes: booking.durationMinutes,
  });

  return (
    <div className="space-y-4 pb-4 pt-2">
      <GuestHeader
        title="Booking Confirmation"
        backHref={bookAgainHref}
        hostName={host.fullName}
      />

      <StepProgress
        step={3}
        nextLabel={isCancelled ? "Booking cancelled" : "100% Completed"}
        complete={!isCancelled}
      />

      {isCancelled ? (
        <Card className="space-y-3 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
            <XCircle aria-hidden="true" className="size-7" />
          </span>
          <Badge variant="danger">Cancelled by host</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">
            This booking was cancelled
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
            {host.fullName} released this time slot. You can pick a new time
            whenever it suits you.
          </p>
        </Card>
      ) : (
        <Card className="space-y-3 text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-success text-white shadow-[0_16px_32px_-18px_rgba(0,83,56,0.9)]">
            <CheckCircle2 aria-hidden="true" className="size-8" />
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">
            You&apos;re scheduled!
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
            {host.fullName} is expecting you. Your slot is now reserved and no
            longer appears as available to other guests.
          </p>
        </Card>
      )}

      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar name={host.fullName} size="lg" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
              Host · {host.fullName}
            </p>
            <h3 className="mt-1 text-base font-extrabold leading-snug tracking-tight text-ink">
              {host.meetingTitle}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {formatDuration(booking.durationMinutes)} · Video call
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-input text-primary">
              <CalendarDays aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">
                {formatLongDateKey(booking.date)}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {formatTimeLabel(booking.time)} – {formatTimeLabel(endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-input text-primary">
              <User aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">{booking.guestName}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                <Mail aria-hidden="true" className="size-3.5" />
                {booking.guestEmail}
              </p>
            </div>
          </div>

          {booking.guestNote ? (
            <div className="rounded-control bg-input px-3 py-2.5 text-xs italic leading-relaxed text-muted">
              &ldquo;{booking.guestNote}&rdquo;
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 rounded-control bg-input px-3 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
              Reference
            </span>
            <span className="font-mono text-xs font-bold text-ink">
              {reference}
            </span>
          </div>
        </div>
      </Card>

      {!isCancelled ? (
        <ButtonLink
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          fullWidth
        >
          <CalendarPlus aria-hidden="true" className="size-4" />
          Add to Google Calendar
        </ButtonLink>
      ) : null}

      <Card className="space-y-2 text-center">
        <p className="text-sm font-bold text-ink">Need to make changes?</p>
        <p className="text-xs leading-relaxed text-muted">
          Contact {host.fullName} to reschedule. Hosts can also cancel from
          their CalenFlow dashboard, which frees the slot for someone else.
        </p>
      </Card>

      <ButtonLink href={bookAgainHref} variant="outline" fullWidth>
        Book another time
      </ButtonLink>
    </div>
  );
}
