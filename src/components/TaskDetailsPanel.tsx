"use client";

import { Task } from "@/types/tasks.types";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_STYLES,
  PRIORITY_STYLES,
} from "@/lib/task-card-styles";
import { useState } from "react";

interface TaskDetailsPanelProps {
  task: Task | null;
  assigneeName: string;
  canManage: boolean;
  canUpdateStatus: boolean;
  onStatusChange: (status: Task["status"]) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function TaskDetailsPanel({
  task,
  assigneeName,
  canManage,
  canUpdateStatus,
  onStatusChange,
  onDelete,
  onEdit,
}: TaskDetailsPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!task) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 p-6 text-center text-foreground/50">
        Select a task to view its details.
      </div>
    );
  }

  const showSettings = canManage || canUpdateStatus;
  const priorityOutline = PRIORITY_STYLES[task.priority].outline;
  const statusStyle = STATUS_STYLES[task.status];

  return (
    <section
      className="rounded-lg border-2 bg-background/60 p-4 shadow-md sm:p-6"
      style={{ borderColor: priorityOutline }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            {task.priority} priority
          </span>
          <h2 className="mt-2 whitespace-normal text-2xl font-bold">
            {task.title}
          </h2>
          {task.description && (
            <p
              className="mt-3 whitespace-pre-wrap text-foreground/70"
              style={{ overflowWrap: "anywhere" }}
            >
              {task.description}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.badge}`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      <div className="mt-8 border-t border-foreground/15 pt-4 text-sm text-foreground/60">
        <p>Assigned to: {assigneeName}</p>
      </div>

      {showSettings && (
        <div className="mt-6 border-t border-foreground/15 pt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/50">
            Update status
          </p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                disabled={status === task.status}
                className={`rounded-full border-2 px-5 py-2 text-sm font-medium disabled:cursor-default ${STATUS_STYLES[status].border} ${STATUS_STYLES[status].hover} ${
                  status === task.status
                    ? STATUS_STYLES[status].selected
                    : "bg-transparent"
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          {canManage && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-foreground/15 pt-4">
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full border-2 border-foreground/30 px-5 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-3 sm:p-6">
          <div className="modal-scrollbar max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border-2 border-foreground/20 bg-background p-4 shadow-xl sm:max-w-sm sm:p-6">
            <h3 className="text-xl font-bold">Delete task?</h3>
            <p className="mt-2 text-sm text-foreground/60">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-full border-2 border-foreground/30 px-5 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
