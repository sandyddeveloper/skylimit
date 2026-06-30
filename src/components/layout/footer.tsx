"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Mail, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom SVG Social Icons because brand icons are omitted in this Lucide release
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-border/40 bg-background/50 dark:bg-[#06070a]/50 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 border-b border-border/40">
          
          {/* Column 1: Brand details & Availability status */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="group flex items-center gap-2 font-bold tracking-tight select-none self-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-mono text-sm font-bold">SR</span>
              </div>
              <span className="text-foreground text-sm font-semibold tracking-tight transition-colors duration-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                Santhosh Raj K
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              A production-grade developer portfolio and live analytics dashboard showing GitHub contributions, repositories, and language statistics.
            </p>

            {/* Status Pulse */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium w-fit mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for new freelance & contract roles</span>
            </div>
          </div>

          {/* Column 2: Quick Links (Sitemap) */}
          <div className="md:col-span-3 flex flex-col gap-3 md:col-start-7">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 font-mono">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-150"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Social connects */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 font-mono">
              Connect With Me
            </h4>
            <p className="text-xs text-muted-foreground mb-1">
              Let's build something awesome together! Feel free to reach out.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/30 transition-all duration-300 shadow-sm"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4.5 w-4.5" />
              </Link>
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/30 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4.5 w-4.5" />
              </Link>
              {siteConfig.links.twitter && (
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/30 transition-all duration-300 shadow-sm"
                  aria-label="Twitter / X"
                >
                  <TwitterIcon className="h-4.5 w-4.5" />
                </Link>
              )}
              <Link
                href={`mailto:${siteConfig.links.email}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/30 transition-all duration-300 shadow-sm"
                aria-label="Email"
              >
                <Mail className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
          
        </div>

        {/* Bottom sub-footer row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-muted-foreground/60 font-mono">
              Built with Next.js • Tailwind CSS • TypeScript
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer select-none border border-border/40 px-3 py-1.5 rounded-full hover:bg-muted/20"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
