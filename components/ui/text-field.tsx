"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
  /** Small control rendered on the right side of the label row. */
  labelAction?: ReactNode;
  /** Control rendered inside the field, such as a password visibility toggle. */
  trailing?: ReactNode;
  containerClassName?: string;
}

export function TextField({
  label,
  icon: Icon,
  hint,
  error,
  labelAction,
  trailing,
  id,
  className,
  containerClassName,
  required,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label
          htmlFor={fieldId}
          className="flex items-center gap-1 text-sm font-semibold text-ink"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          ) : null}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint"
          />
        ) : null}
        <input
          id={fieldId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={cn(
            "min-h-12 w-full rounded-control border bg-input px-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60",
            Icon && "pl-11",
            trailing ? "pr-12" : undefined,
            error ? "border-danger" : "border-transparent",
            className,
          )}
          {...props}
        />
        {trailing ? (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
            {trailing}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
