import type { Metadata } from "next";

import { BookingConfirmation } from "@/components/booking/booking-confirmation";

interface ConfirmationPageProps {
  params: Promise<{ username: string; bookingId: string }>;
}

export const metadata: Metadata = {
  title: "Booking confirmation",
};

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { username, bookingId } = await params;

  return (
    <BookingConfirmation username={username} bookingId={bookingId} />
  );
}
