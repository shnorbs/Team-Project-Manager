import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    id: 1,
    title: "CURT Task Manager",
    description: "I already regret this",
    slug: "curt-task-manager",
  },
  {
    id: 2,
    title: "Something",
    description: "yapyapyapyap",
    slug: "something",
  },
  {
    id: 3,
    title:
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    description: "aaaaaaaaaaaaaaaaaaaa",
    slug: "something-else",
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full justify-center pt-12">
        <div className="text-2xl font-bold">Welcome Amr!</div>
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
