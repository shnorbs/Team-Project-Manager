"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "@/lib/projects";
import { getCurrentUser } from "@/lib/auth";

export default function AddProjectPage() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState("");

  const router = useRouter();

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

    addProject({
      ownerId: user.id,
      members: [user.id],
      title,
      description: description.trim() === "" ? undefined : description,
    });

    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-5xl px-6 py-12"
    >
      <h1 className="text-xl font-bold">Add a project</h1>

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

        <button
          type="submit"
          className="self-start rounded-lg bg-foreground p-3 text-background hover:bg-foreground/80"
        >
          Add Project
        </button>
      </div>
    </form>
  );
}
