import { CalendarPlus } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function HostRequired() {
  return (
    <EmptyState
      icon={CalendarPlus}
      title="Set up your booking page first"
      description="Add your name, booking link, and meeting details. Once your page exists, your bookings and availability will live here."
      action={
        <ButtonLink href="/setup" fullWidth>
          Create your booking page
        </ButtonLink>
      }
    />
  );
}
