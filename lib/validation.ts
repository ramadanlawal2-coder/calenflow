import {
  MAX_GUEST_NOTE_LENGTH,
  MEETING_DURATIONS,
  RESERVED_USERNAMES,
} from "@/lib/constants";
import type {
  GuestDetailsErrors,
  GuestDetailsValues,
  SetupFormErrors,
  SetupFormValues,
} from "@/lib/types";
import { isValidUsername, slugify } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeSetupValues(values: SetupFormValues): SetupFormValues {
  return {
    fullName: values.fullName.trim(),
    username: slugify(values.username),
    meetingTitle: values.meetingTitle.trim(),
    durationMinutes: values.durationMinutes,
  };
}

export function validateSetup(values: SetupFormValues): SetupFormErrors {
  const errors: SetupFormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!isValidUsername(values.username)) {
    errors.username =
      "Use 3–40 lowercase letters, numbers, or hyphens.";
  } else if (RESERVED_USERNAMES.has(values.username)) {
    errors.username = "That booking link is reserved. Choose another.";
  }

  if (values.meetingTitle.trim().length < 3) {
    errors.meetingTitle = "Add a clear meeting title.";
  }

  if (!MEETING_DURATIONS.includes(values.durationMinutes)) {
    errors.durationMinutes = "Choose a valid meeting duration.";
  }

  return errors;
}

export function validateGuestDetails(
  values: GuestDetailsValues,
): GuestDetailsErrors {
  const errors: GuestDetailsErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const note = values.note.trim();

  if (fullName.length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (email.length === 0) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (note.length > MAX_GUEST_NOTE_LENGTH) {
    errors.note = `Keep your note under ${MAX_GUEST_NOTE_LENGTH} characters.`;
  }

  return errors;
}
