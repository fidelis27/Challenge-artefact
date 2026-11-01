import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/shared/components/app-header";
import { Providers } from "./providers";
// Self-hosted variable font (no network request to a font CDN at build or run time).
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task manager: Next.js 15 + tRPC with in-memory storage.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppHeader />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
