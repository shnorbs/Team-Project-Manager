"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Sidebar, { Tab } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { getProjectById, getProjects } from "@/lib/projects";
import { getTasksByUserId } from "@/lib/tasks";
import { Project } from "@/types/projects.types";
import { Task } from "@/types/tasks.types";

type TaskWithProject = Task & { projectTitle: string };

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const allProjects = getProjects();
    setProjects(allProjects.filter((p) => p.members.includes(user.id)));

    const userTasks = getTasksByUserId(user.id);
    setTasks(
      userTasks.map((task) => ({
        ...task,
        projectTitle:
          getProjectById(task.projectId)?.title ?? "Unknown project",
      })),
    );
  }, []);

  return (
    <div className="flex flex-1">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 px-8 py-8">
        <div className="mx-auto w-full max-w-4xl">
          {activeTab === "projects" ? (
            <>
              <h1 className="text-xl font-bold">My Projects</h1>
              <div className="mt-6">
                {projects.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} {...project} />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-foreground/60">
                      You don&apos;t have any projects yet.
                    </p>
                    <Link
                      href="/add-project"
                      className="text-foreground underline"
                    >
                      Add a project
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold">My Tasks</h1>
              <div className="mt-6 space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-foreground/60">
                    You have no tasks assigned to you.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border-2 border-foreground/50 p-4"
                    >
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-foreground/60">
                        {task.projectTitle}
                      </p>
                      <p className="mt-1 text-xs text-foreground/50">
                        {task.priority} · {task.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
