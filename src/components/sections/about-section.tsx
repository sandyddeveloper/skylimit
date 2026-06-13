import { SectionContainer } from "../layout/section-container";

export function AboutSection() {
  return (
    <SectionContainer id="about">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">About Me</h2>
      <p className="mt-4 text-muted-foreground">
        This is a placeholder for your biography. You can describe your journey, passion, and engineering philosophies.
      </p>
    </SectionContainer>
  );
}
