"use client";

import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative rounded-full p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent hover:border-border/40 transition-all duration-300 shadow-sm cursor-pointer"
      aria-label="Toggle Theme"
    >
      <div className="relative h-5 w-5">
        <Sun className="h-5 w-5 transition-transform duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 absolute inset-0 text-amber-500" />
        <Moon className="h-5 w-5 transition-transform duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute inset-0 text-indigo-400" />
      </div>
    </button>
  );
}

