"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import TaskDetailsPanel from "@/components/TaskDetailsPanel";
import TaskModal from "@/components/TaskModal";
import ProjectDetailsPanel from "@/components/ProjectDetailsPanel";
import ProjectModal from "@/components/ProjectModal";
import Sidebar, { Tab } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { getUsers } from "@/lib/auth";
import {
  deleteProject,
  getProjectById,
  getProjects,
  isOwner,
} from "@/lib/projects";
import { getTasksByUserId, updateTask, deleteTask } from "@/lib/tasks";
import { Project } from "@/types/projects.types";
import { Task } from "@/types/tasks.types";
import {
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "@/lib/task-card-styles";

type TaskWithProject = Task & { projectTitle: string; isProjectOwner: boolean };

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [users, setUsers] = useState<ReturnType<typeof getUsers>>([]);
  const [retrieving, setRetrieving] = useState(true);
  const [projectSearch, setProjectSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState<Task["status"] | "all">("all");
  const [taskPriority, setTaskPriority] = useState<Task["priority"] | "all">(
    "all",
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh();
      setRetrieving(false);
    }, 450);

    function handleProjectsUpdated() {
      refresh();
    }

    window.addEventListener("projects-updated", handleProjectsUpdated);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("projects-updated", handleProjectsUpdated);
    };
  }, []);

  function refresh() {
    const user = getCurrentUser();
    if (!user) return;

    setCurrentUserId(user.id);

    const allProjects = getProjects();
    const nextProjects = allProjects.filter((p) => p.members.includes(user.id));
    setProjects(nextProjects);
    setUsers(getUsers());
    setSelectedProjectId((currentId) =>
      currentId && nextProjects.some((project) => project.id === currentId)
        ? currentId
        : (nextProjects[0]?.id ?? null),
    );

    const userTasks = getTasksByUserId(user.id);
    const nextTasks = userTasks.map((task) => ({
      ...task,
      projectTitle: getProjectById(task.projectId)?.title ?? "Unknown project",
      isProjectOwner: isOwner(task.projectId, user.id),
    }));
    setTasks(nextTasks);
    setSelectedTaskId((currentId) =>
      currentId && nextTasks.some((task) => task.id === currentId)
        ? currentId
        : (nextTasks[0]?.id ?? null),
    );
  }

  function handleProjectDelete(projectId: string) {
    deleteProject(projectId);
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    setSelectedProjectId((currentId) =>
      currentId === projectId ? null : currentId,
    );
  }

  function handleTaskStatusChange(taskId: string, status: Task["status"]) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask({ ...task, status });
    refresh();
  }

  function handleTaskDelete(taskId: string) {
    deleteTask(taskId);
    refresh();
  }

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;
  const projectOwnerName = selectedProject
    ? (users.find((user) => user.id === selectedProject.ownerId)?.username ??
      "Unknown")
    : "";
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(projectSearch.toLowerCase()),
  );
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) &&
      (taskStatus === "all" || task.status === taskStatus) &&
      (taskPriority === "all" || task.priority === taskPriority),
  );
  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ??
    filteredTasks[0] ??
    null;

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:w-auto lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          {retrieving ? (
            <main className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-foreground/60">
                <span className="loading-spinner" /> Retrieving projects and
                tasks...
              </div>
            </main>
          ) : activeTab === "projects" ? (
            <>
              <h1 className="text-xl font-bold">My Projects</h1>
              <input
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder="Search projects"
                maxLength={100}
                className="modal-field mt-4 w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
              />
              <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="space-y-4">
                  {filteredProjects.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {filteredProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onSelect={(selected) =>
                            setSelectedProjectId(selected.id)
                          }
                          selected={project.id === selectedProjectId}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-foreground/60">
                        You don&apos;t have any projects yet.
                      </p>
                      <p className="mt-2 text-sm text-foreground/60">
                        Use New Project in the top bar to get started.
                      </p>
                    </div>
                  )}
                </div>
                {filteredProjects.length > 0 && (
                  <ProjectDetailsPanel
                    project={selectedProject}
                    ownerName={projectOwnerName}
                    canManage={
                      !!selectedProject &&
                      selectedProject.ownerId === currentUserId
                    }
                    onEdit={() => {
                      if (selectedProject)
                        setEditingProjectId(selectedProject.id);
                    }}
                    onDelete={() => {
                      if (selectedProject)
                        handleProjectDelete(selectedProject.id);
                    }}
                  />
                )}
              </div>
              {editingProjectId && (
                <ProjectModal
                  projectId={editingProjectId}
                  onClose={() => setEditingProjectId(null)}
                  onSaved={() => {
                    setEditingProjectId(null);
                    refresh();
                  }}
                />
              )}
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold">My Tasks</h1>
              <input
                value={taskSearch}
                onChange={(event) => setTaskSearch(event.target.value)}
                placeholder="Search tasks"
                maxLength={100}
                className="modal-field mt-4 w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTaskStatus("all")}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium ${taskStatus === "all" ? "bg-foreground/15" : "bg-transparent"} border-foreground/30`}
                >
                  All statuses
                </button>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setTaskStatus(status)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium ${STATUS_STYLES[status].border} ${taskStatus === status ? STATUS_STYLES[status].selected : "bg-transparent"} ${STATUS_STYLES[status].hover}`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTaskPriority("all")}
                  className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskPriority === "all" ? "bg-foreground/15" : "bg-transparent"}`}
                >
                  All priorities
                </button>
                {(["low", "medium", "high"] as Task["priority"][]).map(
                  (priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setTaskPriority(priority)}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-medium capitalize ${taskPriority === priority ? PRIORITY_STYLES[priority].selected : "bg-transparent"} ${PRIORITY_STYLES[priority].hover}`}
                      style={{ borderColor: PRIORITY_STYLES[priority].outline }}
                    >
                      {priority}
                    </button>
                  ),
                )}
              </div>

              <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div
                  className="task-list-scrollbar space-y-3 lg:sticky lg:top-6 lg:max-h-[calc(100vh-12rem)] lg:pl-2"
                  style={{ direction: "rtl" }}
                >
                  <div className="space-y-3" style={{ direction: "ltr" }}>
                    {filteredTasks.length === 0 ? (
                      <p className="text-foreground/60">
                        You have no tasks assigned to you.
                      </p>
                    ) : (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assigneeName={task.projectTitle}
                          projectId={task.projectId}
                          onSelect={(selectedTask) =>
                            setSelectedTaskId(selectedTask.id)
                          }
                          selected={task.id === selectedTaskId}
                        />
                      ))
                    )}
                  </div>
                </div>

                {filteredTasks.length > 0 && (
                  <TaskDetailsPanel
                    task={selectedTask}
                    assigneeName={selectedTask?.projectTitle ?? ""}
                    canManage={selectedTask?.isProjectOwner ?? false}
                    canUpdateStatus={
                      !!selectedTask &&
                      (selectedTask.isProjectOwner ||
                        selectedTask.assignedTo === currentUserId)
                    }
                    onStatusChange={(status) =>
                      selectedTask &&
                      handleTaskStatusChange(selectedTask.id, status)
                    }
                    onDelete={() =>
                      selectedTask && handleTaskDelete(selectedTask.id)
                    }
                    onEdit={() => {
                      if (selectedTask) setEditingTaskId(selectedTask.id);
                    }}
                  />
                )}
              </div>
              {editingTaskId && selectedTask && (
                <TaskModal
                  projectId={selectedTask.projectId}
                  taskId={editingTaskId}
                  onClose={() => setEditingTaskId(null)}
                  onSaved={() => {
                    setEditingTaskId(null);
                    refresh();
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
