"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Link2,
  Sparkles,
  User,
  Video,
  Zap,
} from "lucide-react";

import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import {
  MAX_USERNAME_LENGTH,
  MEETING_DURATIONS,
  RESERVED_USERNAMES,
} from "@/lib/constants";
import { getBookingPath, getDisplayBookingUrl, slugify, isValidUsername, createId, cn } from "@/lib/utils";
import {
  normalizeSetupValues,
  validateSetup,
} from "@/lib/validation";
import type {
  HostProfile,
  MeetingDuration,
  SetupFormErrors,
  SetupFormValues,
} from "@/lib/types";
import { useBookingData } from "@/providers/booking-data-provider";
import { useToast } from "@/providers/toast-provider";

const EMPTY_FORM: SetupFormValues = {
  fullName: "",
  username: "",
  meetingTitle: "",
  durationMinutes: 30,
};

export function HostSetup() {
  const router = useRouter();
  const { data, isReady, error, setData } = useBookingData();
  const { toast } = useToast();
  const usernameId = useId();

  const [form, setForm] = useState<SetupFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<SetupFormErrors>({});
  const [initialized, setInitialized] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  useEffect(() => {
    if (!isReady || initialized) {
      return;
    }

    if (data.host) {
      setForm({
        fullName: data.host.fullName,
        username: data.host.username,
        meetingTitle: data.host.meetingTitle,
        durationMinutes: data.host.durationMinutes,
      });
      setUsernameTouched(true);
    }

    setInitialized(true);
  }, [data.host, initialized, isReady]);

  if (!isReady) {
    return <LoadingScreen label="Loading your booking page…" />;
  }

  const previewUsername = slugify(form.username);
  const canUseUsername =
    isValidUsername(previewUsername) &&
    !RESERVED_USERNAMES.has(previewUsername);
  const displayUrl = getDisplayBookingUrl(previewUsername || "your-link");

  function clearError(field: keyof SetupFormValues) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleFullNameChange(value: string) {
    setForm((current) => ({
      ...current,
      fullName: value,
      username: usernameTouched ? current.username : slugify(value),
    }));
    clearError("fullName");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeSetupValues(form);
    const nextErrors = validateSetup(normalized);

    setForm(normalized);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: "Check your details",
        description: "Fix the highlighted fields and try again.",
        variant: "error",
      });
      return;
    }

    const now = new Date().toISOString();
    const host: HostProfile = {
      id: data.host?.id ?? createId(),
      fullName: normalized.fullName,
      username: normalized.username,
      meetingTitle: normalized.meetingTitle,
      durationMinutes: normalized.durationMinutes,
      createdAt: data.host?.createdAt ?? now,
      updatedAt: now,
    };

    setData((current) => ({ ...current, host }));

    toast({
      title: data.host ? "Booking page updated" : "Booking page created",
      description: "Your public link is ready to share.",
      variant: "success",
    });

    router.push("/dashboard/bookings");
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Your booking page"
        title="Create your booking link in 2 minutes"
        description="Set your public details once. CalenFlow turns them into a shareable page your guests can book in seconds."
      />

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger"
        >
          {error}
        </div>
      ) : null}

      <Card className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-input text-primary">
            <Zap aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-ink">
              Quick Setup
            </h2>
            <p className="mt-1 text-xs text-muted">
              Live instant preview configured below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            label="Your full name"
            icon={User}
            required
            value={form.fullName}
            onChange={(event) => handleFullNameChange(event.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={errors.fullName}
            maxLength={80}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={usernameId}
                className="text-sm font-semibold text-ink"
              >
                Personal booking URL
              </label>
              {canUseUsername ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  Available
                </span>
              ) : null}
            </div>

            <div
              className={cn(
                "flex min-h-12 overflow-hidden rounded-control border bg-input transition-colors focus-within:border-accent focus-within:bg-surface focus-within:ring-2 focus-within:ring-accent/15",
                errors.username ? "border-danger" : "border-transparent",
              )}
            >
              <span className="flex shrink-0 items-center pl-3 pr-1 text-[11px] font-semibold text-muted sm:text-xs">
                calenflow.app/book/
              </span>
              <input
                id={usernameId}
                value={form.username}
                onChange={(event) => {
                  setUsernameTouched(true);
                  setForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }));
                  clearError("username");
                }}
                onBlur={() => {
                  const nextUsername = slugify(form.username);
                  setForm((current) => ({
                    ...current,
                    username: nextUsername,
                  }));
                }}
                placeholder="ada-mentoring"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={MAX_USERNAME_LENGTH}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={
                  errors.username ? "booking-url-error" : "booking-url-hint"
                }
                className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-faint"
              />
            </div>

            {errors.username ? (
              <p
                id="booking-url-error"
                className="text-xs font-medium text-danger"
              >
                {errors.username}
              </p>
            ) : (
              <p id="booking-url-hint" className="text-xs text-muted">
                Lowercase letters, numbers, and hyphens.
              </p>
            )}
          </div>

          <TextField
            label="Primary meeting title"
            icon={Video}
            required
            value={form.meetingTitle}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                meetingTitle: event.target.value,
              }));
              clearError("meetingTitle");
            }}
            placeholder="30-min Strategy & Mentorship Call"
            error={errors.meetingTitle}
            maxLength={100}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink">
                Select session duration
              </span>
              <span className="text-xs font-bold text-primary">
                {form.durationMinutes} minutes
              </span>
            </div>
            <SegmentedControl<MeetingDuration>
              ariaLabel="Meeting duration"
              value={form.durationMinutes}
              onValueChange={(durationMinutes) => {
                setForm((current) => ({ ...current, durationMinutes }));
                clearError("durationMinutes");
              }}
              options={MEETING_DURATIONS.map((duration) => ({
                value: duration,
                label: `${duration} min`,
              }))}
            />
            {errors.durationMinutes ? (
              <p className="text-xs font-medium text-danger">
                {errors.durationMinutes}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 rounded-control bg-input px-3 py-3 text-xs text-muted">
            <Clock3 aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span>
              Guests book using the {form.durationMinutes}-minute session length.
            </span>
          </div>

          <Button type="submit" fullWidth>
            {data.host ? "Update my booking page" : "Create my booking page"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-faint">
            Your page is saved in this browser. No account or email is required.
          </p>
        </form>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-sm font-extrabold tracking-tight text-ink">
            Instant live link preview
          </h2>
        </div>

        <div className="flex min-h-12 items-center gap-2 rounded-control bg-input px-3">
          <Link2
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          />
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">
            {displayUrl}
          </span>
          <CopyLinkButton
            username={previewUsername}
            disabled={!canUseUsername}
            label="Copy"
            variant="ghost"
            size="md"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-muted">
            The preview updates as you type. Publish to open the full guest flow.
          </p>
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={!canUseUsername}
            onClick={() => {
              if (canUseUsername) {
                router.push(getBookingPath(previewUsername));
              }
            }}
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            Preview page
          </Button>
        </div>
      </Card>
    </div>
  );
}
