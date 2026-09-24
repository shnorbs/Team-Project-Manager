"use client";

import { useEffect, useState } from "react";
import { addTask, getTaskById, updateTask } from "@/lib/tasks";
import { getUsers } from "@/lib/auth";
import { getProjectMembers } from "@/lib/projects";
import { Task } from "@/types/tasks.types";
import { User } from "@/types/users.types";
import {
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "@/lib/task-card-styles";

interface TaskFormProps {
  projectId: string;
  taskId?: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function TaskForm({
  projectId,
  taskId = null,
  onSaved,
  onCancel,
}: TaskFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("low");
  const [status, setStatus] = useState<Task["status"]>("to-do");
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    setLoadingUsers(true);
    const projectMemberIds = getProjectMembers(projectId);
    const timer = window.setTimeout(() => {
      setUsers(getUsers().filter((user) => projectMemberIds.includes(user.id)));
      setLoadingUsers(false);
    }, 350);

    if (!taskId) return () => window.clearTimeout(timer);

    const task = getTaskById(taskId);
    if (!task) return () => window.clearTimeout(timer);

    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setStatus(task.status);
    setAssignedTo(task.assignedTo);
    return () => window.clearTimeout(timer);
  }, [projectId, taskId]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title cannot be empty.");
      return;
    }
    if (trimmedTitle.length > 100) {
      setTitleError("Title must be 100 characters or fewer.");
      return;
    }

    const taskData: Omit<Task, "id"> = {
      projectId,
      title: trimmedTitle,
      description: description.trim(),
      priority,
      status,
      assignedTo,
    };

    if (taskId) {
      updateTask({ id: taskId, ...taskData });
    } else {
      addTask(taskData);
    }

    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Title"
          required
          minLength={1}
          maxLength={100}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleError(null);
          }}
          onBlur={() => {
            setTitleError(
              !title.trim()
                ? "Title cannot be empty."
                : title.trim().length > 100
                  ? "Title must be 100 characters or fewer."
                  : null,
            );
          }}
          className="modal-field w-full rounded-lg bg-background p-3 text-foreground placeholder:text-foreground/40"
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-700">{titleError}</p>
        )}
      </div>

      <textarea
        rows={3}
        placeholder="Description (optional)"
        maxLength={2000}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="modal-field w-full rounded-lg bg-background p-3 text-foreground placeholder:text-foreground/40"
      />

      <div>
        <label className="mb-2 block text-sm font-medium">Priority</label>
        <div className="flex flex-wrap gap-2">
          {(["low", "medium", "high"] as Task["priority"][]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPriority(option)}
              className={`rounded-full border-2 px-5 py-2 text-sm font-medium capitalize ${PRIORITY_STYLES[option].hover} ${
                priority === option
                  ? PRIORITY_STYLES[option].selected
                  : "bg-transparent"
              }`}
              style={{ borderColor: PRIORITY_STYLES[option].outline }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`rounded-full border-2 px-5 py-2 text-sm font-medium ${STATUS_STYLES[option].border} ${STATUS_STYLES[option].hover} ${
                status === option
                  ? STATUS_STYLES[option].selected
                  : "bg-transparent"
              }`}
            >
              {STATUS_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Assigned to</label>
        {loadingUsers ? (
          <div className="flex items-center gap-3 py-3 text-sm text-foreground/60">
            <span className="loading-spinner" /> Loading users...
          </div>
        ) : (
          <select
            value={assignedTo || ""}
            onChange={(event) => setAssignedTo(event.target.value || null)}
            className="modal-field w-full rounded-lg bg-background p-3 text-foreground"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border-2 border-foreground/30 px-4 py-3 font-medium hover:bg-foreground/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-foreground px-4 py-3 font-medium text-background hover:opacity-90"
        >
          {taskId ? "Save Changes" : "Add Task"}
        </button>
      </div>
    </form>
  );
}
