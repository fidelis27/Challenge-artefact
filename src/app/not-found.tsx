import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Not found" />
      <p>The page or task you are looking for does not exist (or was already removed).</p>
      <Link href="/" className="button">
        Back to the list
      </Link>
    </>
  );
}
