"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { CodeIcon, ZapIcon } from "@/components/ui/Icons";

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <CodeIcon className="h-5 w-5" />,
  Backend: <ZapIcon className="h-5 w-5" />,
  Tools: <CodeIcon className="h-5 w-5" />,
  Other: <CodeIcon className="h-5 w-5" />,
};

export default function Skills() {
  const [skills, setSkills] = useState<{ name: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    const { data } = await supabase
      .from("skills")
      .select("name, category")
      .order("category", { ascending: true });
    
    if (data) {
      setSkills(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const categories = ["Frontend", "Backend", "Tools", "Other"];
  
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat).map(s => s.name);
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <section id="skills" className="py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center text-text-secondary">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-8 text-2xl font-semibold text-foreground">Skills</h2>
          
          {skills.length === 0 ? (
            <div className="text-center text-text-secondary py-8">
              No skills added yet. Add some in the admin panel.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                groupedSkills[category].length > 0 && (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur transition-all hover:border-primary/30 hover:bg-surface"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        {categoryIcons[category] || categoryIcons["Other"]}
                      </div>
                      <h3 className="text-lg font-medium text-foreground">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groupedSkills[category].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-background/50 px-3 py-1.5 text-sm text-text-secondary transition-colors hover:text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}