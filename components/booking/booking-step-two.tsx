"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";

import { BookingNotFound } from "@/components/booking/booking-not-found";
import { EventSummary } from "@/components/booking/event-summary";
import { GuestHeader } from "@/components/layout/guest-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { StepProgress } from "@/components/ui/step-progress";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { isSlotAvailable } from "@/lib/availability";
import { MAX_GUEST_NOTE_LENGTH } from "@/lib/constants";
import {
  formatLongDateKey,
  formatTimeLabel,
  isPastDateKey,
  isValidDateKey,
  isValidTime,
  minutesToTime,
  timeToMinutes,
} from "@/lib/date";
import { readBookingData } from "@/lib/storage";
import type { Booking, GuestDetailsErrors, GuestDetailsValues } from "@/lib/types";
import {
  createId,
  formatDuration,
  getBookingPath,
} from "@/lib/utils";
import { validateGuestDetails } from "@/lib/validation";
import { useBookingData } from "@/providers/booking-data-provider";
import { useToast } from "@/providers/toast-provider";

export interface BookingStepTwoProps {
  username: string;
  dateKey: string | null;
  time: string | null;
}

const EMPTY_DETAILS: GuestDetailsValues = {
  fullName: "",
  email: "",
  note: "",
};

export function BookingStepTwo({
  username,
  dateKey,
  time,
}: BookingStepTwoProps) {
  const router = useRouter();
  const { data, isReady, setData } = useBookingData();
  const { toast } = useToast();

  const [details, setDetails] = useState<GuestDetailsValues>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<GuestDetailsErrors>({});
  const [slotError, setSlotError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const host = isReady && data.host ? data.host : null;
  const usernameMatches =
    host !== null && host.username === username.trim().toLowerCase();
  const validSelection =
    dateKey !== null &&
    time !== null &&
    isValidDateKey(dateKey) &&
    isValidTime(time) &&
    !isPastDateKey(dateKey);

  useEffect(() => {
    if (!slotError) {
      return;
    }

    if (!dateKey || !time) {
      return;
    }

    const stillAvailable = isSlotAvailable(readBookingData(), dateKey, time);

    if (stillAvailable) {
      setSlotError(null);
    }
  }, [dateKey, slotError, time]);

  if (!isReady) {
    return <LoadingScreen label="Loading your booking details…" />;
  }

  if (!usernameMatches || !host) {
    return <BookingNotFound />;
  }

  if (!validSelection || !dateKey || !time) {
    return (
      <div className="space-y-4 pb-4 pt-2">
        <GuestHeader
          title="Guest Details"
          backHref={getBookingPath(host.username)}
          hostName={host.fullName}
        />

        <Card className="space-y-3 text-center">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-warning-soft text-warning">
            <AlertCircle aria-hidden="true" className="size-5" />
          </span>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">
            Choose a time first
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            This booking link is missing a selected date or time. Head back to
            the calendar and pick a slot to continue.
          </p>
          <Link
            href={getBookingPath(host.username)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-4 text-sm font-semibold text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to times
          </Link>
        </Card>
      </div>
    );
  }

  const endTime = minutesToTime(timeToMinutes(time) + host.durationMinutes);
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    details.email.trim(),
  );

  function clearError(field: keyof GuestDetailsValues) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!host || submitting) {
      return;
    }

    const nextErrors = validateGuestDetails(details);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: "Check your details",
        description: "Add your name and a valid email to confirm.",
        variant: "error",
      });
      return;
    }

    // Always work from the freshest document so two guests cannot claim the
    // same slot in separate tabs.
    const latest = readBookingData();
    const latestHost = latest.host;

    if (
      !latestHost ||
      latestHost.username !== host.username ||
      !dateKey ||
      !time
    ) {
      setSlotError(
        "This booking page changed while you were filling in your details. Reload and pick a time again.",
      );
      return;
    }

    if (!isSlotAvailable(latest, dateKey, time)) {
      setSlotError(
        "Sorry, that time was just booked by someone else. Pick another slot to continue.",
      );
      toast({
        title: "That time is taken",
        description: "Someone else booked it moments ago.",
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    setSlotError(null);

    const booking: Booking = {
      id: createId(),
      guestName: details.fullName.trim(),
      guestEmail: details.email.trim(),
      guestNote: details.note.trim().length > 0 ? details.note.trim() : undefined,
      date: dateKey,
      time,
      durationMinutes: latestHost.durationMinutes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      setData({
        ...latest,
        bookings: [...latest.bookings, booking],
      });
    } catch {
      setSubmitting(false);
      toast({
        title: "Couldn't save the booking",
        description: "Your browser blocked local storage. Try again.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Booking confirmed",
      description: `${formatLongDateKey(booking.date)} at ${formatTimeLabel(
        booking.time,
      )}.`,
      variant: "success",
    });

    router.push(
      `${getBookingPath(latestHost.username)}/confirmation/${booking.id}`,
    );
  }

  return (
    <div className="space-y-4 pb-4 pt-2">
      <GuestHeader
        title="Guest Details"
        backHref={`${getBookingPath(host.username)}?date=${encodeURIComponent(
          dateKey,
        )}&time=${encodeURIComponent(time)}`}
        hostName={host.fullName}
      />

      <StepProgress step={2} nextLabel="Next: Confirmation" />

      <EventSummary
        hostName={host.fullName}
        meetingTitle={host.meetingTitle}
        durationMinutes={host.durationMinutes}
        footer={
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <CalendarDays
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">
                  {formatLongDateKey(dateKey)}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatTimeLabel(time)} – {formatTimeLabel(endTime)} ·{" "}
                  {formatDuration(host.durationMinutes)}
                </p>
              </div>
            </div>

            <Link
              href={getBookingPath(host.username)}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-input"
              aria-label="Change date and time"
            >
              <Pencil aria-hidden="true" className="size-4" />
            </Link>
          </div>
        }
      />

      {slotError ? (
        <div
          role="alert"
          className="rounded-card border border-danger/30 bg-danger-soft p-4"
        >
          <p className="flex items-start gap-2 text-sm font-semibold text-danger">
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            {slotError}
          </p>
          <Link
            href={getBookingPath(host.username)}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-danger underline-offset-4 hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Pick another time
          </Link>
        </div>
      ) : null}

      <Card className="space-y-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">
            Your Details
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Please share contact information to reserve this slot.
          </p>
        </div>

        <form id="guest-details-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            label="Your Full Name"
            icon={User}
            required
            value={details.fullName}
            onChange={(event) => {
              setDetails((current) => ({
                ...current,
                fullName: event.target.value,
              }));
              clearError("fullName");
            }}
            placeholder="Alex Morgan"
            autoComplete="name"
            autoCapitalize="words"
            maxLength={80}
            error={errors.fullName}
          />

          <div className="space-y-2">
            <TextField
              label="Email Address"
              icon={Mail}
              required
              type="email"
              inputMode="email"
              value={details.email}
              onChange={(event) => {
                setDetails((current) => ({
                  ...current,
                  email: event.target.value,
                }));
                clearError("email");
              }}
              placeholder="alex@example.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={160}
              error={errors.email}
            />
            {emailLooksValid && !errors.email ? (
              <p className="flex items-center justify-end gap-1 text-[11px] font-bold text-success">
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                Valid email
              </p>
            ) : null}
          </div>

          <Textarea
            label="Meeting Goals & Notes"
            value={details.note}
            onChange={(event) => {
              setDetails((current) => ({
                ...current,
                note: event.target.value,
              }));
              clearError("note");
            }}
            placeholder="Optional: share what you'd like to cover."
            hint={`Optional · ${details.note.length}/${MAX_GUEST_NOTE_LENGTH} characters`}
            error={errors.note}
            maxLength={MAX_GUEST_NOTE_LENGTH}
            rows={4}
          />

          <div className="flex items-start gap-2 rounded-control bg-input px-3 py-3 text-xs leading-relaxed text-muted">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            <span>
              Your details are stored only in this browser for this demo
              booking. Nothing is emailed.
            </span>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Clock3 aria-hidden="true" className="size-4 animate-pulse" />
                Confirming…
              </>
            ) : (
              <>
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Confirm Booking
              </>
            )}
          </Button>
        </form>

        <div className="flex justify-center border-t border-line pt-3">
          <Link
            href={getBookingPath(host.username)}
            className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-semibold text-ink transition-colors hover:bg-input"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to times
          </Link>
        </div>
      </Card>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-faint">
        <ArrowRight aria-hidden="true" className="size-3.5" />
        No account needed. You can book another time afterwards.
      </p>
    </div>
  );
}
