"use client";

import { motion } from "framer-motion";

interface ModeToggleProps {
  mode: "terminal" | "website";
  onToggle: () => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2.5 text-sm font-medium backdrop-blur-xl shadow-lg transition-all hover:border-primary/50 hover:bg-surface"
    >
      <span className={`h-2 w-2 rounded-full ${mode === "terminal" ? "bg-primary" : "bg-accent"}`} />
      <span className="text-text-secondary">
        {mode === "terminal" ? "Switch to Website" : "Switch to Terminal"}
      </span>
    </motion.button>
  );
}