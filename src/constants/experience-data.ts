import { Experience } from "@/types";

export const experienceData: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    companyUrl: "https://example.com/tech-solutions",
    location: "San Francisco, CA",
    startDate: "2024-06",
    endDate: "Present",
    description: [
      "Led frontend architecture migrations to Next.js App Router.",
      "Optimized rendering pipelines, resulting in a 40% improvement in LCP.",
      "Mentored junior engineers and conducted strict code reviews."
    ],
    current: true,
  },
  {
    id: "exp-2",
    role: "Software Engineer",
    company: "Web Development Corp",
    companyUrl: "https://example.com/webdev",
    location: "Remote",
    startDate: "2022-01",
    endDate: "2024-05",
    description: [
      "Built interactive web applications using React and Tailwind CSS.",
      "Integrated REST and GraphQL APIs into production interfaces.",
      "Implemented unit and integration tests with Jest and Testing Library."
    ],
    current: false,
  },
];
