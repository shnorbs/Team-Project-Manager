"use client";

import { useState } from "react";

export default function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-xl font-bold">Add a task</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,30rem)_13rem]">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
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
          />
        </div>

        <div className="space-y-5">
          <span className="mb-2 block text-sm font-medium">Priority</span>
          <select
            defaultValue="low"
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground focus:border-foreground focus:outline-none"
          >
            <option className="text-green-800" value="low">
              Low
            </option>
            <option className="text-yellow-800" value="medium">
              Medium
            </option>
            <option className="text-red-800" value="high">
              High
            </option>
          </select>

          <div>
            <span className="mb-2 block text-sm font-medium">Assign to</span>
            <select
              defaultValue="unassigned"
              className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground focus:border-foreground focus:outline-none"
            >
              <option value="unassigned">Unassigned</option>
              <option value="user1">User 1</option>
              <option value="user2">User 2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
