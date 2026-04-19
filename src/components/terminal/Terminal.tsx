"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRightIcon, TERMINAL } from "@/components/ui/Icons";
import { downloadPDF } from "@/lib/resume";
import { Profile as ProfileType, Education, Experience } from "@/types";

type Profile = ProfileType;

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

interface TerminalProps {
  onExitTerminal?: () => void;
  profile?: Profile;
  projects?: Project[];
  education?: { institution: string; degree: string; field_of_study: string; start_date: string; end_date: string }[];
  experience?: { company: string; position: string; start_date: string; end_date: string; description: string }[];
  skills?: string[];
}

interface Command {
  id: string;
  input: string;
  output: React.ReactNode;
}

const COMMANDS: { command: string; description: string; forNonTech: string }[] = [
  { command: "help", description: "Show all available commands", forNonTech: "Need help? Start here!" },
  { command: "about", description: "Learn about me", forNonTech: "Who am I? Find out!" },
  { command: "skills", description: "See my technical skills", forNonTech: "What can I do?" },
  { command: "projects", description: "View my projects", forNonTech: "See my work!" },
  { command: "resume", description: "View or download my CV", forNonTech: "Get my resume" },
  { command: "contact", description: "Get my contact info", forNonTech: "How to reach me" },
  { command: "photos", description: "View my photo gallery", forNonTech: "See my photos" },
  { command: "gui", description: "Switch to website mode", forNonTech: "Use visual interface" },
  { command: "clear", description: "Clear terminal", forNonTech: "Clean the screen" },
];

const WELCOME_MESSAGE = (
  <div className="space-y-3">
    <div className="text-primary font-semibold text-lg">Welcome to DevPort Terminal v1.0.0</div>
    <div className="text-text-secondary text-sm">
      New here? No problem! Try these commands:
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm bg-surface/50 p-3 rounded-lg">
      {COMMANDS.slice(0, 4).map((cmd) => (
        <div key={cmd.command}>
          <span className="text-primary font-mono">→ {cmd.command}</span>
          <span className="text-text-muted text-xs ml-2">({cmd.forNonTech})</span>
        </div>
      ))}
    </div>
    <div className="text-text-secondary text-sm mt-2">
      Type <span className="text-primary">help</span> for all commands or <span className="text-primary">gui</span> for website mode
    </div>
  </div>
);

const INITIAL_MESSAGES = [
  { id: "1", input: "", output: null },
  { id: "2", input: "", output: <div className="text-primary">Initializing system...</div> },
  { id: "3", input: "", output: <div className="text-primary">Loading portfolio...</div> },
  { id: "4", input: "", output: <div className="text-success">Access granted.</div> },
  { id: "welcome", input: "", output: WELCOME_MESSAGE },
];

export default function Terminal({ onExitTerminal, profile, projects, education, experience, skills }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>(INITIAL_MESSAGES);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isBooting) focusInput();
  }, [isBooting, focusInput]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const renderHelp = () => (
    <div className="space-y-4">
      <div className="text-accent font-medium text-lg">Available Commands:</div>
      
      <div className="bg-surface/50 p-4 rounded-lg">
        <div className="text-text-muted text-sm mb-3">Quick Start (for beginners):</div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {COMMANDS.filter(c => ["about", "projects", "gui"].includes(c.command)).map((cmd) => (
            <div key={cmd.command} className="flex items-center gap-2">
              <span className="text-primary font-mono min-w-[80px]">{cmd.command}</span>
              <span className="text-text-secondary">{cmd.description}</span>
              <span className="text-text-muted text-xs">({cmd.forNonTech})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-accent font-medium mt-4">All Commands:</div>
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {COMMANDS.map((cmd) => (
          <div key={cmd.command} className="flex items-center gap-2">
            <span className="text-primary font-mono min-w-[80px]">{cmd.command}</span>
            <span className="text-text-secondary">{cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-2">
      <div className="text-primary font-medium">About</div>
      <div className="text-text-secondary">
        Software Engineer passionate about building elegant, user-centric digital experiences.
        Focused on modern web technologies and creating clean, performant applications.
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-3">
      <div className="text-primary font-medium">Technical Skills</div>
      <div className="space-y-2">
        <div>
          <div className="text-accent text-sm mb-1">Frontend</div>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"].map(skill => (
              <span key={skill} className="rounded bg-surface px-2 py-1 text-xs text-text-secondary">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-accent text-sm mb-1">Backend</div>
          <div className="flex flex-wrap gap-2">
            {["Node.js", "Python", "PostgreSQL", "REST APIs"].map(skill => (
              <span key={skill} className="rounded bg-surface px-2 py-1 text-xs text-text-secondary">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-accent text-sm mb-1">Tools</div>
          <div className="flex flex-wrap gap-2">
            {["Git", "Docker", "AWS", "Figma"].map(skill => (
              <span key={skill} className="rounded bg-surface px-2 py-1 text-xs text-text-secondary">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-3">
      <div className="text-primary font-medium">Featured Projects</div>
      <div className="space-y-3">
        <div className="border-l-2 border-accent pl-3">
          <div className="text-text-primary font-medium">Project Alpha</div>
          <div className="text-sm text-text-secondary">A modern web application built with Next.js</div>
          <div className="mt-1 flex gap-2 text-xs text-primary">[React] [TypeScript] [Tailwind]</div>
        </div>
        <div className="border-l-2 border-accent pl-3">
          <div className="text-text-primary font-medium">Project Beta</div>
          <div className="text-sm text-text-secondary">Real-time collaboration platform</div>
          <div className="mt-1 flex gap-2 text-xs text-primary">[Node.js] [WebSocket] [PostgreSQL]</div>
        </div>
      </div>
    </div>
  );

  const handleDownloadCV = () => {
    if (profile) {
      const eduList: Education[] = (education || []) as Education[];
      const expList: Experience[] = (experience || []) as Experience[];
      const projList = (projects?.map(p => ({ title: p.title, description: p.description, tech_stack: p.tech_stack })) || []) as { title: string; description: string; tech_stack: string[] }[];
      
      if (eduList.length === 0 && expList.length === 0 && (!projList || projList.length === 0) && (!skills || skills.length === 0)) {
        alert("No resume data found. Please add your profile, education, experience, and skills in the admin panel first.");
        return;
      }
      
      downloadPDF(profile, eduList, expList, projList, skills || []);
    }
  };

  const renderResume = () => (
    <div className="space-y-2">
      <div className="text-primary font-medium">Resume</div>
      <div className="text-text-secondary">
        View or download my resume to learn more about my experience.
      </div>
      <div className="flex gap-2 pt-2">
        <button 
          onClick={handleDownloadCV}
          className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-background hover:bg-primary-hover"
        >
          Download CV
        </button>
        <button 
          onClick={onExitTerminal}
          className="rounded border border-border px-3 py-1.5 text-sm text-text-secondary hover:text-foreground"
        >
          Preview
        </button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-2">
      <div className="text-primary font-medium">Contact Information</div>
      <div className="text-text-secondary">{profile?.email || "email@example.com"}</div>
      <div className="flex gap-3 pt-2">
        {profile?.github_link && (
          <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>
        )}
        {profile?.linkedin_link && (
          <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>
        )}
        {profile?.twitter_link && (
          <a href={profile.twitter_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twitter</a>
        )}
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-3">
      <div className="text-primary font-medium">Photo Gallery</div>
      <div className="text-text-secondary mb-3">
        Use the visual interface to browse photos. Type <span className="text-primary">gui</span> to switch to website mode.
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200",
        ].map((url, i) => (
          <div key={i} className="relative w-full h-20 rounded overflow-hidden">
            <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
      <div className="text-text-muted text-sm">Type <span className="text-primary">gui</span> to see full gallery</div>
    </div>
  );

  const executeCommand = (cmd: string): React.ReactNode => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === "clear") return null;
    if (trimmedCmd === "gui") {
      setTimeout(() => onExitTerminal?.(), 500);
      return <div className="text-primary">Switching to Website mode...</div>;
    }

    switch (trimmedCmd) {
      case "help": return renderHelp();
      case "about": return renderAbout();
      case "skills": return renderSkills();
      case "projects": return renderProjects();
      case "resume": return renderResume();
      case "contact": return renderContact();
      case "photos": return renderPhotos();
      case "": return null;
      default:
        return (
          <div className="text-error">
            Command not found: <span className="text-text-secondary">{cmd}</span>. Type <span className="text-primary">help</span> for available commands.
          </div>
        );
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const output = executeCommand(trimmedCmd);

    if (trimmedCmd.toLowerCase() !== "clear") {
      setHistory(prev => [...prev, { id: Date.now().toString(), input: trimmedCmd, output }]);
      setCommandHistory(prev => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    } else {
      setHistory([{ id: "welcome", input: "", output: WELCOME_MESSAGE }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions && selectedSuggestion > 0) {
        setSelectedSuggestion(prev => prev - 1);
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && selectedSuggestion < COMMANDS.filter(c => c.command.startsWith(input.toLowerCase())).length - 1) {
        setSelectedSuggestion(prev => prev + 1);
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = COMMANDS.filter(c => c.command.startsWith(input.toLowerCase()));
      if (matches.length > 0) {
        setInput(matches[0].command);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const matches = COMMANDS.filter(c => c.command.startsWith(value.toLowerCase()));
    setShowSuggestions(value.length > 0 && matches.length > 0);
    setSelectedSuggestion(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex flex-col bg-background text-text-primary"
      onClick={focusInput}
    >
      <div className="scanline-overlay pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10 flex items-center gap-3 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        </div>
        <TERMINAL className="h-5 w-5 text-primary" />
        <div className="flex flex-col text-xs sm:text-sm">
          <span className="font-mono text-text-primary">DevPort Terminal</span>
          <span className="text-text-secondary">Interactive command shell</span>
        </div>
        <span className="ml-auto font-mono text-xs uppercase tracking-widest text-text-muted">
          user@devport:~
        </span>
      </div>

      <div ref={terminalRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-5 font-mono text-sm sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {history.map((cmd) => (
            <div key={cmd.id} className="space-y-2">
              {cmd.input && (
                <div className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="flex items-center gap-1 text-primary">
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-accent">$</span>
                  </span>
                  <span className="break-words">{cmd.input}</span>
                </div>
              )}
              {cmd.output && <div className="text-text-secondary">{cmd.output}</div>}
            </div>
          ))}

          {!isBooting && (
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-primary">
                  <ChevronRightIcon className="h-4 w-4" />
                  <span className="text-accent">$</span>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    const matches = COMMANDS.filter(c => c.command.startsWith(input.toLowerCase()));
                    setShowSuggestions(input.length > 0 && matches.length > 0);
                  }}
                  className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                  placeholder="Type a command... (try 'help' for beginners)"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <span className="h-5 w-1 rounded-full bg-primary animate-cursor-blink" />
              </div>
              
              {showSuggestions && (
                <div className="absolute left-6 top-full mt-2 w-80 rounded-lg border border-border bg-surface/95 p-2 shadow-lg backdrop-blur">
                  <div className="text-xs text-text-muted mb-2">Suggestions (Tab to complete):</div>
                  {COMMANDS.filter(c => c.command.startsWith(input.toLowerCase())).map((cmd, i) => (
                    <div
                      key={cmd.command}
                      className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${i === selectedSuggestion ? "bg-primary/20 text-primary" : "text-text-secondary"}`}
                      onClick={() => {
                        setInput(cmd.command);
                        setShowSuggestions(false);
                        inputRef.current?.focus();
                      }}
                    >
                      <span className="font-mono text-primary">{cmd.command}</span>
                      <span className="text-text-muted">- {cmd.forNonTech}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
        <div ref={outputEndRef} />
      </div>

      <div className="relative z-10 border-t border-border bg-surface/50 px-4 py-2 text-xs text-text-muted">
        <div className="flex justify-between">
          <span>↑↓ History</span>
          <span>Tab Auto-complete</span>
          <span>Ctrl+` Toggle</span>
          <span>Type to see suggestions</span>
        </div>
      </div>
    </motion.div>
  );
}