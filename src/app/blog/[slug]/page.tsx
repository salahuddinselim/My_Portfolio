"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { BlogPost, BLOG_TOPICS } from "@/types";

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async (slug: string) => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (data) {
      setBlog(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (params.slug) {
      fetchBlog(params.slug as string);
    }
  }, [params.slug, fetchBlog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  const getTopicColor = (topic: string) => {
    const found = BLOG_TOPICS.find(t => t.value === topic);
    return found?.color || "#22d3ee";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
      
      <nav className="relative z-10 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </nav>

      <main className="relative z-10 py-12">
        <article className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-sm font-medium text-background"
                style={{ backgroundColor: getTopicColor(blog.topic) }}
              >
                {BLOG_TOPICS.find(t => t.value === blog.topic)?.label || blog.topic}
              </span>
              <span className="text-sm text-text-muted">
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-foreground">{blog.title}</h1>

            {blog.cover_image && (
              <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none text-text-secondary">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </article>
      </main>
    </div>
  );
}