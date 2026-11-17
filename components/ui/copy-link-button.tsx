"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { copyText, getBookingUrl } from "@/lib/utils";

export interface CopyLinkButtonProps {
  username: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function CopyLinkButton({
  username,
  label = "Copy link",
  variant = "secondary",
  size = "md",
  className,
  disabled = false,
  fullWidth = false,
}: CopyLinkButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const success = await copyText(getBookingUrl(username));

    if (!success) {
      toast({
        title: "Couldn't copy the link",
        description:
          "Your browser blocked clipboard access. You can copy the link manually.",
        variant: "error",
      });
      return;
    }

    setCopied(true);
    toast({
      title: "Booking link copied",
      description: "Paste it anywhere to start accepting bookings.",
      variant: "success",
    });

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || username.length === 0}
      fullWidth={fullWidth}
      onClick={handleCopy}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      {copied ? "Copied" : label}
    </Button>
  );
}
