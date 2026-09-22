import Link from "next/link";
import { Project } from "@/types/projects.types";

export default function ProjectCard(project: Project) {
  const { id, title, description } = project;
  return (
    <>
      <Link
        href={`/${id}`}
        className="bg-background border-2 border-foreground/50 rounded-lg p-4 w-120"
      >
        <h3 className="truncate text-lg font-bold">{title}</h3>
        <p className="truncate text-sm">{description}</p>
      </Link>
    </>
  );
}
