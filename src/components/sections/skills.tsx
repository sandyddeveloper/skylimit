"use client";

import { SectionContainer } from "../layout/section-container";
import { Layers, Waves, Compass, Anchor } from "lucide-react";

interface SkillItem {
  name: string;
}

interface SkillZone {
  zoneName: string;
  depthRange: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

export function Skills() {
  const zones: SkillZone[] = [
    {
      zoneName: "Epipelagic Zone",
      depthRange: "0m - 200m (Surface)",
      title: "Frontend Stack",
      description: "Crafting modern, intuitive user interfaces floating on client-side state.",
      icon: <Layers className="h-5 w-5" />,
      skills: [
        { name: "React" },
        { name: "Next.js" },
        { name: "TypeScript" },
        { name: "Tailwind CSS" },
        { name: "Redux Toolkit" },
        { name: "HTML5 & CSS3" },
      ],
    },
    {
      zoneName: "Mesopelagic Zone",
      depthRange: "200m - 1000m (Twilight)",
      title: "Backend API Layer",
      description: "Architecting request streams and server flows that connect frontend to databases.",
      icon: <Waves className="h-5 w-5" />,
      skills: [
        { name: "Python" },
        { name: "FastAPI" },
        { name: "Django" },
        { name: "REST & GraphQL" },
        { name: "Node.js" },
        { name: "Express" },
      ],
    },
    {
      zoneName: "Bathypelagic Zone",
      depthRange: "1000m - 4000m (Midnight)",
      title: "Data & Caching",
      description: "Managing persistent storage, migrations, and high-performance queries.",
      icon: <Compass className="h-5 w-5" />,
      skills: [
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "Redis" },
        { name: "MongoDB" },
        { name: "SQLAlchemy" },
        { name: "Data Modeling" },
      ],
    },
    {
      zoneName: "Benthic Zone",
      depthRange: "Deep Floor (Foundation)",
      title: "DevOps & Tools",
      description: "Anchoring software delivery with containers, pipelines, and cloud hosting.",
      icon: <Anchor className="h-5 w-5" />,
      skills: [
        { name: "Docker" },
        { name: "Git & GitHub" },
        { name: "CI/CD Pipelines" },
        { name: "AWS Cloud" },
        { name: "Vercel" },
        { name: "Linux Systems" },
      ],
    },
  ];

  return (
    <SectionContainer id="skills" className="relative overflow-hidden py-20">
      
      {/* Ocean Theme Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-sky-50/10 via-cyan-50/5 to-transparent dark:from-cyan-950/5 dark:via-blue-900/5 dark:to-transparent" />

      {/* Floating Ocean Bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="ocean-bubble" style={{ left: "10%", width: "12px", height: "12px", animationDelay: "0s", animationDuration: "8s" }} />
        <div className="ocean-bubble" style={{ left: "28%", width: "18px", height: "18px", animationDelay: "2s", animationDuration: "12s" }} />
        <div className="ocean-bubble" style={{ left: "45%", width: "8px", height: "8px", animationDelay: "1s", animationDuration: "7s" }} />
        <div className="ocean-bubble" style={{ left: "62%", width: "15px", height: "15px", animationDelay: "4s", animationDuration: "10s" }} />
        <div className="ocean-bubble" style={{ left: "78%", width: "22px", height: "22px", animationDelay: "3s", animationDuration: "14s" }} />
        <div className="ocean-bubble" style={{ left: "92%", width: "10px", height: "10px", animationDelay: "5.5s", animationDuration: "9s" }} />
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col gap-3 text-center items-center">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Skills & Tech Stack
            </h2>
            <div className="h-1 w-24 bg-cyan-500 rounded-full"></div>
          </div>
          <p className="text-cyan-700 dark:text-cyan-400 font-medium italic text-sm sm:text-base max-w-lg leading-relaxed">
            Navigating through the depths of modern software architecture
          </p>
        </div>

        {/* Ocean Depth Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.zoneName}
              className="flex flex-col rounded-3xl border border-cyan-500/10 dark:border-cyan-500/5 bg-cyan-500/5 dark:bg-cyan-950/15 p-6 shadow-md hover:shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/25 group"
            >
              {/* Zone metadata */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="font-mono text-2xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    {zone.zoneName}
                  </span>
                  <span className="text-3xs text-slate-500 dark:text-slate-400 font-medium">
                    {zone.depthRange}
                  </span>
                </div>
                
                {/* Icon wrapper */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/15 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                  {zone.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {zone.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                {zone.description}
              </p>

              {/* Tech Badges List */}
              <div className="flex flex-wrap gap-2">
                {zone.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/10 dark:border-cyan-500/5 text-cyan-800 dark:text-cyan-300 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/30 hover:border-cyan-500/20 transition-colors"
                  >
                    {/* Tiny pulsing water bubble dot */}
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-sm animate-pulse" />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
