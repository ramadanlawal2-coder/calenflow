import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-accent",
  accent: "bg-accent text-white hover:bg-primary",
  secondary: "bg-input text-ink hover:bg-line",
  outline: "border border-line bg-surface text-ink hover:bg-input",
  ghost: "bg-transparent text-primary hover:bg-input",
  danger: "bg-danger-soft text-danger hover:bg-[#ffdfe3]",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-[52px] px-5 text-sm",
  icon: "size-11 p-0",
};

export const buttonClasses =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "lg",
      fullWidth = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={cn(
        buttonClasses,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}
