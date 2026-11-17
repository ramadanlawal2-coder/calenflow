"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CalendarX2,
  Clock3,
} from "lucide-react";

import {
  BookingCalendar,
} from "@/components/booking/booking-calendar";
import { BookingNotFound } from "@/components/booking/booking-not-found";
import { EventSummary } from "@/components/booking/event-summary";
import { TimeSlotList } from "@/components/booking/time-slot-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { StepProgress } from "@/components/ui/step-progress";
import {
  getAvailableTimeSlots,
  getNextAvailableDateKey,
} from "@/lib/availability";
import {
  formatLongDateKey,
  formatShortDateKey,
  formatTimeLabel,
  isPastDateKey,
  isValidDateKey,
  isValidTime,
} from "@/lib/date";
import type { BookingData } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { useBookingData } from "@/providers/booking-data-provider";

export interface BookingStepOneProps {
  username: string;
  initialDate?: string;
  initialTime?: string;
}

function getSlots(data: BookingData, dateKey: string | null) {
  return dateKey ? getAvailableTimeSlots(data, dateKey) : [];
}

export function BookingStepOne({
  username,
  initialDate,
  initialTime,
}: BookingStepOneProps) {
  const router = useRouter();
  const { data, isReady } = useBookingData();

  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    initialDate && isValidDateKey(initialDate) ? initialDate : null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(() =>
    initialTime && isValidTime(initialTime) ? initialTime : null,
  );
  const autoSelectedRef = useRef(false);

  useEffect(() => {
    if (!isReady || !data.host || autoSelectedRef.current) {
      return;
    }

    autoSelectedRef.current = true;

    const effectiveDate =
      selectedDate && !isPastDateKey(selectedDate) ? selectedDate : null;

    if (effectiveDate) {
      return;
    }

    const nextDate = getNextAvailableDateKey(data);

    if (nextDate) {
      setSelectedDate(nextDate);
    }
  }, [data, isReady, selectedDate]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const stillAvailable = getAvailableTimeSlots(data, selectedDate).some(
      (slot) => slot.time === selectedTime,
    );

    if (!stillAvailable) {
      setSelectedTime(null);
    }
  }, [data, selectedDate, selectedTime]);

  if (!isReady) {
    return <LoadingScreen label="Loading available times…" />;
  }

  if (!data.host || data.host.username !== username.toLowerCase()) {
    return <BookingNotFound />;
  }

  const host = data.host;
  const slots = getSlots(data, selectedDate);
  const canContinue = selectedDate !== null && selectedTime !== null;

  function handleSelectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setSelectedTime(null);
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const params = new URLSearchParams({
      date: selectedDate,
      time: selectedTime,
    });

    router.push(
      `/book/${encodeURIComponent(username)}/details?${params.toString()}`,
    );
  }

  return (
    <div className="space-y-4 pb-4 pt-2">
      <StepProgress step={1} nextLabel="Next: Guest details" />

      <EventSummary
        hostName={host.fullName}
        meetingTitle={host.meetingTitle}
        durationMinutes={host.durationMinutes}
      />

      <Card>
        <BookingCalendar
          availability={data.availability}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      </Card>

      <section className="space-y-3" aria-labelledby="available-times-heading">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="available-times-heading"
            className="text-base font-extrabold tracking-tight text-ink"
          >
            Available times
          </h2>
          {selectedDate ? (
            <Badge variant="primary">{slots.length} open</Badge>
          ) : null}
        </div>

        {selectedDate ? (
          <>
            <p className="text-xs font-semibold text-muted">
              {formatLongDateKey(selectedDate)}
            </p>

            {slots.length > 0 ? (
              <TimeSlotList
                slots={slots}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
              />
            ) : (
              <div className="flex items-start gap-3 rounded-card border border-dashed border-line bg-surface p-4">
                <CalendarX2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-faint"
                />
                <div>
                  <p className="text-sm font-bold text-ink">
                    No times available on this day
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Try another date on the calendar, or check back once the
                    host updates their hours.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-card border border-dashed border-line bg-surface p-4">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-faint"
            />
            <div>
              <p className="text-sm font-bold text-ink">
                Pick a date to see times
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Available days are highlighted in the calendar above. The host
                has not published any upcoming availability yet.
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-line bg-canvas/95 px-4 pb-safe pt-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mb-2 flex min-h-5 items-center gap-2 text-xs font-semibold text-muted">
          {selectedDate && selectedTime ? (
            <>
              <CalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />
              <span className="truncate">
                {formatShortDateKey(selectedDate)} ·{" "}
                {formatTimeLabel(selectedTime)} ({formatDuration(host.durationMinutes)})
              </span>
            </>
          ) : (
            <>
              <Clock3 aria-hidden="true" className="size-4 shrink-0 text-faint" />
              Select a time to continue
            </>
          )}
        </div>

        <Button
          type="button"
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Next: Guest details
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
