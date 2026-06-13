import { SectionContainer } from "@/components/layout/section-container";
import { projectsData } from "@/constants/projects-data";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <SectionContainer>
      <h1 className="text-4xl font-bold">My Projects</h1>
      <p className="mt-2 text-muted-foreground">
        A list of engineering projects and open-source contributions.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project) => (
          <div key={project.id} className="rounded-lg border p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="mt-2 text-muted-foreground text-sm">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              View Details &rarr;
            </Link>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
