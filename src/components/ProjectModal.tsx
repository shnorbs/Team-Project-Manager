"use client";

import ProjectForm from "@/components/ProjectForm";

interface ProjectModalProps {
  projectId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectModal({
  projectId = null,
  onClose,
  onSaved,
}: ProjectModalProps) {
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
        aria-labelledby="project-settings-title"
        className="modal-scrollbar modal-fall-enter max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border-2 border-foreground/20 bg-background p-4 shadow-xl sm:max-w-lg sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="project-settings-title" className="text-2xl font-bold">
            {projectId ? "Project Settings" : "New Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project settings dialog"
            className="rounded-full px-3 py-1 text-xl leading-none hover:bg-foreground/10"
          >
            &times;
          </button>
        </div>

        <ProjectForm
          projectId={projectId}
          onCancel={onClose}
          onSaved={onSaved}
        />
      </div>
    </div>
  );
}
