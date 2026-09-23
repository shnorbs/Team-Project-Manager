"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTasksByProjectId, updateTask, deleteTask } from "@/lib/tasks";
import { getUsers, getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/projects";
import { Task } from "@/types/tasks.types";
import { User } from "@/types/users.types";
import TaskCard from "@/components/TaskCard";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = {
  high: 2,
  medium: 1,
  low: 0,
};

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params["project-details"] as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerView, setOwnerView] = useState(false);

  useEffect(() => {
    refresh();

    const currentUser = getCurrentUser();
    setCurrentUserId(currentUser?.id ?? null);
    setOwnerView(!!currentUser && isOwner(projectId, currentUser.id));
  }, [projectId]);

  function refresh() {
    setTasks(getTasksByProjectId(projectId));
    setUsers(getUsers());
  }

  function getUsername(id: string | null) {
    const user = users.find((user) => user.id === id);
    return user ? user.username : "Unassigned";
  }

  function handleStatusChange(taskId: string, status: Task["status"]) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask({ ...task, status });
    refresh();
  }

  function handleDelete(taskId: string) {
    deleteTask(taskId);
    refresh();
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority],
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <div className="flex gap-2">
          {ownerView && (
            <Link
              href={`/add-project?projectId=${projectId}`}
              className="rounded-lg border-2 border-foreground/50 px-4 py-2 font-medium hover:bg-foreground/5"
            >
              Project Settings
            </Link>
          )}

          <Link
            href={`/${projectId}/task-form`}
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
          >
            Add Task
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {sortedTasks.length === 0 ? (
          <p className="text-foreground/60">No tasks yet.</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assigneeName={getUsername(task.assignedTo)}
              projectId={projectId}
              canManage={ownerView}
              canUpdateStatus={
                ownerView ||
                (!!currentUserId && task.assignedTo === currentUserId)
              }
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
