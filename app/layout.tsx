import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buttress — the workforce supply factory",
  description:
    "Everyone else fights over the workers who already exist. Buttress manufactures net-new construction workforce supply — reading your pipeline, recruiting career-switchers into the short trades, and dispatching them onto the jobs that created the demand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-bg text-fg flex flex-col">
        {children}
      </body>
    </html>
  );
}
