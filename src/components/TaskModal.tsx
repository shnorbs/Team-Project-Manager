"use client";

import TaskForm from "@/components/TaskForm";

interface TaskModalProps {
  projectId: string;
  taskId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskModal({
  projectId,
  taskId = null,
  onClose,
  onSaved,
}: TaskModalProps) {
  return (
    <div
      className="modal-backdrop-enter fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="modal-scrollbar modal-fall-enter max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border-2 border-foreground/20 bg-background p-4 shadow-xl sm:max-w-md sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="task-modal-title" className="text-2xl font-bold">
            {taskId ? "Edit Task" : "Add Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task dialog"
            className="rounded-full px-3 py-1 text-xl leading-none hover:bg-foreground/10"
          >
            &times;
          </button>
        </div>

        <TaskForm
          projectId={projectId}
          taskId={taskId}
          onSaved={onSaved}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
