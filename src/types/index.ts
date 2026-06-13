export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate: string; // "Present" or date
  description: string[];
  current: boolean;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'languages' | 'other';
  level?: number; // 1-100 or 1-5 scale if desired
  icon?: string; // name of lucide icon
}

export interface NavItem {
  title: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter?: string;
    linkedin: string;
    email: string;
  };
  navItems: NavItem[];
}
