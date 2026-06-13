import { BlogPost, Project } from "@/types";

// Skeleton functions for parsing local markdown files for blog posts and projects.
// In a full implementation, you could use gray-matter, next-mdx-remote, or contentlayer here.

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return null;
}

export async function getProjects(): Promise<Project[]> {
  return [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return null;
}
