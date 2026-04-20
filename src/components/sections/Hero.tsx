"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon } from "@/components/ui/Icons";

interface Profile {
  name?: string;
  role?: string;
  bio?: string;
  vision?: string;
  profile_image?: string;
}

interface HeroProps {
  onOpenTerminal?: () => void;
  onViewProjects?: () => void;
  profile?: Profile;
}

export default function Hero({ onOpenTerminal, onViewProjects, profile }: HeroProps) {
  const handleViewProjects = () => {
    if (onViewProjects) {
      onViewProjects();
    } else {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_60%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {profile?.profile_image ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              src={profile.profile_image}
              alt={profile.name || "Profile"}
              className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-primary/30 shadow-lg shadow-primary/20"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/30 bg-surface shadow-lg shadow-primary/20"
            >
              <span className="text-4xl font-bold text-primary">
                {(profile?.name || "A").charAt(0).toUpperCase()}
              </span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-text-secondary backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m <span className="text-primary">{profile?.name || "Alex"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-lg text-text-secondary sm:text-xl"
        >
          {profile?.vision || profile?.role || "Software Engineer building elegant, user-centric digital experiences"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={handleViewProjects}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-background transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
          >
            View Projects
            <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={onOpenTerminal}
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-all hover:border-primary/50 hover:bg-surface"
          >
            <span className="font-mono text-primary">&gt;</span>
            Open Terminal
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDownIcon className="h-5 w-5 text-text-muted animate-bounce" />
      </motion.div>
    </section>
  );
}