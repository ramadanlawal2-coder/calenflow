"use client";

import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { AuthTabs, type AuthMode } from "@/components/auth/auth-tabs";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";
import { markAuthSeen } from "@/lib/onboarding";
import { useBookingData } from "@/providers/booking-data-provider";
import { useToast } from "@/providers/toast-provider";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface AuthErrors {
  email?: string;
  password?: string;
}

export function AuthScreen() {
  const router = useRouter();
  const { data } = useBookingData();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid =
    EMAIL_PATTERN.test(email.trim()) && errors.email === undefined;

  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setPassword("");
    setShowPassword(false);
  }

  function clearError(field: keyof AuthErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleForgotPassword() {
    toast({
      title: "Password recovery is off",
      description:
        "This demo never stores passwords. Use any valid details to continue.",
      variant: "info",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const nextErrors: AuthErrors = {};
    const emailValue = email.trim();

    if (emailValue.length === 0) {
      nextErrors.email = "Enter your email address.";
    } else if (!EMAIL_PATTERN.test(emailValue)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length === 0) {
      nextErrors.password = "Enter your password.";
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: "Check your details",
        description: "Fix the highlighted fields to continue.",
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    markAuthSeen(remember);

    const destination =
      mode === "signup"
        ? "/setup"
        : data.host
          ? "/dashboard/bookings"
          : "/setup";

    toast({
      title: mode === "signin" ? "Welcome to CalenFlow" : "You're all set",
      description:
        "Demo mode — no account was created and no credentials were stored.",
      variant: "success",
    });

    router.push(destination);
  }

  function handleGoogle() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    markAuthSeen(remember);

    toast({
      title: "Google sign-in simulated",
      description:
        "Demo mode — no Google account is connected and nothing is stored.",
      variant: "info",
    });

    router.push(data.host ? "/dashboard/bookings" : "/setup");
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.16),transparent_68%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col px-4 pb-safe pt-safe sm:px-6">
        <header className="flex justify-center pt-10 sm:pt-14">
          <Logo size="md" />
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <div className="space-y-5">
            <AuthTabs mode={mode} onChange={handleModeChange} />

            <div className="flex items-start gap-2 rounded-control bg-input px-3 py-3 text-[11px] leading-relaxed text-muted">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                Demo mode — no account is created and credentials are never
                stored.
              </span>
            </div>

            <div
              role="tabpanel"
              aria-label={mode === "signin" ? "Sign in" : "Create account"}
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={
                  mode === "signin"
                    ? "Sign in to CalenFlow"
                    : "Create a CalenFlow account"
                }
                className="space-y-5"
              >
                <TextField
                  label="Email"
                  icon={Mail}
                  required
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError("email");
                  }}
                  placeholder="name@company.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={160}
                  error={errors.email}
                  labelAction={
                    emailIsValid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success">
                        <CheckCircle2
                          aria-hidden="true"
                          className="size-3.5"
                        />
                        Valid email
                      </span>
                    ) : undefined
                  }
                />

                <TextField
                  label="Password"
                  icon={LockKeyhole}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearError("password");
                  }}
                  placeholder={
                    mode === "signin"
                      ? "Enter your password"
                      : "At least 8 characters"
                  }
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  maxLength={120}
                  error={errors.password}
                  labelAction={
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="inline-flex min-h-11 items-center rounded text-xs font-semibold text-primary transition-colors hover:text-accent hover:underline"
                    >
                      Forgot?
                    </button>
                  }
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
                    >
                      {showPassword ? (
                        <EyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <Eye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  }
                />

                <Checkbox
                  checked={remember}
                  onCheckedChange={setRemember}
                  label="Remember this device"
                  description="Only skips this intro next time. No credentials are saved."
                />

                <Button type="submit" fullWidth disabled={submitting}>
                  <LockKeyhole aria-hidden="true" className="size-4" />
                  {submitting
                    ? "Please wait…"
                    : mode === "signin"
                      ? "Sign In to CalenFlow"
                      : "Create my account"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                or
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              disabled={submitting}
              onClick={handleGoogle}
              className="border-ink/20"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() =>
                  handleModeChange(mode === "signin" ? "signup" : "signin")
                }
                className="inline-flex min-h-11 items-center font-bold text-primary transition-colors hover:text-accent hover:underline"
              >
                {mode === "signin" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </main>

        <footer className="pb-8 text-center text-[11px] leading-relaxed text-faint">
          Your booking data stays in this browser. No emails are sent.
        </footer>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
