import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Link2,
  Settings2,
} from "lucide-react";

import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { Card } from "@/components/ui/card";
import { getBookingPath, getDisplayBookingUrl } from "@/lib/utils";
import type { HostProfile } from "@/lib/types";

export interface PublicPageCardProps {
  host: HostProfile;
  hasAvailability: boolean;
}

export function PublicPageCard({ host, hasAvailability }: PublicPageCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-input text-primary">
            <Link2 aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Your public page
            </p>
            <p className="mt-1 truncate text-sm font-bold text-ink">
              {getDisplayBookingUrl(host.username)}
            </p>
          </div>
        </div>

        <CopyLinkButton
          username={host.username}
          label="Copy link"
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-xs font-medium text-muted">
          {hasAvailability ? (
            <>
              <CheckCircle2
                aria-hidden="true"
                className="size-4 text-success"
              />
              <span className="text-success">Active &amp; accepting bookings</span>
            </>
          ) : (
            <>
              <Settings2 aria-hidden="true" className="size-4 text-warning" />
              <span className="text-warning">
                Add working hours to start accepting bookings
              </span>
            </>
          )}
        </p>

        <Link
          href={hasAvailability ? getBookingPath(host.username) : "/dashboard/availability"}
          className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          {hasAvailability ? "Preview page" : "Set availability"}
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
