"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";

interface Stats {
  projects: number;
  blogs: number;
  skills: number;
  photos: number;
}

export default function DashboardPage() {
  const { user } = useAdmin();
  const [stats, setStats] = useState<Stats>({ projects: 0, blogs: 0, skills: 0, photos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsRes, blogsRes, skillsRes, photosRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("photos").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        blogs: blogsRes.count || 0,
        skills: skillsRes.count || 0,
        photos: photosRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Profile",
      description: "Manage your personal information",
      href: "/admin/profile",
      count: 1,
    },
    {
      title: "Skills",
      description: "Manage your technical skills",
      href: "/admin/skills",
      count: stats.skills || 0,
    },
    {
      title: "Projects",
      description: "Add, edit, or remove projects",
      href: "/admin/projects",
      count: stats.projects,
    },
    {
      title: "Blog Posts",
      description: "Create and manage blog posts",
      href: "/admin/blogs",
      count: stats.blogs,
    },
    {
      title: "Photos",
      description: "Manage your photo gallery",
      href: "/admin/photos",
      count: stats.photos || 0,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-cyan-400">{user?.email}</span>
          </p>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          View Site
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {cards.map((card, index) => (
          <Link key={card.title} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 p-6 shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.2)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {card.title}
                </h3>
                {!loading && (
                  <span className="rounded-full bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 text-sm text-cyan-400">
                    {card.count}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{card.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 w-full">
        <Link href="/" className="rounded-2xl bg-white/5 border border-cyan-400/20 p-6 text-center backdrop-blur-md transition-all hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]">
          <span className="text-cyan-400 font-medium">View Portfolio Site →</span>
        </Link>
        <Link href="/admin/blogs" className="rounded-2xl bg-white/5 border border-cyan-400/20 p-6 text-center backdrop-blur-md transition-all hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]">
          <span className="text-cyan-400 font-medium">Create New Blog Post →</span>
        </Link>
      </div>
    </motion.div>
  );
}