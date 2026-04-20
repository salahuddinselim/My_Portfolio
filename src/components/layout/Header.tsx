"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TERMINAL, CodeIcon } from "@/components/ui/Icons";

interface HeaderProps {
  onToggleTerminal?: () => void;
}

export default function Header({ onToggleTerminal }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <TERMINAL className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">
              DevPort
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#about"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              Skills
            </a>
            <a
              href="#github"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              GitHub
            </a>
            <a
              href="#projects"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              Projects
            </a>
            <Link
              href="/blog"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              Blog
            </Link>
            <a
              href="#photos"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              Photos
            </a>
            <a
              href="#contact"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              Contact
            </a>
            <button
              onClick={onToggleTerminal}
              className="flex items-center gap-2 rounded-lg bg-primary/20 px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/30 active:scale-95 shadow-sm"
            >
              <CodeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Toggle Terminal</span>
              <span className="sm:hidden">Toggle</span>
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}