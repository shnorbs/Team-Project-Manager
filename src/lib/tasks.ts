import { Task } from "@/types/tasks.types";
import { toast } from "sonner";
import {
  addToStorageArray,
  readStorageArray,
  removeStorageItem,
  updateStorageItem,
} from "@/lib/storage";

export function getTasks(): Task[] {
  return readStorageArray<Task>("tasks");
}

export function getTaskById(taskId: string): Task | null {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  return task || null;
}

export function getTasksByProjectId(projectId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.projectId === projectId);
}

export function getTasksByUserId(userId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.assignedTo === userId);
}

export function addTask(task: Omit<Task, "id">): void {
  const taskWithId: Task = { id: crypto.randomUUID(), ...task };
  if (addToStorageArray("tasks", taskWithId)) {
    toast.success("Task created");
  } else {
    toast.error("Unable to save task");
  }
}

export function updateTask(updatedTask: Task): void {
  if (updateStorageItem("tasks", updatedTask)) {
    toast.success("Task updated");
  } else {
    toast.error("Unable to save task");
  }
}

export function deleteTask(taskId: string): void {
  const result = removeStorageItem("tasks", taskId);
  if (result === "saved") {
    toast.success("Task deleted");
  } else if (result === "failed") {
    toast.error("Unable to delete task");
  }
}
