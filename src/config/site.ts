import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Santhosh Raj K Portfolio",
  title: "Santhosh Raj K | Full Stack Developer",
  description: "A production-grade developer portfolio and analytics dashboard showing live GitHub metrics, built with Next.js, Tailwind CSS, and TypeScript.",
  url: "https://github.com/sandyddeveloper",
  ogImage: "https://github.com/sandyddeveloper.png",
  links: {
    github: "https://github.com/sandyddeveloper",
    linkedin: "https://linkedin.com/in/sandyddeveloper",
    email: "santhosh.raj.k@example.com",
    twitter: "https://twitter.com/sandyddeveloper",
  },
  navItems: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Projects", href: "/projects" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
};
