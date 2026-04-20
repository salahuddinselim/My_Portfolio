"use client";

import { motion } from "framer-motion";

interface Profile {
  name?: string;
  role?: string;
  bio?: string;
  vision?: string;
}

interface AboutProps {
  profile?: Profile;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="about" className="py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-8 text-2xl font-semibold text-foreground">About Me</h2>
          <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur sm:p-8">
            <p className="text-text-secondary leading-relaxed">
              {profile?.bio || "I'm a Software Engineer with a passion for building elegant, performant web applications. I specialize in modern JavaScript technologies and creating intuitive user experiences."}
            </p>
            <div className="pt-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary">React</span>
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary">Next.js</span>
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-primary">TypeScript</span>
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary">Node.js</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}