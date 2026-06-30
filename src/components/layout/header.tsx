"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 py-3 px-4 md:px-8">
      <div
        className={cn(
          "mx-auto max-w-7xl w-full flex items-center justify-between px-4 sm:px-6 rounded-2xl border transition-all duration-300 backdrop-blur-md",
          isScrolled
            ? "h-14 bg-background/80 dark:bg-[#0b0f19]/80 border-border/80 shadow-lg dark:shadow-black/35"
            : "h-16 bg-background/40 dark:bg-[#0b0f19]/30 border-border/20 shadow-sm"
        )}
      >
        <Link href="/" className="group flex items-center gap-2 font-bold tracking-tight select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="font-mono text-sm font-bold">SR</span>
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight transition-colors duration-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
            Santhosh Raj K
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent hover:border-border/40 transition-all duration-300 shadow-sm"
            >
              <GithubIcon className="h-4.5 w-4.5" />
              <span className="sr-only">GitHub</span>
            </Link>
            
            <ThemeToggle />
            
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1 justify-center px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group active:scale-95"
            >
              <span>Hire Me</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

