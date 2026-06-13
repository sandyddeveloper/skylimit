import { SectionContainer } from "@/components/layout/section-container";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <SectionContainer>
      <Link href="/blog" className="text-sm font-medium hover:underline">
        &larr; Back to blog
      </Link>
      <h1 className="mt-4 text-4xl font-bold">Blog Post: {slug}</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        This is the body content skeleton of the article with slug: "{slug}". Integrate MDX or a headless CMS helper to render rich content here.
      </p>
    </SectionContainer>
  );
}
