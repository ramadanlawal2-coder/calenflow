"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { cn, createId } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 3600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));

    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = createId();
      const record: ToastRecord = { id, ...options };

      setToasts((current) => [...current.slice(-2), record]);

      const timer = setTimeout(() => {
        dismiss(id);
      }, TOAST_DURATION_MS);

      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const currentTimers = timers.current;

    return () => {
      currentTimers.forEach((timer) => {
        clearTimeout(timer);
      });
      currentTimers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] mx-auto flex max-w-[420px] flex-col gap-2"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.variant === "error" ? "alert" : "status"}
            className="animate-toast-in pointer-events-auto flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-float"
          >
            <ToastIcon variant={item.variant ?? "info"} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="-m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-input hover:text-ink"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const className = cn(
    "mt-0.5 size-5 shrink-0",
    variant === "success" && "text-success",
    variant === "error" && "text-danger",
    variant === "info" && "text-primary",
  );

  if (variant === "success") {
    return <CheckCircle2 aria-hidden="true" className={className} />;
  }

  if (variant === "error") {
    return <AlertCircle aria-hidden="true" className={className} />;
  }

  return <Info aria-hidden="true" className={className} />;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }

  return context;
}
