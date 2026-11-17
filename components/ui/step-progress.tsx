import { cn } from "@/lib/utils";

export interface StepProgressProps {
  step: number;
  total?: number;
  nextLabel: string;
  complete?: boolean;
  className?: string;
}

export function StepProgress({
  step,
  total = 3,
  nextLabel,
  complete = false,
  className,
}: StepProgressProps) {
  const percentage = Math.min(100, Math.round((step / total) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.12em]">
        <span className={complete ? "text-success" : "text-primary"}>
          Step {step} of {total}
          {complete ? " · Confirmed" : ""}
        </span>
        <span className="text-right text-[11px] font-medium normal-case tracking-normal text-muted">
          {nextLabel}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Step ${step} of ${total}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        className="h-1 overflow-hidden rounded-full bg-line"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            complete ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
