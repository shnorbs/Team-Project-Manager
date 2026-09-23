import { Project } from "@/types/projects.types";

export function getProjects(): Project[] {
  const projects = localStorage.getItem("projects");
  if (!projects) {
    return [];
  }
  return JSON.parse(projects);
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

export function addProject(project: Omit<Project, "id">): void {
  const projects = getProjects();
  const projectWithId: Project = { id: crypto.randomUUID(), ...project };
  projects.push(projectWithId);
  localStorage.setItem("projects", JSON.stringify(projects));
}

export function updateProject(updatedProject: Project): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    localStorage.setItem("projects", JSON.stringify(projects));
  }
}

export function deleteProject(projectId: string): void {
  const projects = getProjects();
  const updatedProjects = projects.filter((p) => p.id !== projectId);
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
}

const projects = {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
};

export default projects;
