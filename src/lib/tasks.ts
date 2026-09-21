import { Task } from "@/types/tasks.types";

export function getTasks(): Task[] {
  const tasks = localStorage.getItem("tasks");
  if (!tasks) {
    return [];
  }
  return JSON.parse(tasks);
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

export function addTask(task: Omit<Task, "id">): void {
  const tasks = getTasks();
  const taskWithId: Task = { id: crypto.randomUUID(), ...task };
  tasks.push(taskWithId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function updateTask(updatedTask: Task): void {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

export function deleteTask(taskId: string): void {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((t) => t.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

const tasks = {
  getTasks,
  getTaskById,
  getTasksByProjectId,
  addTask,
  updateTask,
  deleteTask,
};

export default tasks;
