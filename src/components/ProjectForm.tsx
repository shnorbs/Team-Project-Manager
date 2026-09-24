"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getUsers } from "@/lib/auth";
import { addProject, getProjectById, updateProject } from "@/lib/projects";
import { User } from "@/types/users.types";

interface ProjectFormProps {
  projectId?: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProjectForm({
  projectId,
  onSaved,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set(),
  );
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    setLoadingUsers(true);
    const currentUser = getCurrentUser();
    const project = projectId ? getProjectById(projectId) : null;
    if (!currentUser) {
      setLoadingUsers(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setAllUsers(getUsers());
      setLoadingUsers(false);
    }, 350);
    if (!project) {
      setOwnerId(currentUser.id);
      return () => window.clearTimeout(timer);
    }

    setTitle(project.title);
    setDescription(project.description ?? "");
    setOwnerId(project.ownerId);
    setSelectedMemberIds(
      new Set(project.members.filter((id) => id !== project.ownerId)),
    );
    return () => window.clearTimeout(timer);
  }, [projectId]);

  function toggleMember(id: string) {
    setSelectedMemberIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const projectData = {
      ownerId: ownerId ?? currentUser.id,
      title: trimmedTitle,
      description: description.trim() === "" ? undefined : description.trim(),
      members: Array.from(
        new Set([currentUser.id, ...Array.from(selectedMemberIds)]),
      ),
    };

    if (projectId && ownerId) updateProject({ id: projectId, ...projectData });
    else addProject(projectData);
    window.dispatchEvent(new Event("projects-updated"));
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Title *"
          required
          minLength={1}
          maxLength={100}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleError(null);
          }}
          onBlur={() =>
            setTitleError(
              !title.trim()
                ? "Title cannot be empty."
                : title.trim().length > 100
                  ? "Title must be 100 characters or fewer."
                  : null,
            )
          }
          className="modal-field w-full rounded-lg bg-background p-3 text-foreground placeholder:text-foreground/40"
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-700">{titleError}</p>
        )}
      </div>

      <textarea
        rows={4}
        placeholder="Type your description here..."
        maxLength={2000}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="modal-field w-full rounded-lg bg-background p-3 text-foreground placeholder:text-foreground/40"
      />

      <div className="space-y-2">
        <p className="font-medium">Members</p>
        {loadingUsers ? (
          <div className="flex items-center gap-3 py-3 text-sm text-foreground/60">
            <span className="loading-spinner" /> Loading users...
          </div>
        ) : allUsers.length === 0 ? (
          <p className="text-sm text-foreground/60">No users available.</p>
        ) : (
          <div className="modal-field modal-field-static max-h-48 space-y-1 overflow-y-auto rounded-lg p-3">
            {allUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-2 rounded-md p-2 hover:bg-foreground/5"
              >
                <input
                  type="checkbox"
                  checked={
                    user.id === getCurrentUser()?.id ||
                    selectedMemberIds.has(user.id)
                  }
                  disabled={user.id === getCurrentUser()?.id}
                  onChange={() => toggleMember(user.id)}
                />
                <span className="text-sm">
                  {user.username}
                  {user.id === getCurrentUser()?.id && " (Owner)"}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border-2 border-foreground/20 px-5 py-2 font-medium hover:bg-foreground/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-foreground px-5 py-2 font-medium text-background hover:opacity-90"
        >
          {projectId ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
