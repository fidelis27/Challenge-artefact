import Link from "next/link";
import { TaskList } from "@/features/tasks/components/task-list";
import { LIST_INPUT, getNextPageParam } from "@/features/tasks/list-query";
import { PageHeader } from "@/shared/components/page-header";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// The list lives in server memory and changes at runtime, so this page must be
// rendered per request. Without this, `next build` would freeze the initial list into static HTML.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // SSR: fetch the first page on the server and hand it to the client cache.
  // The HTML that reaches the browser already contains the tasks.
  await getQueryClient().prefetchInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(LIST_INPUT, { getNextPageParam }),
  );

  return (
    <HydrateClient>
      <PageHeader
        title="Tasks"
        description="Create, edit and delete your tasks."
        action={
          <Link href="/tasks/new" className="button">
            New task
          </Link>
        }
      />
      <TaskList />
    </HydrateClient>
  );
}
