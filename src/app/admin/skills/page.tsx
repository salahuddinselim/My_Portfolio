"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import { Loader2 } from "lucide-react";

const inputClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
const selectClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
const labelClassName = "block text-sm text-gray-400 mb-2";
const cardClassName = "rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 p-6 shadow-[0_0_25px_rgba(34,211,238,0.15)]";

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cardClassName}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export default function SkillsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdmin();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "Programming Languages" });

  const categories = ["Programming Languages", "Frontend", "Backend", "Database", "Tools", "Concepts"];

  const fetchSkills = useCallback(async () => {
    const { data } = await supabase.from("skills").select("*").order("category", { ascending: true });
    setSkills(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }
    fetchSkills();
  }, [user, authLoading, router, fetchSkills]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await supabase.from("skills").update(form).eq("id", editingId);
        showMessage("Skill updated successfully!");
      } else {
        await supabase.from("skills").insert(form);
        showMessage("Skill added successfully!");
      }
      setForm({ name: "", category: "Programming Languages" });
      setShowForm(false);
      setEditingId(null);
      fetchSkills();
    } catch {
      showMessage("Error saving skill");
    }
    setSaving(false);
  };

  const handleEdit = (skill: Skill) => {
    setForm({ name: skill.name, category: skill.category });
    setEditingId(skill.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    await supabase.from("skills").delete().eq("id", id);
    fetchSkills();
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

  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Skills</h1>
          <p className="text-gray-400">Manage your technical skills</p>
        </div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-xl p-4 ${message.includes("Error") ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-green-500/10 border border-green-500/30 text-green-400"}`}>
          {message}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setForm({ name: "", category: "Programming Languages" }); } }} className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
          {showForm ? "Cancel" : "Add Skill"}
        </button>
      </div>

      {showForm && (
        <Card title={editingId ? "Edit Skill" : "Add New Skill"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Skill Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClassName} placeholder="React, Python, etc." required />
              </div>
              <div>
                <label className={labelClassName}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClassName}>
                  {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30 disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update" : "Add Skill"}
              </button>
              {showForm && (
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: "", category: "Programming Languages" }); }} className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          groupedSkills[category].length > 0 && (
            <Card key={category} title={category}>
              <div className="flex flex-wrap gap-2">
                {groupedSkills[category].map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#1a1a2e] px-3 py-1.5 group hover:border-cyan-400/50 transition-all">
                    <span className="text-white text-sm">{skill.name}</span>
                    <button onClick={() => handleEdit(skill)} className="text-cyan-400 hover:text-cyan-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    <button onClick={() => handleDelete(skill.id!)} className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </Card>
          )
        ))}
      </div>

      {skills.length === 0 && (
        <div className="rounded-2xl bg-white/5 border border-cyan-400/20 p-8 text-center">
          <p className="text-gray-400">No skills added yet. Add your first skill!</p>
        </div>
      )}
    </motion.div>
  );
}