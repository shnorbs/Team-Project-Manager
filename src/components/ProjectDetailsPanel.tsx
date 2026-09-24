"use client";

import Link from "next/link";
import { useState } from "react";
import { Project } from "@/types/projects.types";

interface ProjectDetailsPanelProps {
  project: Project | null;
  ownerName: string;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectDetailsPanel({
  project,
  ownerName,
  canManage,
  onEdit,
  onDelete,
}: ProjectDetailsPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 p-6 text-center text-foreground/50">
        Select a project to view its details.
      </div>
    );
  }

  return (
    <section className="rounded-lg border-2 border-foreground/20 bg-background/60 p-4 shadow-md sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
        Project details
      </p>
      <h2 className="mt-2 text-2xl font-bold">{project.title}</h2>
      <p
        className="mt-4 whitespace-pre-wrap text-foreground/70"
        style={{ overflowWrap: "anywhere" }}
      >
        {project.description || "No description provided."}
      </p>

      <div className="mt-8 border-t border-foreground/15 pt-4 text-sm text-foreground/60">
        <p>Owner: {ownerName}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-4">
        <div className="flex flex-wrap gap-2">
          {canManage && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full border-2 border-foreground/20 px-5 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Delete
              </button>
            </>
          )}
        </div>
        <Link
          href={`/${project.id}`}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          View More
        </Link>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-3 sm:p-6">
          <div className="modal-scrollbar max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border-2 border-foreground/20 bg-background p-4 shadow-xl sm:max-w-sm sm:p-6">
            <h3 className="text-xl font-bold">Delete project?</h3>
            <p className="mt-2 text-sm text-foreground/60">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-full border-2 border-foreground/20 px-5 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
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
