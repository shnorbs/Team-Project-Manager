import Link from "next/link";

type ProjectCardProps = {
  title: string;
  description?: string;
};

export default function ProjectCard({ title, description }: ProjectCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
