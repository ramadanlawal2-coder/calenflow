import type { Metadata } from "next";

import { BookingStepOne } from "@/components/booking/booking-step-one";

interface BookingPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Book with ${username}`,
    description:
      "Pick a date and time, share your details, and confirm your appointment in seconds.",
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { username } = await params;
  const query = await searchParams;

  return (
    <BookingStepOne
      username={username}
      initialDate={firstValue(query.date)}
      initialTime={firstValue(query.time)}
    />
  );
}
