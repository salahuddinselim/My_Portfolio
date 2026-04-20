export interface Profile {
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  vision?: string;
  location?: string;
  profile_image?: string;
  email?: string;
  phone?: string;
  contact_email?: string;
  github_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  discord_username?: string;
  coursework?: string;
  achievements?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  description?: string;
  current?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  current?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_link: string;
  live_link: string;
  image: string;
  category: string;
  featured: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  tags: string[];
  topic: BlogTopic;
  published: boolean;
  created_at: string;
}

export type BlogTopic = "ai" | "ml" | "new-tech" | "war" | "other";

export const BLOG_TOPICS: { value: BlogTopic; label: string; color: string }[] = [
  { value: "ai", label: "AI", color: "#22d3ee" },
  { value: "ml", label: "Machine Learning", color: "#a78bfa" },
  { value: "new-tech", label: "New Tech", color: "#34d399" },
  { value: "war", label: "War", color: "#f87171" },
  { value: "other", label: "Other", color: "#fbbf24" },
];

export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: string;
  created_at: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  icon?: string;
  created_at?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}