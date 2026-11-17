import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { BookingDataProvider } from "@/providers/booking-data-provider";
import { ToastProvider } from "@/providers/toast-provider";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CalenFlow — Simple scheduling for hosts and guests",
    template: "%s · CalenFlow",
  },
  description:
    "Create a shareable booking page in minutes. Guests pick a time, share their details, and you stay in control of your schedule.",
  applicationName: "CalenFlow",
  keywords: [
    "scheduling",
    "appointments",
    "booking page",
    "calendar",
    "CalenFlow",
  ],
  authors: [{ name: "CalenFlow" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="bg-canvas text-ink antialiased">
        <BookingDataProvider>
          <ToastProvider>{children}</ToastProvider>
        </BookingDataProvider>
      </body>
    </html>
  );
}
