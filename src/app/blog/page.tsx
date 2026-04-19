"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { BlogPost, BLOG_TOPICS, BlogTopic } from "@/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic | "all">("all");

  const fetchBlogs = useCallback(async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = selectedTopic === "all" 
    ? blogs 
    : blogs.filter(blog => blog.topic === selectedTopic);

  const getTopicColor = (topic: string) => {
    const found = BLOG_TOPICS.find(t => t.value === topic);
    return found?.color || "#22d3ee";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
      
      <header className="relative z-10 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-foreground">Blog</h1>
            <p className="text-text-secondary">Thoughts, tutorials, and insights</p>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            <button
              onClick={() => setSelectedTopic("all")}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                selectedTopic === "all"
                  ? "bg-primary text-background"
                  : "bg-surface text-text-secondary hover:text-foreground"
              }`}
            >
              All Posts
            </button>
            {BLOG_TOPICS.map((topic) => (
              <button
                key={topic.value}
                onClick={() => setSelectedTopic(topic.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedTopic === topic.value
                    ? "text-background"
                    : "bg-surface text-text-secondary hover:text-foreground"
                }`}
                style={selectedTopic === topic.value ? { backgroundColor: topic.color } : {}}
              >
                {topic.label}
              </button>
            ))}
          </motion.div>

          {filteredBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface/50 backdrop-blur transition-all hover:border-primary/30"
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-accent/10">
                      {blog.cover_image ? (
                        <Image
                          src={blog.cover_image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-mono text-4xl text-primary/30">
                            {blog.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-background"
                        style={{ backgroundColor: getTopicColor(blog.topic) }}
                      >
                        {BLOG_TOPICS.find(t => t.value === blog.topic)?.label || blog.topic}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {blog.title}
                      </h2>
                      <p className="mb-4 text-sm text-text-secondary line-clamp-2">
                        {blog.excerpt || blog.content.slice(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-background/50 px-2 py-1 text-xs text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">No blog posts found for this topic.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}