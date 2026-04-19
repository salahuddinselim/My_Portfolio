"use client";

import { motion } from "framer-motion";
import { ExternalLinkIcon } from "@/components/ui/Icons";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_link: string;
  live_link: string;
  image: string;
  category: string;
  featured: boolean;
}

interface ProjectsProps {
  projects?: Project[];
}

const defaultProjects = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A modern web application built with Next.js, featuring real-time collaboration and a sleek user interface.",
    tech_stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    github_link: "#",
    live_link: "#",
    image: "",
    category: "Web",
    featured: true,
  },
  {
    id: "2",
    title: "Project Beta",
    description: "Real-time collaboration platform with live editing, chat functionality, and user presence.",
    tech_stack: ["Node.js", "WebSocket", "PostgreSQL", "Redis"],
    github_link: "#",
    live_link: "#",
    image: "",
    category: "Real-time",
    featured: true,
  },
  {
    id: "3",
    title: "Project Gamma",
    description: "E-commerce platform with advanced filtering, search, and seamless checkout experience.",
    tech_stack: ["React", "Node.js", "MongoDB", "Stripe"],
    github_link: "#",
    live_link: "#",
    image: "",
    category: "E-commerce",
    featured: false,
  },
];

export default function Projects({ projects = [] }: ProjectsProps) {
  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  return (
    <section id="projects" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-8 text-2xl font-semibold text-foreground">Projects</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 backdrop-blur transition-all hover:border-primary/30"
              >
                <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-3xl text-primary/30">{project.title[0]}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-text-secondary">
                    {project.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(project.tech_stack || []).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-background/50 px-2 py-1 text-xs text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.github_link}
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      Code
                    </a>
                    <a
                      href={project.live_link}
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Live
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}