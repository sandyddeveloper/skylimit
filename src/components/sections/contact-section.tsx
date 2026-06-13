"use client";

import { SectionContainer } from "../layout/section-container";

export function ContactSection() {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <SectionContainer id="contact" className="relative z-20">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-slate-300 text-lg">
            Have a question or want to work together? Let's connect!
          </p>
        </div>
      </SectionContainer>
    </div>
  );
}
