"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("demo@skillstack.dev");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password. Try demo@skillstack.dev / demo1234");
      setLoading(false);
    } else if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-zinc-950 px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        {/* logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950">
            <Zap className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Skill Stack Field Guide</h1>
            <p className="mt-1 text-sm text-zinc-400">Sign in to your dashboard</p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/50 pl-10 pr-3 text-sm text-white outline-none transition focus:border-emerald-500/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950/50 pl-10 pr-3 text-sm text-white outline-none transition focus:border-emerald-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        {/* demo creds */}
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-center text-xs text-zinc-400">
          Demo credentials pre-filled: <code className="font-mono text-emerald-300">demo@skillstack.dev</code> / <code className="font-mono text-emerald-300">demo1234</code>
        </div>
      </motion.div>
    </div>
  );
}
