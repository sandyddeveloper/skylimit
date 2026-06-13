import { SectionContainer } from "@/components/layout/section-container";
import Link from "next/link";

export default function BlogPage() {
  return (
    <SectionContainer>
      <h1 className="text-4xl font-bold">Blog Posts</h1>
      <p className="mt-2 text-muted-foreground">
        Articles and notes on programming, tools, and technical learnings.
      </p>
      <div className="mt-8 space-y-6">
        <div className="rounded-lg border p-6 hover:shadow-sm transition-shadow">
          <h2 className="text-xl font-semibold">Example Blog Post</h2>
          <span className="text-sm text-muted-foreground">June 12, 2026</span>
          <p className="mt-2 text-muted-foreground text-sm">
            This is a preview snippet representing how blog items will display list layouts.
          </p>
          <Link
            href="/blog/example-post"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Read Article &rarr;
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
