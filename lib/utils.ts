import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/lib/constants";

/** Join conditional class names without pulling in another dependency. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return "CF";
  }

  const first = parts[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";

  if (last.length > 0) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  return first.slice(0, 2).toUpperCase();
}

/** Turn a display name into a URL-safe booking username. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_USERNAME_LENGTH);
}

export function isValidUsername(value: string): boolean {
  if (value.length < MIN_USERNAME_LENGTH || value.length > MAX_USERNAME_LENGTH) {
    return false;
  }

  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/.test(value);
}

export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (rest === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${rest} min`;
}

export function getBookingPath(username: string): string {
  return `/book/${encodeURIComponent(username)}`;
}

export function getBookingUrl(username: string): string {
  const path = getBookingPath(username);

  if (typeof window === "undefined") {
    return `https://calenflow.app${path}`;
  }

  return `${window.location.origin}${path}`;
}

export function getDisplayBookingUrl(username: string): string {
  return `calenflow.app/book/${username}`;
}

/**
 * Copy text with the async Clipboard API, falling back to a temporary
 * textarea for browsers or contexts where the API is unavailable.
 */
export async function copyText(value: string): Promise<boolean> {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the legacy path.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
