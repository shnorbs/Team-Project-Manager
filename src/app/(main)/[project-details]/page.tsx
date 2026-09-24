"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTasksByProjectId, updateTask, deleteTask } from "@/lib/tasks";
import { getUsers, getCurrentUser } from "@/lib/auth";
import { getProjectById, isOwner } from "@/lib/projects";
import { Task } from "@/types/tasks.types";
import { User } from "@/types/users.types";
import {
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "@/lib/task-card-styles";
import TaskCard from "@/components/TaskCard";
import TaskDetailsPanel from "@/components/TaskDetailsPanel";
import TaskModal from "@/components/TaskModal";
import ProjectModal from "@/components/ProjectModal";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = {
  high: 2,
  medium: 1,
  low: 0,
};

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params["project-details"] as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerView, setOwnerView] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Project");
  const [projectDescription, setProjectDescription] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [retrieving, setRetrieving] = useState(true);
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState<Task["status"] | "all">("all");
  const [taskPriority, setTaskPriority] = useState<Task["priority"] | "all">(
    "all",
  );
  const [taskAssignee, setTaskAssignee] = useState<
    string | "all" | "unassigned"
  >("all");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh();
      setRetrieving(false);
    }, 450);

    const currentUser = getCurrentUser();
    const project = getProjectById(projectId);
    setProjectTitle(project?.title ?? "Project");
    setProjectDescription(project?.description ?? "");
    setCurrentUserId(currentUser?.id ?? null);
    setOwnerView(!!currentUser && isOwner(projectId, currentUser.id));
    return () => window.clearTimeout(timer);
  }, [projectId]);

  function refresh() {
    const nextTasks = getTasksByProjectId(projectId);
    setTasks(nextTasks);
    setUsers(getUsers());
    setSelectedTaskId((currentId) =>
      currentId && nextTasks.some((task) => task.id === currentId)
        ? currentId
        : (nextTasks[0]?.id ?? null),
    );
  }

  function getUsername(id: string | null) {
    const user = users.find((user) => user.id === id);
    return user ? user.username : "Unassigned";
  }

  function handleStatusChange(taskId: string, status: Task["status"]) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask({ ...task, status });
    refresh();
  }

  function handleDelete(taskId: string) {
    deleteTask(taskId);
    refresh();
  }

  function clearSelectedTask() {
    setSelectedTaskId(null);
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority],
  );
  const filteredTasks = sortedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) &&
      (taskStatus === "all" || task.status === taskStatus) &&
      (taskPriority === "all" || task.priority === taskPriority) &&
      (taskAssignee === "all" ||
        (taskAssignee === "unassigned"
          ? task.assignedTo === null
          : task.assignedTo === taskAssignee)),
  );
  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ??
    filteredTasks[0] ??
    null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {retrieving ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-foreground/60">
            <span className="loading-spinner" /> Retrieving tasks...
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 sm:pl-2">
              <h1 className="text-2xl font-bold">{projectTitle}</h1>
              {projectDescription && (
                <p className="mt-1 text-sm text-foreground/60">
                  {projectDescription}
                </p>
              )}
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              {ownerView && (
                <button
                  type="button"
                  onClick={() => setShowProjectModal(true)}
                  className="rounded-lg border-2 border-foreground/50 px-4 py-2 font-medium hover:bg-foreground/5"
                >
                  Project Settings
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingTaskId(null);
                  setShowTaskModal(true);
                }}
                className="rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
              >
                Add Task
              </button>
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="-mb-2 md:col-span-2">
              <input
                value={taskSearch}
                onChange={(event) => {
                  setTaskSearch(event.target.value);
                  clearSelectedTask();
                }}
                placeholder="Search tasks"
                maxLength={100}
                className="modal-field w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTaskStatus("all");
                    clearSelectedTask();
                  }}
                  className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskStatus === "all" ? "bg-foreground/15" : "bg-transparent"}`}
                >
                  All statuses
                </button>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setTaskStatus(status);
                      clearSelectedTask();
                    }}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium ${STATUS_STYLES[status].border} ${taskStatus === status ? STATUS_STYLES[status].selected : "bg-transparent"} ${STATUS_STYLES[status].hover}`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTaskPriority("all");
                    clearSelectedTask();
                  }}
                  className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskPriority === "all" ? "bg-foreground/15" : "bg-transparent"}`}
                >
                  All priorities
                </button>
                {(["low", "medium", "high"] as Task["priority"][]).map(
                  (priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => {
                        setTaskPriority(priority);
                        clearSelectedTask();
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-medium capitalize ${taskPriority === priority ? PRIORITY_STYLES[priority].selected : "bg-transparent"} ${PRIORITY_STYLES[priority].hover}`}
                      style={{ borderColor: PRIORITY_STYLES[priority].outline }}
                    >
                      {priority}
                    </button>
                  ),
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTaskAssignee("all");
                    clearSelectedTask();
                  }}
                  className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskAssignee === "all" ? "bg-foreground/15" : "bg-transparent"}`}
                >
                  All assignees
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaskAssignee("unassigned");
                    clearSelectedTask();
                  }}
                  className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskAssignee === "unassigned" ? "bg-foreground/15" : "bg-transparent"}`}
                >
                  Unassigned
                </button>
                {users
                  .filter((user) =>
                    tasks.some((task) => task.assignedTo === user.id),
                  )
                  .map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setTaskAssignee(user.id);
                        clearSelectedTask();
                      }}
                      className={`rounded-full border-2 border-foreground/30 px-4 py-2 text-sm font-medium ${taskAssignee === user.id ? "bg-foreground/15" : "bg-transparent"}`}
                    >
                      {user.username}
                    </button>
                  ))}
              </div>
            </div>
            <div
              className="task-list-scrollbar min-w-0 space-y-3 md:sticky md:top-6 md:max-h-[calc(100vh-12rem)] md:pl-2"
              style={{ direction: "rtl" }}
            >
              <div className="space-y-3" style={{ direction: "ltr" }}>
                {filteredTasks.length === 0 ? (
                  <p className="text-foreground/60">No tasks yet.</p>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      assigneeName={getUsername(task.assignedTo)}
                      projectId={projectId}
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
                assigneeName={
                  selectedTask ? getUsername(selectedTask.assignedTo) : ""
                }
                canManage={ownerView}
                canUpdateStatus={
                  ownerView ||
                  (!!currentUserId &&
                    selectedTask?.assignedTo === currentUserId)
                }
                onStatusChange={(status) =>
                  selectedTask && handleStatusChange(selectedTask.id, status)
                }
                onDelete={() => selectedTask && handleDelete(selectedTask.id)}
                onEdit={() => {
                  if (!selectedTask) return;
                  setEditingTaskId(selectedTask.id);
                  setShowTaskModal(true);
                }}
              />
            )}
          </div>

          {showTaskModal && (
            <TaskModal
              projectId={projectId}
              taskId={editingTaskId}
              onClose={() => setShowTaskModal(false)}
              onSaved={() => {
                setShowTaskModal(false);
                setEditingTaskId(null);
                refresh();
              }}
            />
          )}

          {showProjectModal && (
            <ProjectModal
              projectId={projectId}
              onClose={() => setShowProjectModal(false)}
              onSaved={() => {
                const project = getProjectById(projectId);
                setProjectTitle(project?.title ?? "Project");
                setProjectDescription(project?.description ?? "");
                setShowProjectModal(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
