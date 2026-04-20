"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import ModeToggle from "@/components/layout/ModeToggle";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Resume from "@/components/sections/Resume";
import Contact from "@/components/sections/Contact";
import GitHub from "@/components/sections/Github";
import Terminal from "@/components/terminal/Terminal";
import { Profile, Project, Photo, Education, Experience } from "@/types";

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);
  const [mode, setMode] = useState<"terminal" | "website">("terminal");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "terminal" ? "website" : "terminal"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMode]);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, projectsRes, photosRes, educationRes, experienceRes, skillsRes] = await Promise.all([
        supabase.from("profiles").select("*").limit(1),
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("photos").select("*").order("created_at", { ascending: false }),
        supabase.from("education").select("*").order("start_date", { ascending: false }),
        supabase.from("experience").select("*").order("start_date", { ascending: false }),
        supabase.from("skills").select("name").order("category", { ascending: true }),
      ]);

      if (profileRes.data && profileRes.data.length > 0) {
        setProfile(profileRes.data[0] as Profile);
      }
      setProjects(projectsRes.data || []);
      setPhotos(photosRes.data || []);
      setEducation(educationRes.data || []);
      setExperience(experienceRes.data || []);
      setSkills(skillsRes.data?.map(s => s.name) || []);
    };

    fetchData();
  }, []);

  const defaultProfile: Profile = {
    name: "Alex",
    role: "Software Engineer",
    bio: "I'm a Software Engineer with a passion for building elegant, performant web applications.",
    vision: "Building elegant, user-centric digital experiences",
    location: "",
    profile_image: "",
    email: "email@example.com",
    phone: "",
    contact_email: "contact@example.com",
    github_link: "#",
    linkedin_link: "#",
    twitter_link: "#",
    facebook_link: "",
    instagram_link: "",
    coursework: "",
    achievements: "",
  };

  const defaultProjects: Project[] = [
    {
      id: "1",
      title: "Project Alpha",
      description: "A modern web application built with Next.js",
      tech_stack: ["React", "Next.js", "TypeScript"],
      github_link: "#",
      live_link: "#",
      image: "",
      category: "Web",
      featured: true,
    },
    {
      id: "2",
      title: "Project Beta",
      description: "Real-time collaboration platform",
      tech_stack: ["Node.js", "WebSocket", "PostgreSQL"],
      github_link: "#",
      live_link: "#",
      image: "",
      category: "Real-time",
      featured: true,
    },
  ];

  const displayProfile: Profile = {
    name: profile?.name || defaultProfile.name,
    role: profile?.role || defaultProfile.role,
    bio: profile?.bio || defaultProfile.bio,
    vision: profile?.vision || defaultProfile.vision,
    location: profile?.location || defaultProfile.location,
    profile_image: profile?.profile_image || defaultProfile.profile_image,
    email: profile?.email || defaultProfile.email,
    phone: profile?.phone || defaultProfile.phone,
    contact_email: profile?.contact_email || defaultProfile.contact_email,
    github_link: profile?.github_link || defaultProfile.github_link,
    linkedin_link: profile?.linkedin_link || defaultProfile.linkedin_link,
    twitter_link: profile?.twitter_link || defaultProfile.twitter_link,
    facebook_link: profile?.facebook_link || defaultProfile.facebook_link,
    instagram_link: profile?.instagram_link || defaultProfile.instagram_link,
    coursework: profile?.coursework || defaultProfile.coursework,
    achievements: profile?.achievements || defaultProfile.achievements,
  };
  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  const displayEducation = education.map(e => ({
    institution: e.institution,
    degree: e.degree || "",
    field_of_study: e.field_of_study || "",
    start_date: e.start_date || "",
    end_date: e.end_date || "",
  }));
  const displayExperience = experience.map(e => ({
    company: e.company,
    position: e.position || "",
    start_date: e.start_date || "",
    end_date: e.end_date || "",
    description: e.description || "",
  }));

  return (
    <>
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xl text-primary"
              >
                Initializing system...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-sm text-text-secondary"
              >
                Loading portfolio...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-mono text-sm text-success"
              >
                Access granted.
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isBooting && mode === "terminal" && (
          <Terminal
            onExitTerminal={toggleMode}
            profile={displayProfile}
            projects={displayProjects}
            education={displayEducation}
            experience={displayExperience}
            skills={skills}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isBooting && mode === "website" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
            <Header onToggleTerminal={toggleMode} />
            <main className="relative z-10">
              <Hero
                profile={displayProfile}
                onOpenTerminal={toggleMode}
              />
              <About profile={displayProfile} />
              <Skills />
              <Photos photos={photos} />
              <GitHub username="salahuddinselim" />
              <Projects projects={displayProjects} />
              <Resume />
              <Contact profile={displayProfile} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {!isBooting && <ModeToggle mode={mode} onToggle={toggleMode} />}
    </>
  );
}