import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { HostHeader } from "@/components/layout/host-header";

export default function HostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <HostHeader />
      <main className="mx-auto w-full max-w-[480px] flex-1 px-4 pb-28 pt-5 sm:px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
