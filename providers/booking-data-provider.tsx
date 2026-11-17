"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  createDefaultBookingData,
  parseBookingData,
} from "@/lib/storage";
import type { BookingData } from "@/lib/types";

interface BookingDataContextValue {
  data: BookingData;
  isReady: boolean;
  error: string | null;
  setData: (
    value: BookingData | ((current: BookingData) => BookingData),
  ) => void;
}

const BookingDataContext = createContext<BookingDataContextValue | null>(null);

export function BookingDataProvider({ children }: { children: ReactNode }) {
  const { value, setValue, isReady, error } = useLocalStorage<BookingData>(
    STORAGE_KEYS.bookingData,
    createDefaultBookingData(),
    { deserialize: parseBookingData },
  );

  return (
    <BookingDataContext.Provider
      value={{
        data: value,
        isReady,
        error,
        setData: setValue,
      }}
    >
      {children}
    </BookingDataContext.Provider>
  );
}

export function useBookingData(): BookingDataContextValue {
  const context = useContext(BookingDataContext);

  if (context === null) {
    throw new Error(
      "useBookingData must be used inside a BookingDataProvider.",
    );
  }

  return context;
}
