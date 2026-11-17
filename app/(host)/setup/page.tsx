import type { Metadata } from "next";

import { HostSetup } from "@/components/host/host-setup";

export const metadata: Metadata = {
  title: "Create your booking page",
};

export default function HostSetupPage() {
  return <HostSetup />;
}
