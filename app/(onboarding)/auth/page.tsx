import type { Metadata } from "next";

import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to CalenFlow. This is a visual demo — no account is created and no credentials are stored.",
};

export default function AuthPage() {
  return <AuthScreen />;
}
