"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 md:py-20 bg-transparent">
      {/* Centered clean layout overlaying clouds with radial contrast glow */}
      <div className="relative z-10 text-center max-w-3xl px-6 py-12 flex flex-col items-center rounded-3xl hero-glow">
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-slate-900 dark:text-white">
          <span className="block mb-1.5 font-sans">
            Building Production-Grade
          </span>
          <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-normal pb-1">
            Web Applications
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
          I'm <span className="text-indigo-600 dark:text-indigo-400 font-bold">Santhosh Raj K</span>. A Full Stack Developer dedicated to crafting robust, high-performance web systems with Next.js, Tailwind CSS, and TypeScript.
        </p>

        {/* Interactive CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300 group active:scale-95 cursor-pointer"
          >
            <span>Explore Projects</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 hover:bg-white/80 dark:hover:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>Get in Touch</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
