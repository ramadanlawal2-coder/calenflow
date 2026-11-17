import { ONBOARDING_KEYS, STORAGE_KEYS } from "@/lib/constants";

/**
 * Onboarding flags are intentionally tiny and credential-free.
 *
 * `splashSeen` lives in sessionStorage: the intro plays once per browser
 * session/tab. `authSeen` is written to sessionStorage after the demo form is
 * submitted, and optionally to localStorage when "Remember this device" is
 * checked, so future sessions can skip the intro screen.
 */

export function hasSeenSplash(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(ONBOARDING_KEYS.splashSeen) === "1";
  } catch {
    return false;
  }
}

export function markSplashSeen(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(ONBOARDING_KEYS.splashSeen, "1");
  } catch {
    // Storage can be unavailable in private or restricted contexts. The
    // intro simply plays again; nothing else depends on this flag.
  }
}

export function hasCompletedAuth(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (window.sessionStorage.getItem(ONBOARDING_KEYS.authSeen) === "1") {
      return true;
    }

    return window.localStorage.getItem(ONBOARDING_KEYS.authSeen) === "1";
  } catch {
    return false;
  }
}

export function markAuthSeen(remember: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(ONBOARDING_KEYS.authSeen, "1");

    if (remember) {
      window.localStorage.setItem(ONBOARDING_KEYS.authSeen, "1");
    }
  } catch {
    // Same as above: the demo still works without persistence.
  }
}

export function getEntryDestination(hasHost: boolean): string {
  if (hasHost) {
    return "/dashboard/bookings";
  }

  return hasCompletedAuth() ? "/setup" : "/auth";
}

/**
 * Clears every piece of demo state so the experience starts from scratch.
 *
 * Callers should navigate to "/" afterwards (ideally with a full page load) so
 * in-memory providers drop the old host and bookings.
 */
export function resetDemo(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEYS.bookingData);
    window.localStorage.removeItem(ONBOARDING_KEYS.authSeen);
    window.sessionStorage.removeItem(ONBOARDING_KEYS.authSeen);
    window.sessionStorage.removeItem(ONBOARDING_KEYS.splashSeen);
  } catch {
    // Nothing to do: a restricted context simply keeps its state.
  }
}
