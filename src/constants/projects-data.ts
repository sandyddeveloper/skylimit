import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "project-1",
    title: "Example Project One",
    description: "A short snippet description of the first project.",
    longDescription: "A detailed description of the project architecture, features, and key challenges solved during development.",
    image: "/assets/images/projects/project1.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/project-1",
    featured: true,
    date: "2026-01-01",
  },
  {
    id: "project-2",
    title: "Example Project Two",
    description: "A short snippet description of the second project.",
    longDescription: "Detailed description outlining technology stack and engineering decisions.",
    image: "/assets/images/projects/project2.jpg",
    tags: ["React", "Node.js", "PostgreSQL"],
    demoUrl: "https://demo2.example.com",
    githubUrl: "https://github.com/example/project-2",
    featured: false,
    date: "2025-11-15",
  },
];
