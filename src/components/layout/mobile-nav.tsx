"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Toggle Menu"
      >
        <div className="space-y-1.5">
          <span className="block h-0.5 w-6 bg-current"></span>
          <span className="block h-0.5 w-6 bg-current"></span>
          <span className="block h-0.5 w-6 bg-current"></span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background p-6 flex flex-col justify-start">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-2"
            aria-label="Close Menu"
          >
            Close
          </button>
          <nav className="mt-8 flex flex-col gap-4">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
