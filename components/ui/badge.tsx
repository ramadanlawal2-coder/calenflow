import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "primary";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-input text-muted",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  primary: "bg-input text-primary",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
