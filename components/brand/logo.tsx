import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const markSizes: Record<LogoSize, string> = {
  sm: "size-9 rounded-[8px]",
  md: "size-11 rounded-[10px]",
  lg: "size-28 rounded-[25px]",
};

const wordSizes: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-4xl",
};

export function LogoMark({
  size = "md",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#5e5cee_0%,#4f48e1_55%,#3e36b6_100%)] text-white shadow-[0_10px_30px_-12px_rgba(79,70,229,0.65)]",
        markSizes[size],
        className,
      )}
    >
      <svg viewBox="0 0 64 64" fill="none" className="size-full">
        <defs>
          <linearGradient
            id="cf-mark-peg"
            x1="32"
            y1="6"
            x2="32"
            y2="15"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#dedcf8" />
          </linearGradient>

          <linearGradient
            id="cf-mark-ring"
            x1="16"
            y1="22"
            x2="49"
            y2="47"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e9ebfe" />
            <stop offset="0.55" stopColor="#dde1fd" />
            <stop offset="1" stopColor="#c8cef9" />
          </linearGradient>

          <mask id="cf-mark-ring-mask">
            <ellipse cx="32.3" cy="34.5" rx="16.55" ry="12.85" fill="white" />
            <ellipse cx="33.5" cy="34.8" rx="11" ry="8" fill="black" />
            <path
              d="M29 34.2C26.5 34.6 23.5 35.3 20.9 36.9C21.8 39.2 23.2 40.9 25 41.5C27 42.2 29.2 41.6 31 40.2L34 36Z"
              fill="black"
            />
          </mask>
        </defs>

        {/* Binder pegs */}
        <rect
          x="16.6"
          y="6.7"
          width="5.6"
          height="7.7"
          rx="2.6"
          fill="url(#cf-mark-peg)"
          transform="rotate(-3 19.4 10.5)"
        />
        <rect
          x="41.5"
          y="6.7"
          width="5.6"
          height="7.7"
          rx="2.6"
          fill="url(#cf-mark-peg)"
          transform="rotate(3 44.3 10.5)"
        />

        {/* Calendar body */}
        <rect
          x="9.2"
          y="10.6"
          width="45.6"
          height="40.8"
          rx="6.2"
          fill="white"
          fillOpacity="0.12"
          stroke="white"
          strokeOpacity="0.16"
          strokeWidth="0.6"
        />

        {/* Header band + divider */}
        <path
          d="M15.4 10.6H48.6A6.2 6.2 0 0 1 54.8 16.8V21.2H9.2V16.8A6.2 6.2 0 0 1 15.4 10.6Z"
          fill="white"
          fillOpacity="0.22"
        />
        <path
          d="M9.4 21.2H54.6"
          stroke="white"
          strokeOpacity="0.22"
          strokeWidth="0.7"
        />

        {/* Looped ring */}
        <ellipse
          cx="32.3"
          cy="34.5"
          rx="16.55"
          ry="12.85"
          fill="url(#cf-mark-ring)"
          mask="url(#cf-mark-ring-mask)"
        />

        {/* Accents */}
        <circle cx="24.9" cy="39.2" r="1.1" fill="#e3e1fc" opacity="0.95" />
        <circle cx="33.9" cy="34.7" r="1.2" fill="#94a0ff" opacity="0.7" />
        <circle cx="46" cy="28.3" r="3.4" fill="#a5f3fc" opacity="0.18" />
        <circle cx="46" cy="28.3" r="2.35" fill="#a5f3fc" />
      </svg>
    </span>
  );
}

export function Logo({
  size = "md",
  className,
  markClassName,
  showWordmark = true,
}: {
  size?: LogoSize;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} className={markClassName} />
      {showWordmark ? (
        <span
          className={cn(
            "font-extrabold tracking-tight text-ink",
            wordSizes[size],
          )}
        >
          Calen<span className="text-primary">Flow</span>
        </span>
      ) : null}
    </span>
  );
}
