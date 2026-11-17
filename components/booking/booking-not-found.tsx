import { CalendarX2 } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function BookingNotFound() {
  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center gap-6 py-8">
      <Logo size="md" />
      <EmptyState
        className="w-full"
        icon={CalendarX2}
        title="Booking page not found"
        description="We couldn't find a CalenFlow page at this link. Check the username, or create your own booking page in a couple of minutes."
        action={
          <div className="flex w-full flex-col gap-2">
            <ButtonLink href="/auth" fullWidth>
              Create your booking page
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="md" fullWidth>
              Back to CalenFlow
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
