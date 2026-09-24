import { Project } from "@/types/projects.types";
import { toast } from "sonner";
import { readStorageArray, writeStorage } from "@/lib/storage";

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
  const projects = getProjects();
  const projectWithId: Project = { id: crypto.randomUUID(), ...project };
  projects.push(projectWithId);
  if (writeStorage("projects", projects)) {
    toast.success("Project created");
  } else {
    toast.error("Unable to save project");
  }
}

export function updateProject(updatedProject: Project): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    if (writeStorage("projects", projects)) {
      toast.success("Project updated");
    } else {
      toast.error("Unable to save project");
    }
  }
}

export function deleteProject(projectId: string): void {
  const projects = getProjects();
  const updatedProjects = projects.filter((p) => p.id !== projectId);
  if (updatedProjects.length !== projects.length) {
    if (writeStorage("projects", updatedProjects)) {
      toast.success("Project deleted");
    } else {
      toast.error("Unable to delete project");
    }
  }
}
