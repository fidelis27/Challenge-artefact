import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskForm } from "@/features/tasks/components/task-form";
import { getTaskOrNull } from "@/features/tasks/server/get-task-or-null";
import { PageHeader } from "@/shared/components/page-header";

export const metadata: Metadata = { title: "Edit task" };
export const dynamic = "force-dynamic";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next 15, `params` is a Promise.
  const { id } = await params;
  const task = await getTaskOrNull(id);
  if (!task) notFound();

  return (
    <>
      <PageHeader title="Edit task" />
      {/* `key` resets the form state if the user navigates between two different tasks. */}
      <TaskForm key={task.id} task={task} />
    </>
  );
}
