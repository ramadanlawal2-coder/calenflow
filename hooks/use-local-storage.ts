"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type LocalStorageSetter<T> = (
  value: T | ((current: T) => T),
) => void;

export interface UseLocalStorageOptions<T> {
  /** Parse the raw string yourself (useful for schema validation). */
  deserialize?: (raw: string) => T;
  /** Customise how the value is written. Defaults to JSON.stringify. */
  serialize?: (value: T) => string;
  /** Keep multiple tabs in sync. Defaults to true. */
  syncTabs?: boolean;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: LocalStorageSetter<T>;
  remove: () => void;
  /** False during the first render and while browser data is being read. */
  isReady: boolean;
  error: string | null;
}

/**
 * SSR-safe localStorage state.
 *
 * localStorage is only touched inside effects and event handlers. The first
 * render always uses `initialValue`, so server and client markup match. Callers
 * must render a loading state until `isReady` becomes true.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): UseLocalStorageResult<T> {
  const [value, setStateValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValueRef = useRef(initialValue);
  const valueRef = useRef(value);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  const syncTabs = options.syncTabs ?? true;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let cancelled = false;

    setIsReady(false);

    try {
      const raw = window.localStorage.getItem(key);

      if (raw !== null) {
        const deserialize = optionsRef.current.deserialize;
        const parsed = deserialize
          ? deserialize(raw)
          : (JSON.parse(raw) as T);

        if (!cancelled) {
          valueRef.current = parsed;
          setStateValue(parsed);
          setError(null);
        }
      }
    } catch {
      if (!cancelled) {
        setError("We couldn't read the saved data in this browser.");
      }
    } finally {
      if (!cancelled) {
        setIsReady(true);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [key]);

  const setValue = useCallback<LocalStorageSetter<T>>(
    (next) => {
      if (typeof window === "undefined") {
        return;
      }

      const resolved =
        typeof next === "function"
          ? (next as (current: T) => T)(valueRef.current)
          : next;

      try {
        const serialize = optionsRef.current.serialize;
        const serialized = serialize
          ? serialize(resolved)
          : JSON.stringify(resolved);

        if (typeof serialized !== "string") {
          throw new Error("The value could not be serialized.");
        }

        window.localStorage.setItem(key, serialized);
        valueRef.current = resolved;
        setStateValue(resolved);
        setError(null);
      } catch {
        setError("We couldn't save your changes in this browser.");
      }
    },
    [key],
  );

  const remove = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      const fallback = initialValueRef.current;
      valueRef.current = fallback;
      setStateValue(fallback);
      setError(null);
    } catch {
      setError("We couldn't clear the saved data in this browser.");
    }
  }, [key]);

  useEffect(() => {
    if (!syncTabs) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        const fallback = initialValueRef.current;
        valueRef.current = fallback;
        setStateValue(fallback);
        return;
      }

      try {
        const deserialize = optionsRef.current.deserialize;
        const parsed = deserialize
          ? deserialize(event.newValue)
          : (JSON.parse(event.newValue) as T);

        valueRef.current = parsed;
        setStateValue(parsed);
        setError(null);
      } catch {
        setError("We couldn't read a change made in another tab.");
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [key, syncTabs]);

  return {
    value,
    setValue,
    remove,
    isReady,
    error,
  };
}
