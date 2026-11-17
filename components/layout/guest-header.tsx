import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";

export interface GuestHeaderProps {
  title: string;
  backHref: string;
  hostName?: string;
}

export function GuestHeader({ title, backHref, hostName }: GuestHeaderProps) {
  return (
    <header className="-mx-4 mb-4 border-b border-line bg-canvas/90 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="pt-safe">
        <div className="grid min-h-14 grid-cols-[44px_1fr_44px] items-center gap-2">
          <Link
            href={backHref}
            aria-label="Go back"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-input"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>

          <h1 className="truncate text-center text-base font-bold text-ink">
            {title}
          </h1>

          {hostName ? (
            <span className="flex justify-end">
              <Avatar name={hostName} size="md" />
            </span>
          ) : (
            <span aria-hidden="true" className="size-11" />
          )}
        </div>
      </div>
    </header>
  );
}
