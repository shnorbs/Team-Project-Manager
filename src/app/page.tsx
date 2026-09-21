"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Project } from "@/types/projects.types";
import { getProjects } from "@/lib/projects";
import { User } from "@/types/users.types";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push("/sign-in");
      return;
    }

    setUser(currentUser);

    const allProjects = getProjects();
    const userProjects = allProjects.filter((project) =>
      project.members.includes(currentUser.id),
    );
    setProjects(userProjects);
    setChecked(true);
  }, [router]);

  if (!checked) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex w-full justify-center pt-12">
        <div className="text-2xl font-bold">Welcome {user?.username}!</div>
      </div>

      <div className="flex items-center justify-center pt-12">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <div>
            <p className="text-foreground/60">
              You don&apos;t have any projects yet.
            </p>

            <Link href="/add-project" className="text-foreground underline">
              Add a project
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
