import { SectionContainer } from "../layout/section-container";
import { projectsData } from "@/constants/projects-data";

export function FeaturedProjects() {
  const featured = projectsData.filter((p) => p.featured);
  return (
    <SectionContainer id="projects">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Projects</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <div key={project.id} className="rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-xl">{project.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{project.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
