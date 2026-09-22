"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTasksByProjectId } from "@/lib/tasks";
import { getUsers } from "@/lib/auth";
import { Task } from "@/types/tasks.types";
import { User } from "@/types/users.types";

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params["project-details"] as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const projectTasks = getTasksByProjectId(projectId);
    const users = getUsers();

    setTasks(projectTasks);
    setUsers(users);
  }, [projectId]);

  function getUsername(id: string | null) {
    const user = users.find((user) => user.id === id);

    if (!user) {
      return "Unassigned";
    }

    return user.username;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <Link
          href={`/${projectId}/task-form`}
          className="rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
        >
          Add Task
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {tasks.length === 0 ? (
          <p className="text-foreground/60">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start justify-between rounded-lg border-2 border-foreground/50 p-4"
            >
              <div>
                <p className="font-medium">{task.title}</p>

                {task.description && (
                  <p className="text-sm text-foreground/60">
                    {task.description}
                  </p>
                )}

                <p className="mt-1 text-xs text-foreground/50">
                  {task.priority} · {task.status} ·{" "}
                  {getUsername(task.assignedTo)}
                </p>
              </div>

              <Link
                href={`/${projectId}/task-form?taskId=${task.id}`}
                className="text-sm font-medium underline"
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
