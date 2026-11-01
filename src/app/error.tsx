"use client";

import { ErrorBanner } from "@/shared/components/error-banner";
import { PageHeader } from "@/shared/components/page-header";

/** Last-resort boundary for unexpected errors (e.g. a failure while rendering on the server). */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PageHeader title="Something went wrong" />
      <ErrorBanner message={error.message || "An unexpected error occurred."} onRetry={reset} />
    </>
  );
}
