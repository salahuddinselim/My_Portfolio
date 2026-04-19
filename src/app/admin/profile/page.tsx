"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  role: string;
  bio: string;
  vision: string;
  location: string;
  profile_image: string;
  email: string;
  phone: string;
  contact_email: string;
  github_link: string;
  linkedin_link: string;
  twitter_link: string;
  facebook_link: string;
  instagram_link: string;
  discord_username: string;
  coursework: string;
  achievements: string;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade: string;
  description: string;
  currently_studying: boolean;
}

interface Experience {
  id?: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  currently_working: boolean;
}

const inputClassName = "w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
const labelClassName = "block text-sm text-gray-400 mb-2";

function Card({ title, children, onSave, saving, saveText = "Save" }: { title: string; children: React.ReactNode; onSave?: () => void; saving?: boolean; saveText?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 p-6 shadow-[0_0_25px_rgba(34,211,238,0.15)]"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-400 text-sm font-medium hover:bg-cyan-400/30 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : saveText}
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function DynamicItem({ 
  children, 
  onDelete,
  isEditing,
  onToggleEdit 
}: { 
  children: React.ReactNode; 
  onDelete: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl border p-4 mb-3 ${isEditing ? "border-cyan-400/50 bg-cyan-400/5" : "border-gray-700/50 bg-[#1a1a2e]/50"}`}
    >
      <div className="absolute top-3 right-3 flex gap-2">
        {onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className="p-1.5 rounded-md text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [savingExtra, setSavingExtra] = useState(false);
  const [savingEducation, setSavingEducation] = useState(false);
  const [savingExperience, setSavingExperience] = useState(false);
  const [message, setMessage] = useState("");
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [profile, setProfile] = useState<Profile>({
    id: "",
    name: "",
    role: "",
    bio: "",
    vision: "",
    location: "",
    profile_image: "",
    email: "",
    phone: "",
    contact_email: "",
    github_link: "",
    linkedin_link: "",
    twitter_link: "",
    facebook_link: "",
    instagram_link: "",
    discord_username: "",
    coursework: "",
    achievements: "",
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }

    const fetchProfile = async () => {
      const [profileData, educationData, experienceData] = await Promise.all([
        supabase.from("profiles").select("*").limit(1),
        supabase.from("education").select("*").order("start_date", { ascending: false }),
        supabase.from("experience").select("*").order("start_date", { ascending: false }),
      ]);
      
      if (profileData.data && profileData.data.length > 0) {
        const p = profileData.data[0];
        setProfile({
          id: p.id || "",
          name: p.name || "",
          role: p.role || "",
          bio: p.bio || "",
          vision: p.vision || "",
          location: p.location || "",
          profile_image: p.profile_image || "",
          email: p.email || "",
          phone: p.phone || "",
          contact_email: p.contact_email || "",
          github_link: p.github_link || "",
          linkedin_link: p.linkedin_link || "",
          twitter_link: p.twitter_link || "",
          facebook_link: p.facebook_link || "",
          instagram_link: p.instagram_link || "",
          discord_username: p.discord_username || "",
          coursework: p.coursework || "",
          achievements: p.achievements || "",
        });
      }

      if (educationData.data) {
        setEducation(educationData.data);
      }

      if (experienceData.data) {
        setExperience(experienceData.data);
      }

      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveBasic = async () => {
    setSavingBasic(true);
    const profileData = {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      vision: profile.vision,
      location: profile.location,
      profile_image: profile.profile_image,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (profile.id) {
      ({ error } = await supabase.from("profiles").update(profileData).eq("id", profile.id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updated_at: _u, ...insertDataWithoutUpdated } = profileData;
      const insertData = { id: user?.id, ...insertDataWithoutUpdated };
      ({ error } = await supabase.from("profiles").insert(insertData));
    }

    if (!error) {
      const { data } = await supabase.from("profiles").select("id").limit(1);
      if (data && data[0]) setProfile(prev => ({ ...prev, id: data[0].id }));
      showMessage("Basic info saved successfully!");
    } else {
      showMessage("Error: " + error.message);
    }
    setSavingBasic(false);
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    if (!profile.id) {
      showMessage("Please save basic info first");
      setSavingContact(false);
      return;
    }

    const { error } = await supabase.from("profiles").update({
      email: profile.email,
      phone: profile.phone,
      contact_email: profile.contact_email,
    }).eq("id", profile.id);

    if (!error) {
      showMessage("Contact info saved successfully!");
    } else {
      showMessage("Error: " + error.message);
    }
    setSavingContact(false);
  };

  const handleSaveSocial = async () => {
    setSavingSocial(true);
    if (!profile.id) {
      showMessage("Please save basic info first");
      setSavingSocial(false);
      return;
    }

    const { error } = await supabase.from("profiles").update({
      github_link: profile.github_link,
      linkedin_link: profile.linkedin_link,
      twitter_link: profile.twitter_link,
      facebook_link: profile.facebook_link,
      instagram_link: profile.instagram_link,
      discord_username: profile.discord_username,
    }).eq("id", profile.id);

    if (!error) {
      showMessage("Social links saved successfully!");
    } else {
      showMessage("Error: " + error.message);
    }
    setSavingSocial(false);
  };

  const handleSaveExtra = async () => {
    setSavingExtra(true);
    if (!profile.id) {
      showMessage("Please save basic info first");
      setSavingExtra(false);
      return;
    }

    const { error } = await supabase.from("profiles").update({
      coursework: profile.coursework,
      achievements: profile.achievements,
    }).eq("id", profile.id);

    if (!error) {
      showMessage("Coursework & achievements saved successfully!");
    } else {
      showMessage("Error: " + error.message);
    }
    setSavingExtra(false);
  };

  const handleSaveEducation = async () => {
    setSavingEducation(true);
    try {
      for (const edu of education) {
        if (edu.id) {
          await supabase.from("education").update(edu).eq("id", edu.id);
        } else {
          await supabase.from("education").insert(edu);
        }
      }
      showMessage("Education saved successfully!");
    } catch {
      showMessage("Error saving education");
    }
    setSavingEducation(false);
  };

  const handleSaveExperience = async () => {
    setSavingExperience(true);
    try {
      for (const exp of experience) {
        if (exp.id) {
          await supabase.from("experience").update(exp).eq("id", exp.id);
        } else {
          await supabase.from("experience").insert(exp);
        }
      }
      showMessage("Experience saved successfully!");
    } catch {
      showMessage("Error saving experience");
    }
    setSavingExperience(false);
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Error: File size must be under 5MB");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setProfile((prev) => ({ ...prev, profile_image: result }));
      setUploading(false);
    };
    reader.onerror = () => {
      showMessage("Error: Failed to read file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "", description: "", currently_studying: false }]);
    setEditingEducation(education.length);
  };

  const addExperience = () => {
    setExperience([...experience, { company: "", position: "", location: "", start_date: "", end_date: "", description: "", currently_working: false }]);
    setEditingExperience(experience.length - 1);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setEducation(newEdu);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setExperience(newExp);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your personal information</p>
        </div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-xl p-4 ${message.includes("Error") ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-green-500/10 border border-green-500/30 text-green-400"}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Basic Information" onSave={handleSaveBasic} saving={savingBasic}>
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClassName} placeholder="John Doe" />
            </div>
            <div>
              <label className={labelClassName}>Professional Role</label>
              <input type="text" value={profile.role} onChange={(e) => handleChange("role", e.target.value)} className={inputClassName} placeholder="Software Engineer" />
            </div>
            <div>
              <label className={labelClassName}>Location</label>
              <input type="text" value={profile.location} onChange={(e) => handleChange("location", e.target.value)} className={inputClassName} placeholder="San Francisco, CA" />
            </div>
            <div>
              <label className={labelClassName}>Bio</label>
              <textarea value={profile.bio} onChange={(e) => handleChange("bio", e.target.value)} className={`${inputClassName} resize-none min-h-[100px]`} placeholder="A brief introduction about yourself..." />
            </div>
            <div>
              <label className={labelClassName}>Vision / Tagline</label>
              <input type="text" value={profile.vision} onChange={(e) => handleChange("vision", e.target.value)} className={inputClassName} placeholder="Building the future of tech" />
            </div>
            <div>
              <label className={labelClassName}>Profile Image</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageTab("url")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "url" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>URL</button>
                <button type="button" onClick={() => setImageTab("upload")} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${imageTab === "upload" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "text-gray-400 hover:text-white"}`}>Upload</button>
              </div>
              {imageTab === "url" ? (
                <input type="url" value={profile.profile_image} onChange={(e) => handleChange("profile_image", e.target.value)} className={inputClassName} placeholder="https://example.com/image.jpg" />
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-cyan-400/50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="profile-upload-card" />
                  <label htmlFor="profile-upload-card" className="cursor-pointer block">
                    {uploading ? (<div className="text-cyan-400 text-sm">Uploading...</div>) : previewUrl || profile.profile_image ? (
                      <div className="relative w-16 h-16 mx-auto">
                        <Image src={previewUrl || profile.profile_image} alt="Preview" fill className="rounded-full object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Click to upload</div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card title="Contact Information" onSave={handleSaveContact} saving={savingContact}>
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Email Address</label>
              <input type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClassName} placeholder="john@example.com" />
            </div>
            <div>
              <label className={labelClassName}>Phone Number</label>
              <input type="tel" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClassName} placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className={labelClassName}>Contact Email (for messages)</label>
              <input type="email" value={profile.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} className={inputClassName} placeholder="contact@example.com" />
            </div>
          </div>
        </Card>

        <Card title="Social Links" onSave={handleSaveSocial} saving={savingSocial}>
          <div className="space-y-3">
            <div>
              <label className={labelClassName}>GitHub</label>
              <input type="url" value={profile.github_link} onChange={(e) => handleChange("github_link", e.target.value)} className={inputClassName} placeholder="https://github.com/username" />
            </div>
            <div>
              <label className={labelClassName}>LinkedIn</label>
              <input type="url" value={profile.linkedin_link} onChange={(e) => handleChange("linkedin_link", e.target.value)} className={inputClassName} placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className={labelClassName}>Twitter / X</label>
              <input type="url" value={profile.twitter_link} onChange={(e) => handleChange("twitter_link", e.target.value)} className={inputClassName} placeholder="https://x.com/username" />
            </div>
            <div>
              <label className={labelClassName}>Facebook</label>
              <input type="url" value={profile.facebook_link} onChange={(e) => handleChange("facebook_link", e.target.value)} className={inputClassName} placeholder="https://facebook.com/username" />
            </div>
            <div>
              <label className={labelClassName}>Instagram</label>
              <input type="url" value={profile.instagram_link} onChange={(e) => handleChange("instagram_link", e.target.value)} className={inputClassName} placeholder="https://instagram.com/username" />
            </div>
            <div>
              <label className={labelClassName}>Discord Username</label>
              <input type="text" value={profile.discord_username} onChange={(e) => handleChange("discord_username", e.target.value)} className={inputClassName} placeholder="username" />
            </div>
          </div>
        </Card>

        <Card title="Coursework" onSave={handleSaveExtra} saving={savingExtra}>
          <div className="space-y-3">
            {(profile.coursework ? profile.coursework.split("\n").filter(Boolean) : [""]).map((course, index, arr) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={course} 
                  onChange={(e) => {
                    const courses = arr.map((_, i) => i === index ? e.target.value : (profile.coursework.split("\n").filter(Boolean)[i] || ""));
                    handleChange("coursework", courses.join("\n"));
                  }}
                  className={inputClassName}
                  placeholder="Course name"
                />
                {arr.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const courses = profile.coursework.split("\n").filter((_, i) => i !== index);
                      handleChange("coursework", courses.join("\n"));
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleChange("coursework", (profile.coursework ? profile.coursework + "\n" : "") + "")}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-700 rounded-xl text-gray-400 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>
        </Card>

        <Card title="Achievements" onSave={handleSaveExtra} saving={savingExtra}>
          <div className="space-y-3">
            {(profile.achievements ? profile.achievements.split("\n").filter(Boolean) : [""]).map((achievement, index, arr) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={achievement} 
                  onChange={(e) => {
                    const achievements = arr.map((_, i) => i === index ? e.target.value : (profile.achievements.split("\n").filter(Boolean)[i] || ""));
                    handleChange("achievements", achievements.join("\n"));
                  }}
                  className={inputClassName}
                  placeholder="Achievement"
                />
                {arr.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const achievements = profile.achievements.split("\n").filter((_, i) => i !== index);
                      handleChange("achievements", achievements.join("\n"));
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleChange("achievements", (profile.achievements ? profile.achievements + "\n" : "") + "")}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-700 rounded-xl text-gray-400 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Achievement
            </button>
          </div>
        </Card>

        <Card title="Education" onSave={handleSaveEducation} saving={savingEducation}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {education.map((edu, index) => (
                <DynamicItem
                  key={index}
                  onDelete={() => setEducation(education.filter((_, i) => i !== index))}
                  isEditing={editingEducation === index}
                  onToggleEdit={() => setEditingEducation(editingEducation === index ? null : index)}
                >
                  {editingEducation === index ? (
                    <div className="pr-16 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={edu.institution} onChange={(e) => updateEducation(index, "institution", e.target.value)} className={inputClassName} placeholder="Institution" />
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} className={inputClassName} placeholder="Degree" />
                        <input type="text" value={edu.field_of_study} onChange={(e) => updateEducation(index, "field_of_study", e.target.value)} className={inputClassName} placeholder="Field of Study" />
                        <input type="text" value={edu.grade} onChange={(e) => updateEducation(index, "grade", e.target.value)} className={inputClassName} placeholder="Grade" />
                        <input type="text" value={edu.start_date} onChange={(e) => updateEducation(index, "start_date", e.target.value)} className={inputClassName} placeholder="Start Date" />
                        <input type="text" value={edu.end_date} onChange={(e) => updateEducation(index, "end_date", e.target.value)} className={inputClassName} placeholder="End Date" />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input type="checkbox" checked={edu.currently_studying} onChange={(e) => updateEducation(index, "currently_studying", e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-transparent text-cyan-400" />
                        Currently studying
                      </label>
                    </div>
                  ) : (
                    <div className="pr-16">
                      <div className="font-medium text-white text-sm">{edu.institution || "Institution"}</div>
                      <div className="text-gray-400 text-xs">{edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}</div>
                      <div className="text-gray-500 text-xs mt-1">{edu.start_date} - {edu.currently_studying ? "Present" : edu.end_date}</div>
                    </div>
                  )}
                </DynamicItem>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-700 rounded-xl text-gray-400 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </button>
          </div>
        </Card>

        <Card title="Work Experience" onSave={handleSaveExperience} saving={savingExperience}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {experience.map((exp, index) => (
                <DynamicItem
                  key={index}
                  onDelete={() => setExperience(experience.filter((_, i) => i !== index))}
                  isEditing={editingExperience === index}
                  onToggleEdit={() => setEditingExperience(editingExperience === index ? null : index)}
                >
                  {editingExperience === index ? (
                    <div className="pr-16 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} className={inputClassName} placeholder="Company" />
                        <input type="text" value={exp.position} onChange={(e) => updateExperience(index, "position", e.target.value)} className={inputClassName} placeholder="Position" />
                        <input type="text" value={exp.location} onChange={(e) => updateExperience(index, "location", e.target.value)} className={inputClassName} placeholder="Location" />
                        <input type="text" value={exp.start_date} onChange={(e) => updateExperience(index, "start_date", e.target.value)} className={inputClassName} placeholder="Start Date" />
                        <input type="text" value={exp.end_date} onChange={(e) => updateExperience(index, "end_date", e.target.value)} className={inputClassName} placeholder="End Date" />
                      </div>
                      <textarea value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} className={`${inputClassName} resize-none min-h-[60px]`} placeholder="Description" />
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input type="checkbox" checked={exp.currently_working} onChange={(e) => updateExperience(index, "currently_working", e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-transparent text-cyan-400" />
                        Currently working
                      </label>
                    </div>
                  ) : (
                    <div className="pr-16">
                      <div className="font-medium text-white text-sm">{exp.position || "Position"}</div>
                      <div className="text-gray-400 text-xs">{exp.company || "Company"}</div>
                      <div className="text-gray-500 text-xs mt-1">{exp.start_date} - {exp.currently_working ? "Present" : exp.end_date}</div>
                    </div>
                  )}
                </DynamicItem>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addExperience}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-700 rounded-xl text-gray-400 text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}