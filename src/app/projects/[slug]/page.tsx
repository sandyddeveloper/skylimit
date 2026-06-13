import { SectionContainer } from "@/components/layout/section-container";
import { projectsData } from "@/constants/projects-data";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <SectionContainer>
      <Link href="/projects" className="text-sm font-medium hover:underline">
        &larr; Back to projects
      </Link>
      <h1 className="mt-4 text-4xl font-bold">{project.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        {project.longDescription || project.description}
      </p>
      <div className="mt-8 flex gap-4">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline text-primary"
          >
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline text-primary"
          >
            GitHub Repo
          </a>
        )}
      </div>
    </SectionContainer>
  );
}
