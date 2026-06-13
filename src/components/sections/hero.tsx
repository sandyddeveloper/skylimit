"use client";

import { SectionContainer } from "../layout/section-container";

export function Hero() {
  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden bg-transparent">
      <div className="relative z-10 text-center max-w-3xl px-4 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-foreground drop-shadow-sm">
          Hero Section
        </h1>
        <p className="mx-auto mt-6 max-w-[600px] text-lg text-slate-300 font-medium drop-shadow">
          Welcome to your new portfolio hero area. Introduce yourself and describe what you do here.
        </p>
      </div>
    </div>
  );
}
