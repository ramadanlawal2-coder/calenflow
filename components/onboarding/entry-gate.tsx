"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { SplashScreen } from "@/components/onboarding/splash-screen";
import {
  getEntryDestination,
  hasSeenSplash,
  markSplashSeen,
} from "@/lib/onboarding";
import { useBookingData } from "@/providers/booking-data-provider";

const SPLASH_DURATION_MS = 1600;
const REDUCED_MOTION_DURATION_MS = 650;

type GateState = "checking" | "playing" | "redirecting";

export function EntryGate() {
  const router = useRouter();
  const { data, isReady } = useBookingData();
  const [gateState, setGateState] = useState<GateState>("checking");
  const [skipRequested, setSkipRequested] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    setGateState(hasSeenSplash() ? "redirecting" : "playing");
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    markSplashSeen();
    router.replace(getEntryDestination(data.host !== null));
  }, [data.host, router]);

  useEffect(() => {
    if (gateState === "checking" || !isReady) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay =
      gateState === "redirecting"
        ? 0
        : skipRequested
          ? 0
          : reduceMotion
            ? REDUCED_MOTION_DURATION_MS
            : SPLASH_DURATION_MS;

    const timer = window.setTimeout(finish, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [finish, gateState, isReady, skipRequested]);

  if (gateState === "playing") {
    return <SplashScreen onSkip={() => setSkipRequested(true)} />;
  }

  // Checking flags or redirecting a returning visitor: keep the canvas blank so
  // the intro never flashes on screen for someone who has already seen it.
  return <div aria-hidden="true" className="min-h-dvh bg-canvas" />;
}
