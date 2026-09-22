"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getTaskById, addTask, updateTask } from "@/lib/tasks";
import { getUsers } from "@/lib/auth";
import { Task } from "@/types/tasks.types";
import { User } from "@/types/users.types";

export default function TaskFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = params["project-details"] as string;
  const taskId = searchParams.get("taskId");

  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("low");
  const [status, setStatus] = useState<Task["status"]>("to-do");
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    setUsers(getUsers());

    if (taskId) {
      const task = getTaskById(taskId);

      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setAssignedTo(task.assignedTo);
      }
    }
  }, [taskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const taskData: Omit<Task, "id"> = {
      projectId: projectId,
      title: title,
      description: description,
      priority: priority,
      status: status,
      assignedTo: assignedTo,
    };

    if (taskId) {
      updateTask({ id: taskId, ...taskData });
    } else {
      addTask(taskData);
    }

    router.push(`/${projectId}`);
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold">
        {taskId ? "Edit Task" : "Add Task"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false);
            }}
            onBlur={() => {
              if (!title.trim()) {
                setTitleError(true);
              }
            }}
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
          />

          {titleError && (
            <p className="mt-1 text-sm text-red-700">Title cannot be empty.</p>
          )}
        </div>

        <textarea
          rows={3}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground focus:border-foreground focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground focus:border-foreground focus:outline-none"
          >
            <option value="to-do">To-do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Assigned to</label>

          <select
            value={assignedTo || ""}
            onChange={(e) => setAssignedTo(e.target.value || null)}
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground focus:border-foreground focus:outline-none"
          >
            <option value="">Unassigned</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-foreground px-4 py-3 font-medium text-background hover:opacity-90"
        >
          {taskId ? "Save Changes" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
