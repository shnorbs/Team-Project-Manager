import { Project } from "@/types/projects.types";
import { toast } from "sonner";
import {
  addToStorageArray,
  readStorageArray,
  removeStorageItem,
  updateStorageItem,
} from "@/lib/storage";

export function getProjects(): Project[] {
  return readStorageArray<Project>("projects");
}

export function getProjectById(projectId: string): Project | null {
  const projects = getProjects();
  const project = projects.find((p) => p.id === projectId);
  return project || null;
}

export function isOwner(projectId: string, userId: string): boolean {
  const project = getProjectById(projectId);
  return project?.ownerId === userId;
}

export function getProjectMembers(projectId: string): string[] {
  const project = getProjectById(projectId);
  return project?.members || [];
}

export function addProject(project: Omit<Project, "id">): void {
  const projectWithId: Project = { id: crypto.randomUUID(), ...project };
  if (addToStorageArray("projects", projectWithId)) {
    toast.success("Project created");
  } else {
    toast.error("Unable to save project");
  }
}

export function updateProject(updatedProject: Project): void {
  if (updateStorageItem("projects", updatedProject)) {
    toast.success("Project updated");
  } else {
    toast.error("Unable to save project");
  }
}

export function deleteProject(projectId: string): void {
  const result = removeStorageItem("projects", projectId);
  if (result === "saved") {
    toast.success("Project deleted");
  } else if (result === "failed") {
    toast.error("Unable to delete project");
  }
}
