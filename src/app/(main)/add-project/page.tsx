"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addProject, getProjectById, updateProject } from "@/lib/projects";
import { getCurrentUser, getUsers } from "@/lib/auth";
import { User } from "@/types/users.types";

export default function AddProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const isEditing = !!projectId;

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/sign-in");
      return;
    }

    setAllUsers(getUsers().filter((u) => u.id !== currentUser.id));

    if (isEditing && projectId) {
      const project = getProjectById(projectId);

      if (!project || project.ownerId !== currentUser.id) {
        router.push("/");
        return;
      }

      setTitle(project.title);
      setDescription(project.description ?? "");
      setOwnerId(project.ownerId);
      setSelectedMemberIds(
        new Set(project.members.filter((id) => id !== project.ownerId)),
      );
      setLoading(false);
    } else {
      setOwnerId(currentUser.id);
      setLoading(false);
    }
  }, [isEditing, projectId, router]);

  function toggleMember(id: string) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === "") {
      setTitleError(true);
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const trimmedDescription =
      description.trim() === "" ? undefined : description;
    const members = [user.id, ...Array.from(selectedMemberIds)];

    if (isEditing && projectId && ownerId) {
      updateProject({
        id: projectId,
        ownerId,
        title,
        description: trimmedDescription,
        members,
      });
    } else {
      addProject({
        ownerId: user.id,
        members,
        title,
        description: trimmedDescription,
      });
    }

    isEditing ? router.push(`/${projectId}`) : router.push("/");
  };

  if (loading) {
    return <div className="mx-auto w-full max-w-5xl px-6 py-12">Loading…</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-5xl px-6 py-12"
    >
      <h1 className="text-xl font-bold">
        {isEditing ? "Project settings" : "Add a project"}
      </h1>

      <div className="mt-6 grid gap-8">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError(false);
            }}
            onBlur={() => setTitleError(title.trim() === "")}
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
          />
          {titleError && (
            <p className="text-sm text-red-700">Title cannot be empty.</p>
          )}

          <textarea
            rows={4}
            placeholder="Type your description here..."
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            value={description}
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium">Members</p>

          {allUsers.length === 0 ? (
            <p className="text-sm text-foreground/60">No other users yet.</p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border-2 border-foreground/50 p-3">
              {allUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-foreground/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.has(user.id)}
                    onChange={() => toggleMember(user.id)}
                  />
                  <span className="text-sm">{user.username}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-foreground p-3 text-background hover:bg-foreground/80"
        >
          {isEditing ? "Save changes" : "Add Project"}
        </button>
      </div>
    </form>
  );
}
