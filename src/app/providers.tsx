"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      {children}
      {/* Global toast host: used for delete/create/update success and error feedback. */}
      <Toaster position="top-right" richColors closeButton />
    </TRPCReactProvider>
  );
}
