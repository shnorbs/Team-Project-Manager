"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/projects.types";
import { isOwner } from "@/lib/projects";
import { getCurrentUser } from "@/lib/auth";
import { PROJECT_CARD_STYLE } from "@/lib/project-card-styles";

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
  selected?: boolean;
}

export default function ProjectCard({
  project,
  onSelect,
  selected = false,
}: ProjectCardProps) {
  const { id, title } = project;

  const [ownerView, setOwnerView] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setOwnerView(!!currentUser && isOwner(id, currentUser.id));
  }, [id]);

  const cardContent = (
    <>
      <h3 className="truncate text-lg font-bold">{title}</h3>
    </>
  );

  return (
    <div
      style={PROJECT_CARD_STYLE}
      className={`relative flex w-full max-w-2xl items-center justify-between rounded-lg p-4 shadow-md transition-all ${
        onSelect ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${selected ? "brightness-125" : ""}`}
      onClick={() => onSelect?.(project)}
      onKeyDown={(event) => {
        if (onSelect && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect(project);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="min-w-0 flex-1 pr-4 text-black">
        {onSelect ? cardContent : <Link href={`/${id}`}>{cardContent}</Link>}
      </div>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          ownerView ? "bg-red-600 text-white" : "bg-black text-white"
        }`}
      >
        {ownerView ? "Owner" : "Member"}
      </span>
    </div>
  );
}
