"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById, updateTask, deleteTask } from "@/lib/tasks";
import { getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/projects";
import { Task } from "@/types/tasks.types";

const STATUS_LABELS: Record<Task["status"], string> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const STATUS_OPTIONS: Task["status"][] = ["to-do", "in-progress", "done"];

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params["project-details"] as string;
  const taskId = params["task-details"] as string;

  const [task, setTask] = useState<Task | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [canUpdateStatus, setCanUpdateStatus] = useState(false);

  useEffect(() => {
    refresh();
  }, [taskId]);

  function refresh() {
    const currentTask = getTaskById(taskId);
    setTask(currentTask);

    const currentUser = getCurrentUser();
    const owner = !!currentUser && isOwner(projectId, currentUser.id);
    setCanManage(owner);
    setCanUpdateStatus(
      owner || (!!currentUser && currentTask?.assignedTo === currentUser.id),
    );
  }

  function handleStatusChange(status: Task["status"]) {
    if (!task) return;
    updateTask({ ...task, status });
    refresh();
  }

  function handleDelete() {
    if (!task) return;
    deleteTask(task.id);
    router.push(`/${projectId}`);
  }

  if (!task) {
    return null;
  }

  const showSettings = canManage || canUpdateStatus;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">{task.title}</h1>

          {task.description && (
            <p className="mt-2 text-foreground/70">{task.description}</p>
          )}

          <p className="mt-2 text-xs text-foreground/50">
            {task.priority} · {STATUS_LABELS[task.status]}
          </p>
        </div>

        {showSettings && (
          <div className="flex w-full shrink-0 flex-col gap-2 rounded-lg border-2 border-foreground/50 p-3 md:w-44">
            <p className="text-xs font-medium text-foreground/50">Status</p>

            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={status === task.status}
                className="rounded-md border-2 border-foreground/30 px-3 py-1.5 text-left text-sm hover:bg-foreground/5 disabled:opacity-40"
              >
                {STATUS_LABELS[status]}
                {status === task.status && " ✓"}
              </button>
            ))}

            {canManage && (
              <>
                <div className="my-1 border-t border-foreground/20" />

                <button
                  onClick={handleDelete}
                  className="rounded-md border-2 border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
