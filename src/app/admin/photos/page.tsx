"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";
import { Loader2 } from "lucide-react";

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

export default function PhotosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdmin();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ url: "", caption: "", category: "work" });

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }
    fetchPhotos();
  }, [user, authLoading, router, fetchPhotos]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from("photos").update(form).eq("id", editingId);
      showMessage("Photo updated successfully!");
    } else {
      await supabase.from("photos").insert(form);
      showMessage("Photo added successfully!");
    }
    setForm({ url: "", caption: "", category: "work" });
    setShowForm(false);
    setEditingId(null);
    setPreviewUrl("");
    fetchPhotos();
  };

  const handleEdit = (photo: Photo) => {
    setForm({ url: photo.url || "", caption: photo.caption || "", category: photo.category || "work" });
    setPreviewUrl(photo.url || "");
    setEditingId(photo.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    await supabase.from("photos").delete().eq("id", id);
    fetchPhotos();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showMessage("File size must be under 5MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => { setPreviewUrl(reader.result as string); setForm((prev) => ({ ...prev, url: reader.result as string })); setUploading(false); };
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
          <h1 className="text-3xl font-semibold text-white mb-2">Photos</h1>
          <p className="text-gray-400">Manage your photo gallery</p>
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
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setForm({ url: "", caption: "", category: "work" }); setPreviewUrl(""); } }} className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
          {showForm ? "Cancel" : "Add Photo"}
        </button>
      </div>

      {showForm && (
        <Card title={editingId ? "Edit Photo" : "Add New Photo"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className={labelClassName}>Image URL</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClassName} placeholder="https://example.com/image.jpg" /></div>
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-sm">or</div>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="photo-upload" />
              <label htmlFor="photo-upload" className="cursor-pointer">
                {uploading ? (<div className="text-cyan-400 text-sm">Uploading...</div>) : previewUrl || form.url ? (
                  <div className="relative w-32 h-20 mx-auto rounded-lg overflow-hidden"><Image src={previewUrl || form.url} alt="Preview" fill className="object-cover" unoptimized /></div>
                ) : (<div className="text-gray-400 text-sm">Click to upload image</div>)}
              </label>
            </div>
            <div><label className={labelClassName}>Caption</label><input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClassName} placeholder="Photo caption..." /></div>
            <div><label className={labelClassName}>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClassName}><option value="work">Work</option><option value="personal">Personal</option><option value="travel">Travel</option><option value="events">Events</option></select></div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all border border-cyan-400/30">
              {editingId ? "Update Photo" : "Add Photo"}
            </button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-700 bg-[#1a1a2e]">
            <Image src={photo.url} alt={photo.caption || "Photo"} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(photo)} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 transition-colors">Edit</button>
              <button onClick={() => handleDelete(photo.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors">Delete</button>
            </div>
            {photo.caption && <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent"><p className="text-white text-xs truncate">{photo.caption}</p></div>}
          </div>
        ))}
      </div>

      {photos.length === 0 && !showForm && (
        <div className="rounded-2xl bg-white/5 border border-cyan-400/20 p-8 text-center"><p className="text-gray-400">No photos yet. Add your first photo!</p></div>
      )}
    </motion.div>
  );
}