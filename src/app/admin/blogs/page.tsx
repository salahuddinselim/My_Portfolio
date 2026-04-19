"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { BLOG_TOPICS, BlogTopic } from "@/types";
import { Loader2 } from "lucide-react";

interface BlogPost {
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

const inputClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
const selectClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
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

export default function BlogsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdmin();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    tags: "",
    topic: "other" as BlogTopic,
    published: false,
  });

  const fetchBlogs = useCallback(async () => {
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }
    fetchBlogs();
  }, [user, authLoading, router, fetchBlogs]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };

    if (editingId) {
      await supabase.from("blogs").update(blogData).eq("id", editingId);
      showMessage("Blog updated successfully!");
    } else {
      await supabase.from("blogs").insert(blogData);
      showMessage("Blog added successfully!");
    }

    setForm({ title: "", slug: "", content: "", excerpt: "", cover_image: "", tags: "", topic: "other", published: false });
    setShowForm(false);
    setEditingId(null);
    setPreviewUrl("");
    fetchBlogs();
  };

  const handleEdit = (blog: BlogPost) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      cover_image: blog.cover_image || "",
      tags: blog.tags?.join(", ") || "",
      topic: blog.topic || "other",
      published: blog.published || false,
    });
    setPreviewUrl(blog.cover_image || "");
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    await supabase.from("blogs").delete().eq("id", id);
    fetchBlogs();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMessage("File size must be under 5MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => { setPreviewUrl(reader.result as string); setForm((prev) => ({ ...prev, cover_image: reader.result as string })); setUploading(false); };
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
          <h1 className="text-3xl font-semibold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">Manage your blog posts</p>
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
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setForm({ title: "", slug: "", content: "", excerpt: "", cover_image: "", tags: "", topic: "other", published: false }); setPreviewUrl(""); } }} className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
          {showForm ? "Cancel" : "Add Blog Post"}
        </button>
      </div>

      {showForm && (
        <Card title={editingId ? "Edit Blog Post" : "Add New Blog Post"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClassName}>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className={inputClassName} required /></div>
              <div><label className={labelClassName}>Topic</label><select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value as BlogTopic })} className={selectClassName}>{BLOG_TOPICS.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}</select></div>
            </div>
            <div><label className={labelClassName}>Slug</label><input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClassName} /></div>
            <div><label className={labelClassName}>Excerpt</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={`${inputClassName} resize-none min-h-[60px]`} placeholder="Short description..." /></div>
            <div><label className={labelClassName}>Content</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={`${inputClassName} resize-none min-h-[120px]`} placeholder="Blog content..." /></div>
            <div><label className={labelClassName}>Tags (comma separated)</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClassName} placeholder="react, javascript, tutorial" /></div>
            <div>
              <label className={labelClassName}>Cover Image</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageTab("url")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "url" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>URL</button>
                <button type="button" onClick={() => setImageTab("upload")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "upload" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>Upload</button>
              </div>
              {imageTab === "url" ? (
                <input type="url" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputClassName} placeholder="https://example.com/image.jpg" />
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cover-upload" />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    {uploading ? (<div className="text-cyan-400 text-sm">Uploading...</div>) : previewUrl || form.cover_image ? (
                      <div className="relative w-28 h-16 mx-auto rounded-lg overflow-hidden"><Image src={previewUrl || form.cover_image} alt="Preview" fill className="object-cover" unoptimized /></div>
                    ) : (<div className="text-gray-400 text-sm">Click to upload</div>)}
                  </label>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-gray-600 bg-transparent text-cyan-400" />
              Published
            </label>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
              {editingId ? "Update Blog" : "Add Blog Post"}
            </button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => {
          const topic = BLOG_TOPICS.find(t => t.value === blog.topic);
          return (
            <Card key={blog.id} title={blog.title} action={<div className="flex items-center gap-2"><span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${topic?.color}20`, color: topic?.color }}>{topic?.label}</span><span className={`text-xs px-2 py-1 rounded ${blog.published ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"}`}>{blog.published ? "Published" : "Draft"}</span></div>}>
              <div className="space-y-3">
                {blog.cover_image && <div className="relative h-28 rounded-lg overflow-hidden bg-[#1a1a2e]"><Image src={blog.cover_image} alt={blog.title} fill className="object-cover" unoptimized /></div>}
                <p className="text-gray-400 text-sm line-clamp-2">{blog.excerpt}</p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag, i) => (<span key={i} className="text-xs bg-[#1a1a2e] text-cyan-400 px-2 py-1 rounded">{tag}</span>))}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleEdit(blog)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {blogs.length === 0 && !showForm && (
        <div className="rounded-2xl bg-white/5 border border-cyan-400/20 p-8 text-center"><p className="text-gray-400">No blog posts yet. Add your first blog!</p></div>
      )}
    </motion.div>
  );
}