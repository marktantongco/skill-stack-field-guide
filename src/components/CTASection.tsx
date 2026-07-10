"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Github, Terminal, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CTAS = [
  { label: "View source", href: "https://github.com/marktantongco/skill-stack-field-guide", icon: Github, desc: "Full code on GitHub" },
  { label: "Try the SaaS", href: "/login", icon: Terminal, desc: "demo@skillstack.dev / demo1234" },
  { label: "21st.dev registry", href: "https://21st.dev/marktantongco", icon: ExternalLink, desc: "Published components" },
];

function CopyCmd({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4 transition hover:border-emerald-500/40"
    >
      <code className="break-all font-mono text-sm text-emerald-300">$ {cmd}</code>
      <span className="shrink-0 text-zinc-400 group-hover:text-emerald-300">
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </span>
    </button>
  );
}

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const items = ref.current?.querySelectorAll(".cta-item");
    items?.forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "expo.out",
        delay: i * 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative overflow-hidden bg-zinc-950 px-5 py-32">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/70"
        >
          Act 5 — the call
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          The system is live.
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Use it. Fork it. Ship it.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-base text-zinc-400"
        >
          A 5-layer SaaS: components → dashboard → controls → backend → auth.
          Built on Next.js 16, Prisma, Neon Postgres, NextAuth.js. Every layer
          consumes the previous. Every interaction is real.
        </motion.p>

        {/* CTA items */}
        <div className="cta-item mt-12 grid gap-3 sm:grid-cols-3">
          {CTAS.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-emerald-500/40 hover:bg-white/[0.05]"
              >
                <Icon className="mb-3 h-5 w-5 text-emerald-300" />
                <div className="flex items-center gap-1 text-sm font-semibold text-white">
                  {c.label}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
                <div className="mt-1 text-xs text-zinc-500">{c.desc}</div>
              </a>
            );
          })}
        </div>

        {/* quick commands */}
        <div className="cta-item mt-8 space-y-2 text-left">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Quick start</div>
          <CopyCmd cmd="git clone https://github.com/marktantongco/skill-stack-field-guide.git" />
          <CopyCmd cmd="cd skill-stack-field-guide && bun install && bun run db:push && bun run dev" />
        </div>

        {/* footer line */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 border-t border-white/5 pt-8 text-xs text-zinc-600"
        >
          Built in Manila 🇵🇭 · Deployed globally · Next.js 16 · Prisma · Neon · Vercel · NextAuth
        </motion.div>
      </div>
    </section>
  );
}
