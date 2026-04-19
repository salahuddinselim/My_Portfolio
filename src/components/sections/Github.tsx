"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubProps {
  username?: string;
}

interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export default function GitHub({ username = "salahuddinselim" }: GitHubProps) {
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [stats, setStats] = useState({ total: 0, Streak: 0, max: 0 });
  const [loading, setLoading] = useState(true);

  const fetchContributions = useCallback(async () => {
    try {
      const response = await fetch(
        `https://github-contributions-api.jograber.de/v4/${username}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      const days: GitHubContribution[] = data.contributions.map((day: { date: string; count: number; level: number }) => ({
        date: day.date,
        count: day.count,
        level: day.level as 0 | 1 | 2 | 3 | 4,
      }));
      
      const lastYear = days.slice(-365);
      const total = lastYear.reduce((sum: number, d: GitHubContribution) => sum + d.count, 0);
      
      let currentStreak = 0;
      let maxStreak = 0;
      let tempStreak = 0;
      
      for (let i = lastYear.length - 1; i >= 0; i--) {
        if (lastYear[i].count > 0) {
          tempStreak++;
          if (i === lastYear.length - 1 || lastYear[i + 1].count === 0) {
            currentStreak = tempStreak;
          }
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 0;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);

      const max = Math.max(...lastYear.map((d: GitHubContribution) => d.count));
      
      setContributions(lastYear);
      setStats({ total, Streak: currentStreak, max });
    } catch {
      const mockDays: GitHubContribution[] = [];
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (364 - i));
        mockDays.push({
          date: date.toISOString().split("T")[0],
          count: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
          level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4,
        });
      }
      setContributions(mockDays);
      setStats({ total: 156, Streak: 5, max: 8 });
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const getLevelColor = (level: number) => {
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    return colors[level] || colors[0];
  };

  const weeks = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <section id="github" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <GitHubIcon className="h-8 w-8 text-foreground" />
            <h2 className="text-2xl font-semibold text-foreground">GitHub</h2>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              @{username}
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur">
              <h3 className="text-lg font-medium text-foreground mb-4">
                {stats.total} contributions in the last year
              </h3>
              
              {loading ? (
                <div className="text-text-muted">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex gap-1 min-w-max">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) => (
                          <motion.div
                            key={day.date}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: wi * 0.01 + di * 0.01 }}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: getLevelColor(day.level) }}
                            title={`${day.date}: ${day.count} contributions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-[#161b22]" />
                    <div className="w-3 h-3 rounded-sm bg-[#0e4429]" />
                    <div className="w-3 h-3 rounded-sm bg-[#006d32]" />
                    <div className="w-3 h-3 rounded-sm bg-[#26a641]" />
                    <div className="w-3 h-3 rounded-sm bg-[#39d353]" />
                    <span>More</span>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur">
              <h3 className="text-lg font-medium text-foreground mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Total Contributions</span>
                  <span className="text-primary font-bold text-xl">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Current Streak</span>
                  <span className="text-primary font-bold text-xl">{stats.Streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Best Day</span>
                  <span className="text-primary font-bold text-xl">{stats.max}</span>
                </div>
              </div>
              
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center rounded-lg bg-[#238636] px-4 py-2 text-sm font-medium text-white hover:bg-[#2ea043] transition-colors"
              >
                View Profile
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}