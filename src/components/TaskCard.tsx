"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Task } from "@/types/tasks.types";

const STATUS_LABELS: Record<Task["status"], string> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const STATUS_OPTIONS: Task["status"][] = ["to-do", "in-progress", "done"];

interface TaskCardProps {
  task: Task;
  assigneeName: string;
  canManage: boolean;
  canUpdateStatus: boolean;
  projectId: string;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  assigneeName,
  canManage,
  canUpdateStatus,
  projectId,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showMenu = canManage || canUpdateStatus;

  return (
    <div className="flex items-start justify-between rounded-lg border-2 border-foreground/50 p-4">
      <div>
        <p className="font-medium">{task.title}</p>

        {task.description && (
          <p className="text-sm text-foreground/60">{task.description}</p>
        )}

        <p className="mt-1 text-xs text-foreground/50">
          {task.priority} · {STATUS_LABELS[task.status]} · {assigneeName}
        </p>
      </div>

      {showMenu && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-md border-2 border-foreground/50 px-3 py-1 text-sm font-medium hover:bg-foreground/5"
          >
            •••
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border-2 border-foreground/50 bg-background p-1 shadow-lg">
              <p className="px-3 pb-1 pt-2 text-xs font-medium text-foreground/50">
                Set status
              </p>

              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(task.id, status);
                    setOpen(false);
                  }}
                  disabled={status === task.status}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5 disabled:opacity-40"
                >
                  {STATUS_LABELS[status]}
                  {status === task.status && <span>✓</span>}
                </button>
              ))}

              {canManage && (
                <>
                  <div className="my-1 border-t border-foreground/20" />

                  <Link
                    href={`/${projectId}/task-form?taskId=${task.id}`}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-foreground/5"
                    onClick={() => setOpen(false)}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setOpen(false);
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
