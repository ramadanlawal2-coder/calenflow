import type { Metadata } from "next";

import { BookingStepTwo } from "@/components/booking/booking-step-two";

interface DetailsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export const metadata: Metadata = {
  title: "Guest details",
};

export default async function DetailsPage({
  params,
  searchParams,
}: DetailsPageProps) {
  const { username } = await params;
  const query = await searchParams;

  return (
    <BookingStepTwo
      username={username}
      dateKey={firstValue(query.date)}
      time={firstValue(query.time)}
    />
  );
}
