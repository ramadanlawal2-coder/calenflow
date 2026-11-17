import { cn, getInitials } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "size-8 text-[11px]",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
};

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#5e5cee_0%,#4f48e1_100%)] font-bold text-white ring-2 ring-surface",
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
