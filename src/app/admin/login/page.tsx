"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] px-4">
      <div className="scanline-overlay pointer-events-none fixed inset-0 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 p-10 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <span className="text-2xl font-bold text-black">&gt;_</span>
              </div>
            </motion.div>
            <h1 className="text-2xl font-semibold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-4 font-semibold text-black shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all hover:shadow-[0_0_35px_rgba(34,211,238,0.9)] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}