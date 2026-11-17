"use client";

import {
  useId,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  containerClassName,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <div className={cn("space-y-2", containerClassName)}>
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

      <textarea
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={cn(
          "min-h-28 w-full resize-y rounded-control border bg-input px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-faint focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger" : "border-transparent",
          className,
        )}
        {...props}
      />

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
