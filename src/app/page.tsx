"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Project } from "@/types/projects.types";

const projects = [
  {
    id: 1,
    title: "CURT Task Manager",
    description: "I already regret this",
  },
  {
    id: 2,
    title: "Something",
    description: "yapyapyapyap",
  },
  {
    id: 3,
    title:
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    description: "aaaaaaaaaaaaaaaaaaaa",
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setChecked(true);

    if (!currentUser) {
      router.push("/sign-in");
    }
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
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </>
  );
}
