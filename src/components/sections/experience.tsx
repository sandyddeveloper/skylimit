import { SectionContainer } from "../layout/section-container";
import { experienceData } from "@/constants/experience-data";

export function Experience() {
  return (
    <SectionContainer id="experience">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Work Experience</h2>
      <div className="mt-6 space-y-8">
        {experienceData.map((exp) => (
          <div key={exp.id} className="border-l-2 pl-6 relative">
            <div className="absolute w-3 h-3 bg-foreground rounded-full -left-[7px] top-[6px]" />
            <h3 className="font-semibold text-lg">{exp.role}</h3>
            <span className="text-sm text-muted-foreground">
              {exp.company} | {exp.startDate} - {exp.endDate}
            </span>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              {exp.description.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
