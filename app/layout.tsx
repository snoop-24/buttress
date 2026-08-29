import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-bg text-fg flex flex-col">
        {children}
      </body>
    </html>
  );
}
