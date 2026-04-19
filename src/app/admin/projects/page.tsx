"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

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
  created_at: string;
}

const inputClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
const labelClassName = "block text-sm text-gray-400 mb-2";
const cardClassName = "rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 p-6 shadow-[0_0_25px_rgba(34,211,238,0.15)]";

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={cardClassName}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
    live_link: "",
    image: "",
    category: "",
    featured: false,
  });

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }
    fetchProjects();
  }, [user, authLoading, router, fetchProjects]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = { ...form, tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean) };

    if (editingId) {
      await supabase.from("projects").update(projectData).eq("id", editingId);
      showMessage("Project updated successfully!");
    } else {
      await supabase.from("projects").insert(projectData);
      showMessage("Project added successfully!");
    }

    setForm({ title: "", description: "", tech_stack: "", github_link: "", live_link: "", image: "", category: "", featured: false });
    setShowForm(false);
    setEditingId(null);
    setPreviewUrl("");
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description || "",
      tech_stack: project.tech_stack?.join(", ") || "",
      github_link: project.github_link || "",
      live_link: project.live_link || "",
      image: project.image || "",
      category: project.category || "",
      featured: project.featured || false,
    });
    setPreviewUrl(project.image || "");
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMessage("File size must be under 5MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => { setPreviewUrl(reader.result as string); setForm((prev) => ({ ...prev, image: reader.result as string })); setUploading(false); };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 text-lg flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your projects</p>
        </div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-xl p-4 ${message.includes("Error") ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-green-500/10 border border-green-500/30 text-green-400"}`}>
          {message}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setForm({ title: "", description: "", tech_stack: "", github_link: "", live_link: "", image: "", category: "", featured: false }); setPreviewUrl(""); } }} className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {showForm && (
        <Card title={editingId ? "Edit Project" : "Add New Project"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClassName}>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClassName} required /></div>
              <div><label className={labelClassName}>Category</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClassName} placeholder="Web, Mobile, etc." /></div>
            </div>
            <div><label className={labelClassName}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClassName} resize-none min-h-[80px]`} placeholder="Project description..." /></div>
            <div><label className={labelClassName}>Tech Stack (comma separated)</label><input type="text" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className={inputClassName} placeholder="React, Node.js, MongoDB" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClassName}>GitHub Link</label><input type="url" value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className={inputClassName} placeholder="https://github.com/..." /></div>
              <div><label className={labelClassName}>Live Link</label><input type="url" value={form.live_link} onChange={(e) => setForm({ ...form, live_link: e.target.value })} className={inputClassName} placeholder="https://..." /></div>
            </div>
            <div>
              <label className={labelClassName}>Project Image</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageTab("url")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "url" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>URL</button>
                <button type="button" onClick={() => setImageTab("upload")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "upload" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>Upload</button>
              </div>
              {imageTab === "url" ? (
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClassName} placeholder="https://example.com/image.jpg" />
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="project-upload" />
                  <label htmlFor="project-upload" className="cursor-pointer">
                    {uploading ? (<div className="text-cyan-400 text-sm">Uploading...</div>) : previewUrl || form.image ? (
                      <div className="relative w-28 h-16 mx-auto rounded-lg overflow-hidden"><Image src={previewUrl || form.image} alt="Preview" fill className="object-cover" unoptimized /></div>
                    ) : (<div className="text-gray-400 text-sm">Click to upload</div>)}
                  </label>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-gray-600 bg-transparent text-cyan-400" />
              Featured Project
            </label>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
              {editingId ? "Update Project" : "Add Project"}
            </button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} title={project.title} action={<span className={`text-xs px-2 py-1 rounded ${project.featured ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-700 text-gray-400"}`}>{project.featured ? "Featured" : project.category}</span>}>
            <div className="space-y-3">
              {project.image && <div className="relative h-28 rounded-lg overflow-hidden bg-[#1a1a2e]"><Image src={project.image} alt={project.title} fill className="object-cover" unoptimized /></div>}
              <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech, i) => (<span key={i} className="text-xs bg-[#1a1a2e] text-cyan-400 px-2 py-1 rounded">{tech}</span>))}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleEdit(project)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Edit</button>
                <button onClick={() => handleDelete(project.id)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="rounded-2xl bg-white/5 border border-cyan-400/20 p-8 text-center"><p className="text-gray-400">No projects yet. Add your first project!</p></div>
      )}
    </motion.div>
  );
}