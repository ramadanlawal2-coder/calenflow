"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  Clock3,
  Eye,
  RotateCcw,
  Save,
} from "lucide-react";

import { HostRequired } from "@/components/dashboard/host-required";
import { WorkspaceTabs } from "@/components/layout/workspace-tabs";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { validateAvailability } from "@/lib/availability";
import {
  MEETING_DURATIONS,
  WEEK_DAYS,
} from "@/lib/constants";
import { formatDayHours } from "@/lib/availability";
import type {
  AvailabilityDay,
  AvailabilityErrors,
  DayKey,
  MeetingDuration,
  WeeklyAvailability,
} from "@/lib/types";
import { cn, getBookingPath } from "@/lib/utils";
import { useBookingData } from "@/providers/booking-data-provider";
import { useToast } from "@/providers/toast-provider";

function cloneAvailability(
  availability: WeeklyAvailability,
): WeeklyAvailability {
  return {
    sunday: { ...availability.sunday },
    monday: { ...availability.monday },
    tuesday: { ...availability.tuesday },
    wednesday: { ...availability.wednesday },
    thursday: { ...availability.thursday },
    friday: { ...availability.friday },
    saturday: { ...availability.saturday },
  };
}

export function AvailabilityEditor() {
  const { data, isReady, error, setData } = useBookingData();
  const { toast } = useToast();

  const [draft, setDraft] = useState<WeeklyAvailability | null>(null);
  const [duration, setDuration] = useState<MeetingDuration>(30);
  const [errors, setErrors] = useState<AvailabilityErrors>({});
  const [dirty, setDirty] = useState(false);
  const [remoteUpdate, setRemoteUpdate] = useState(false);

  const initializedRef = useRef(false);
  const lastSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || !data.host || initializedRef.current) {
      return;
    }

    setDraft(cloneAvailability(data.availability));
    setDuration(data.host.durationMinutes);
    initializedRef.current = true;
  }, [data.availability, data.host, isReady]);

  useEffect(() => {
    if (!isReady || !data.host) {
      return;
    }

    const snapshot = JSON.stringify({
      availability: data.availability,
      duration: data.host.durationMinutes,
    });

    if (lastSnapshotRef.current === null) {
      lastSnapshotRef.current = snapshot;
      return;
    }

    if (snapshot === lastSnapshotRef.current) {
      return;
    }

    lastSnapshotRef.current = snapshot;

    if (dirty) {
      setRemoteUpdate(true);
      return;
    }

    setDraft(cloneAvailability(data.availability));
    setDuration(data.host.durationMinutes);
    setRemoteUpdate(false);
  }, [data.availability, data.host, dirty, isReady]);

  if (!isReady) {
    return <LoadingScreen label="Loading your availability…" />;
  }

  if (!data.host) {
    return <HostRequired />;
  }

  if (!draft) {
    return <LoadingScreen label="Preparing your weekly hours…" />;
  }

  const host = data.host;

  function updateDay(dayKey: DayKey, patch: Partial<AvailabilityDay>) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [dayKey]: { ...current[dayKey], ...patch },
      };
    });
    setDirty(true);

    setErrors((current) => {
      if (!current[dayKey]) {
        return current;
      }

      const next = { ...current };
      delete next[dayKey];
      return next;
    });
  }

  function reloadLatest() {
    if (!data.host) {
      return;
    }

    setDraft(cloneAvailability(data.availability));
    setDuration(data.host.durationMinutes);
    setErrors({});
    setDirty(false);
    setRemoteUpdate(false);
  }

  function handleSave() {
    if (!draft) {
      return;
    }

    const nextErrors = validateAvailability(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: "Check your working hours",
        description: "End time must be after start time on every active day.",
        variant: "error",
      });
      return;
    }

    const hasEnabledDay = Object.values(draft).some((day) => day.enabled);

    if (!hasEnabledDay) {
      toast({
        title: "Enable at least one day",
        description: "Guests need at least one bookable day on your page.",
        variant: "error",
      });
      return;
    }

    setData((current) => {
      if (!current.host) {
        return current;
      }

      return {
        ...current,
        host: {
          ...current.host,
          durationMinutes: duration,
          updatedAt: new Date().toISOString(),
        },
        availability: draft,
      };
    });

    setDirty(false);
    setRemoteUpdate(false);

    toast({
      title: "Availability saved",
      description: "Your public booking page is up to date.",
      variant: "success",
    });
  }

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title="Weekly working hours"
        description="Choose when guests can book you. Changes apply to your public page immediately after saving."
      />

      <WorkspaceTabs />

      {remoteUpdate ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-card border border-warning/30 bg-warning-soft p-4"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-warning"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-warning">
              Availability changed in another tab
            </p>
            <p className="mt-1 text-xs leading-relaxed text-warning">
              Reload the latest hours before saving, or your current edits will
              overwrite them.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={reloadLatest}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Reload
          </Button>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger"
        >
          {error}
        </div>
      ) : null}

      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-input text-primary">
            <Clock3 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-ink">
              Default meeting duration
            </h2>
            <p className="mt-1 text-xs text-muted">
              New bookings use this session length.
            </p>
          </div>
        </div>

        <SegmentedControl<MeetingDuration>
          ariaLabel="Default meeting duration"
          value={duration}
          onValueChange={(nextDuration) => {
            setDuration(nextDuration);
            setDirty(true);
          }}
          options={MEETING_DURATIONS.map((value) => ({
            value,
            label: `${value} min`,
          }))}
        />
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Schedule by day
          </p>
          <p className="text-[11px] font-medium text-muted">
            {Object.values(draft).filter((day) => day.enabled).length} active
          </p>
        </div>

        {WEEK_DAYS.map((day) => {
          const dayAvailability = draft[day.key];
          const dayError = errors[day.key];

          return (
            <div
              key={day.key}
              className="rounded-card border border-line bg-surface p-4 shadow-card"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="truncate text-sm font-extrabold text-ink">
                    {day.label}
                  </h3>
                  <Badge
                    variant={dayAvailability.enabled ? "success" : "neutral"}
                  >
                    {dayAvailability.enabled ? "Active" : "Off"}
                  </Badge>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-[11px] font-medium text-muted sm:inline">
                    {dayAvailability.enabled
                      ? formatDayHours(dayAvailability)
                      : "Unavailable"}
                  </span>
                  <Switch
                    checked={dayAvailability.enabled}
                    onCheckedChange={(checked) =>
                      updateDay(day.key, { enabled: checked })
                    }
                    label={`${day.label} availability`}
                  />
                </div>
              </div>

              {dayAvailability.enabled ? (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <div className="space-y-1">
                      <label
                        htmlFor={`${day.key}-start`}
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
                      >
                        Start
                      </label>
                      <div className="relative">
                        <Clock3
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
                        />
                        <input
                          id={`${day.key}-start`}
                          type="time"
                          step={900}
                          value={dayAvailability.start}
                          onChange={(event) =>
                            updateDay(day.key, { start: event.target.value })
                          }
                          aria-invalid={Boolean(dayError)}
                          aria-describedby={
                            dayError ? `${day.key}-error` : undefined
                          }
                          className={cn(
                            "min-h-11 w-full rounded-control border border-transparent bg-input pl-10 pr-2 text-sm font-semibold text-ink outline-none transition-colors focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15",
                            dayError && "border-danger",
                          )}
                        />
                      </div>
                    </div>

                    <span className="pb-3 text-xs font-medium text-muted">to</span>

                    <div className="space-y-1">
                      <label
                        htmlFor={`${day.key}-end`}
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
                      >
                        End
                      </label>
                      <div className="relative">
                        <Clock3
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
                        />
                        <input
                          id={`${day.key}-end`}
                          type="time"
                          step={900}
                          value={dayAvailability.end}
                          onChange={(event) =>
                            updateDay(day.key, { end: event.target.value })
                          }
                          aria-invalid={Boolean(dayError)}
                          aria-describedby={
                            dayError ? `${day.key}-error` : undefined
                          }
                          className={cn(
                            "min-h-11 w-full rounded-control border border-transparent bg-input pl-10 pr-2 text-sm font-semibold text-ink outline-none transition-colors focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15",
                            dayError && "border-danger",
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-muted sm:hidden">
                      {formatDayHours(dayAvailability)} total
                    </p>
                    {dayError ? (
                      <p
                        id={`${day.key}-error`}
                        className="text-xs font-medium text-danger"
                      >
                        {dayError}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Guests won&apos;t see this day on your booking page.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs font-semibold",
              dirty ? "text-warning" : "text-success",
            )}
          >
            {dirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <LinkToPreview username={host.username} />
        </div>

        <Button type="button" fullWidth onClick={handleSave}>
          <Save aria-hidden="true" className="size-4" />
          Save availability
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-faint">
          Working hours are saved in this browser and used for every new
          booking.
        </p>
      </Card>
    </div>
  );
}

function LinkToPreview({ username }: { username: string }) {
  return (
    <ButtonLink
      href={getBookingPath(username)}
      variant="ghost"
      size="md"
      target="_blank"
      rel="noreferrer"
    >
      <Eye aria-hidden="true" className="size-4" />
      Preview
    </ButtonLink>
  );
}
