"use client";

import Link from "next/link";
import { Task } from "@/types/tasks.types";
import {
  STATUS_LABELS,
  STATUS_STYLES,
  PRIORITY_STYLES,
} from "@/lib/task-card-styles";

interface TaskCardProps {
  task: Task;
  assigneeName: string;
  projectId: string;
  onSelect?: (task: Task) => void;
  selected?: boolean;
}

export default function TaskCard({
  task,
  assigneeName,
  projectId,
  onSelect,
  selected = false,
}: TaskCardProps) {
  const { gradient, badge } = PRIORITY_STYLES[task.priority];
  const statusStyle = STATUS_STYLES[task.status];
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge}`}
        >
          {task.priority}
        </span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyle.badge}`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      <p className="mt-1 truncate text-lg font-bold text-white">{task.title}</p>

      <p className="mt-1 text-xs text-white/60">{assigneeName}</p>
    </>
  );

  return (
    <div
      style={{ backgroundImage: gradient }}
      className={`relative flex items-start justify-between rounded-lg p-4 shadow-md transition-all ${
        onSelect ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${selected ? "brightness-125" : ""}`}
      onClick={() => onSelect?.(task)}
      onKeyDown={(event) => {
        if (onSelect && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect(task);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="min-w-0 flex-1 pr-4">
        {onSelect ? (
          content
        ) : (
          <Link href={`/${projectId}/${task.id}`}>{content}</Link>
        )}
      </div>
    </div>
  );
}
