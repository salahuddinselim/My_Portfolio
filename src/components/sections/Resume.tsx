"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Profile, Education, Experience } from "@/types";
import { downloadPDF } from "@/lib/resume";
import { FileText, FileDown, Eye } from "lucide-react";

export default function Resume() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<{ title: string; description: string; tech_stack: string[] }[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const fetchData = useCallback(async () => {
    const [profileRes, educationRes, experienceRes, projectsRes, skillsRes] = await Promise.all([
      supabase.from("profiles").select("*").limit(1),
      supabase.from("education").select("*").order("start_date", { ascending: false }),
      supabase.from("experience").select("*").order("start_date", { ascending: false }),
      supabase.from("projects").select("title, description, tech_stack").order("created_at", { ascending: false }),
      supabase.from("skills").select("name").order("category", { ascending: true }),
    ]);

    if (profileRes.data && profileRes.data.length > 0) {
      setProfile(profileRes.data[0] as Profile);
    }

    if (educationRes.data) {
      setEducation(educationRes.data);
    }

    if (experienceRes.data) {
      setExperience(experienceRes.data);
    }

    if (projectsRes.data) {
      setProjects(projectsRes.data);
    }

    if (skillsRes.data) {
      setSkills(skillsRes.data.map(s => s.name));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadPDF = () => {
    if (profile) {
      if (education.length === 0 && experience.length === 0 && projects.length === 0 && skills.length === 0) {
        alert("No resume data found. Please add your profile, education, experience, and skills in the admin panel first.");
        return;
      }
      downloadPDF(profile, education, experience, projects, skills);
    }
  };

  if (loading) {
    return (
      <section id="resume" className="py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center text-text-secondary">Loading resume...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="resume" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Resume</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Hide" : "Preview"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary-hover transition-colors"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

          {showPreview && profile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-8 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur"
            >
              <div className="text-center mb-6 pb-6 border-b border-border">
                <h3 className="text-2xl font-bold text-foreground">{profile.name || "Your Name"}</h3>
                <p className="text-text-secondary">{profile.role || "Software Developer"}</p>
                <div className="mt-2 text-sm text-text-muted">
                  {profile.email && <span>{profile.email}</span>}
                  {profile.location && <span> | {profile.location}</span>}
                </div>
              </div>

              {profile.bio && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-foreground mb-2">Professional Summary</h4>
                  <p className="text-text-secondary text-sm">{profile.bio}</p>
                </div>
              )}

              {education.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-foreground mb-2">Education</h4>
                  {education.map((edu, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between">
                        <span className="text-foreground">{edu.institution}</span>
                        <span className="text-text-muted text-sm">
{edu.currently_studying ? `${edu.start_date} - Present` : `${edu.start_date} - ${edu.end_date}`}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">
                        {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                        {edu.grade && ` | Grade: ${edu.grade}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {experience.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-foreground mb-2">Work Experience</h4>
                  {experience.map((exp, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between">
                        <span className="text-foreground">{exp.position} at {exp.company}</span>
                        <span className="text-text-muted text-sm">
{exp.currently_working ? `${exp.start_date} - Present` : `${exp.start_date} - ${exp.end_date}`}
                        </span>
                      </div>
                      {exp.description && <p className="text-text-secondary text-sm">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span key={i} className="rounded-full bg-background/50 px-3 py-1 text-xs text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground mb-4">Education</h3>
              {education.length > 0 ? (
                education.map((edu, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="font-medium text-foreground">{edu.institution}</div>
                    <div className="text-sm text-text-secondary">
                      {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                    </div>
                    <div className="text-sm text-text-muted">
                      {edu.currently_studying ? `${edu.start_date} - Present` : `${edu.start_date} - ${edu.end_date}`}
                      {edu.grade && ` | ${edu.grade}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-muted text-sm">No education added yet</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground mb-4">Experience</h3>
              {experience.length > 0 ? (
                experience.map((exp, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="font-medium text-foreground">{exp.position}</div>
                    <div className="text-sm text-text-secondary">{exp.company}</div>
                    <div className="text-sm text-text-muted">
                      {exp.currently_working ? `${exp.start_date} - Present` : `${exp.start_date} - ${exp.end_date}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-muted text-sm">No experience added yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}