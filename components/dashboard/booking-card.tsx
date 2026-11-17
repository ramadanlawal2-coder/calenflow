import {
  CalendarDays,
  Clock3,
  Mail,
  MessageSquareText,
  XCircle,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBookingDateTime, toDateTime } from "@/lib/date";
import type { Booking } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export interface BookingCardProps {
  booking: Booking;
  meetingTitle: string;
  now: Date;
  onCancel: (booking: Booking) => void;
}

export function BookingCard({
  booking,
  meetingTitle,
  now,
  onCancel,
}: BookingCardProps) {
  const start = toDateTime(booking.date, booking.time);
  const isPast = start.getTime() < now.getTime();
  const isCancelled = booking.status === "cancelled";

  const badge: { variant: BadgeVariant; label: string } = isCancelled
    ? { variant: "danger", label: "Cancelled" }
    : isPast
      ? { variant: "neutral", label: "Past" }
      : { variant: "success", label: "Confirmed" };

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={booking.guestName} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">
              {booking.guestName}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">{meetingTitle}</p>
            <p className="mt-1 inline-flex max-w-full items-center gap-1 text-[11px] text-faint">
              <Mail aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{booking.guestEmail}</span>
            </p>
          </div>
        </div>

        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      <div className="space-y-2 rounded-control bg-input p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <CalendarDays
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          {formatBookingDateTime(booking.date, booking.time)}
        </p>
        <p className="flex items-center gap-2 text-xs text-muted">
          <Clock3 aria-hidden="true" className="size-4 shrink-0" />
          {formatDuration(booking.durationMinutes)}
        </p>
      </div>

      {booking.guestNote ? (
        <div className="flex items-start gap-2 rounded-control bg-input px-3 py-2.5">
          <MessageSquareText
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-faint"
          />
          <p className="text-xs italic leading-relaxed text-muted">
            &ldquo;{booking.guestNote}&rdquo;
          </p>
        </div>
      ) : null}

      {!isCancelled && !isPast ? (
        <div className="flex justify-end border-t border-line pt-3">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => onCancel(booking)}
          >
            <XCircle aria-hidden="true" className="size-4" />
            Cancel booking
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
