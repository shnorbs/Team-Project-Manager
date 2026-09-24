import { Task } from "@/types/tasks.types";
import { toast } from "sonner";
import { readStorageArray, writeStorage } from "@/lib/storage";

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
  const tasks = getTasks();
  const taskWithId: Task = { id: crypto.randomUUID(), ...task };
  tasks.push(taskWithId);
  if (writeStorage("tasks", tasks)) {
    toast.success("Task created");
  } else {
    toast.error("Unable to save task");
  }
}

export function updateTask(updatedTask: Task): void {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    if (writeStorage("tasks", tasks)) {
      toast.success("Task updated");
    } else {
      toast.error("Unable to save task");
    }
  }
}

export function deleteTask(taskId: string): void {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((t) => t.id !== taskId);
  if (updatedTasks.length !== tasks.length) {
    if (writeStorage("tasks", updatedTasks)) {
      toast.success("Task deleted");
    } else {
      toast.error("Unable to delete task");
    }
  }
}
