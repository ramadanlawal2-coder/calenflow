import { BadgeCheck, Clock3, Video } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, formatDuration } from "@/lib/utils";

export interface EventSummaryProps {
  hostName: string;
  meetingTitle: string;
  durationMinutes: number;
  footer?: ReactNode;
  className?: string;
}

export function EventSummary({
  hostName,
  meetingTitle,
  durationMinutes,
  footer,
  className,
}: EventSummaryProps) {
  return (
    <Card className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3">
        <Avatar name={hostName} size="lg" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Host
          </p>
          <p className="mt-1 flex items-center gap-1 text-base font-extrabold tracking-tight text-ink">
            <span className="truncate">{hostName}</span>
            <BadgeCheck
              aria-label="Verified host"
              className="size-4 shrink-0 text-primary"
            />
          </p>
          <p className="mt-1 text-sm leading-snug text-muted">
            {meetingTitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-input px-3 py-1.5 text-xs font-semibold text-muted">
          <Clock3 aria-hidden="true" className="size-3.5 text-primary" />
          {formatDuration(durationMinutes)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-input px-3 py-1.5 text-xs font-semibold text-muted">
          <Video aria-hidden="true" className="size-3.5 text-primary" />
          Video call
        </span>
      </div>

      {footer ? (
        <div className="border-t border-line pt-3">{footer}</div>
      ) : null}
    </Card>
  );
}
