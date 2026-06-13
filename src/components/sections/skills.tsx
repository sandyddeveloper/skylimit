import { SectionContainer } from "../layout/section-container";

export function Skills() {
  return (
    <SectionContainer id="skills">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Skills & Tech Stack</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <div className="rounded-md border p-4 hover:bg-accent transition-colors">TypeScript</div>
        <div className="rounded-md border p-4 hover:bg-accent transition-colors">React</div>
        <div className="rounded-md border p-4 hover:bg-accent transition-colors">Next.js</div>
        <div className="rounded-md border p-4 hover:bg-accent transition-colors">Tailwind CSS</div>
      </div>
    </SectionContainer>
  );
}
