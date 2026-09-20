import Link from "next/link";

type ProjectCardProps = {
  title: string;
  description: string;
  slug: string;
};

function ProjectCard({ title, description, slug }: ProjectCardProps) {
  return (
    <>
      <Link
        href={`/${slug}`}
        className="bg-background border-2 border-foreground/50 rounded-lg p-4 w-120"
      >
        <h3 className="truncate text-lg font-bold">{title}</h3>
        <p className="truncate text-sm">{description}</p>
      </Link>
    </>
  );
}

export default ProjectCard;
