import type { Metadata } from "next";
import { TaskForm } from "@/features/tasks/components/task-form";
import { PageHeader } from "@/shared/components/page-header";

export const metadata: Metadata = { title: "New task" };

export default function NewTaskPage() {
  return (
    <>
      <PageHeader title="New task" />
      <TaskForm />
    </>
  );
}
