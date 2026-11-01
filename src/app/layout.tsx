import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Artefact challenge: Next.js 15 + tRPC with in-memory storage.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
