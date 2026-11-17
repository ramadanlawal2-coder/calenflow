"use client";

import { useCallback, useState } from "react";
import {
  CalendarDays,
  CalendarX2,
  Search,
} from "lucide-react";

import { BookingCard } from "@/components/dashboard/booking-card";
import { HostRequired } from "@/components/dashboard/host-required";
import { PublicPageCard } from "@/components/dashboard/public-page-card";
import { WorkspaceTabs } from "@/components/layout/workspace-tabs";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageHeader } from "@/components/ui/page-header";
import { BOOKING_FILTERS } from "@/lib/constants";
import { formatBookingDateTime, toDateTime } from "@/lib/date";
import type { Booking, BookingFilter } from "@/lib/types";
import { cn, getBookingPath } from "@/lib/utils";
import { useBookingData } from "@/providers/booking-data-provider";
import { useToast } from "@/providers/toast-provider";

export function BookingsView() {
  const { data, isReady, setData } = useBookingData();
  const { toast } = useToast();

  const [filter, setFilter] = useState<BookingFilter>("upcoming");
  const [query, setQuery] = useState("");
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

  const closeCancelDialog = useCallback(() => {
    setPendingCancel(null);
  }, []);

  if (!isReady) {
    return <LoadingScreen label="Loading your bookings…" />;
  }

  if (!data.host) {
    return <HostRequired />;
  }

  const host = data.host;
  const now = new Date();
  const search = query.trim().toLowerCase();

  const upcomingCount = data.bookings.filter((booking) => {
    const start = toDateTime(booking.date, booking.time).getTime();
    return booking.status === "confirmed" && start >= now.getTime();
  }).length;

  const pastCount = data.bookings.filter((booking) => {
    const start = toDateTime(booking.date, booking.time).getTime();
    return booking.status === "confirmed" && start < now.getTime();
  }).length;

  const cancelledCount = data.bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  const counts: Record<BookingFilter, number> = {
    all: data.bookings.length,
    upcoming: upcomingCount,
    past: pastCount,
    cancelled: cancelledCount,
  };

  const filteredBookings = data.bookings
    .filter((booking) => {
      const start = toDateTime(booking.date, booking.time).getTime();

      if (filter === "upcoming") {
        return booking.status === "confirmed" && start >= now.getTime();
      }

      if (filter === "past") {
        return booking.status === "confirmed" && start < now.getTime();
      }

      if (filter === "cancelled") {
        return booking.status === "cancelled";
      }

      return true;
    })
    .filter((booking) => {
      if (search.length === 0) {
        return true;
      }

      return (
        booking.guestName.toLowerCase().includes(search) ||
        booking.guestEmail.toLowerCase().includes(search) ||
        booking.guestNote?.toLowerCase().includes(search) === true
      );
    })
    .sort((first, second) => {
      return (
        toDateTime(first.date, first.time).getTime() -
        toDateTime(second.date, second.time).getTime()
      );
    });

  const hasAvailability = Object.values(data.availability).some(
    (day) => day.enabled,
  );

  const currentFilterLabel =
    BOOKING_FILTERS.find((option) => option.value === filter)?.label ??
    "matching";

  function confirmCancellation() {
    if (!pendingCancel) {
      return;
    }

    const bookingId = pendingCancel.id;
    const cancelledAt = new Date().toISOString();

    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "cancelled", cancelledAt }
          : booking,
      ),
    }));

    toast({
      title: "Booking cancelled",
      description: "The guest's time slot is available again.",
      variant: "success",
    });

    closeCancelDialog();
  }

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title="Bookings"
        description="Review upcoming appointments, search your guests, and keep your schedule flexible."
      />

      <PublicPageCard host={host} hasAvailability={hasAvailability} />

      <WorkspaceTabs />

      {data.bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="Your booking page is ready. Share the link with guests and your first appointment will appear here."
          action={
            <div className="flex w-full flex-col gap-2">
              <CopyLinkButton
                username={host.username}
                label="Copy booking link"
                variant="primary"
                size="md"
                fullWidth
              />
              <ButtonLink
                href={getBookingPath(host.username)}
                variant="outline"
                size="md"
                fullWidth
              >
                Preview booking page
              </ButtonLink>
            </div>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search bookings or attendees"
                placeholder="Search bookings or attendees…"
                className="min-h-12 w-full rounded-control border border-transparent bg-input pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <div
              role="group"
              aria-label="Filter bookings"
              className="scrollbar-none flex gap-2 overflow-x-auto pb-1"
            >
              {BOOKING_FILTERS.map((option) => {
                const active = filter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-surface text-muted hover:text-ink",
                    )}
                  >
                    {option.label}
                    <span
                      className={cn(
                        "inline-flex min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-input text-muted",
                      )}
                    >
                      {counts[option.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <EmptyState
              icon={CalendarX2}
              title={`No ${currentFilterLabel.toLowerCase()} bookings`}
              description={
                search.length > 0
                  ? "No guest matches that search in this filter. Try another name or clear the search."
                  : "Nothing to show in this filter yet. Check another view to see your other appointments."
              }
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                >
                  Show all bookings
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  meetingTitle={host.meetingTitle}
                  now={now}
                  onCancel={setPendingCancel}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingCancel !== null}
        title="Cancel this booking?"
        description={
          pendingCancel
            ? `This will release ${pendingCancel.guestName}'s slot on ${formatBookingDateTime(
                pendingCancel.date,
                pendingCancel.time,
              )}. The booking stays in your cancelled list.`
            : ""
        }
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        onConfirm={confirmCancellation}
        onCancel={closeCancelDialog}
      />
    </div>
  );
}
