"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ---------- premium H logo as SVG ---------- */
function HLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hgrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* hexagon base with gradient */}
      <path d="M20 2L35.5 11V29L20 38L4.5 29V11L20 2Z" fill="url(#hgrad)" />
      <path d="M20 4.5L33.5 12.5V27.5L20 35.5L6.5 27.5V12.5L20 4.5Z" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
      {/* geometric H — two vertical bars + horizontal bar */}
      <rect x="13" y="12" width="3" height="16" rx="1.5" fill="white" filter="url(#glow)" />
      <rect x="24" y="12" width="3" height="16" rx="1.5" fill="white" filter="url(#glow)" />
      <rect x="13" y="18.5" width="14" height="3" rx="1.5" fill="white" filter="url(#glow)" />
    </svg>
  );
}

/* ---------- feature card ---------- */
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className={`group relative bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md dark:hover:bg-white/10 transition-all duration-500 animate-fade-in-up delay-${delay}`}
    >
      {/* subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
      <div className="text-3xl mb-4 relative">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 relative">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed relative">{desc}</p>
    </div>
  );
}

/* ---------- stats counter ---------- */
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  // restore theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-white overflow-x-hidden transition-colors">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HLogo size={36} />
            <span className="text-lg font-bold tracking-tight">
              H <span className="text-gray-400 font-normal">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/chat"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Chat
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link
              href="/chat"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        {/* animated gradient orbs */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse-soft pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] animate-pulse-soft pointer-events-none" style={{ animationDelay: "1s" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* left — text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-soft" />
                AI-Powered Assistant
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Intelligent AI Chat
                <br />
                <span className="text-purple-600 dark:text-purple-400">
                  for the Modern Age
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                Experience lightning-fast, natural conversations with cutting-edge AI.
                Built for speed, designed for beauty.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/chat"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-7 py-3 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 inline-flex items-center gap-2 group"
                >
                  Start Chatting
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/chat"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  Try it now
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* right — mock chat preview */}
            <div className="hidden lg:flex justify-center animate-float">
              <div className="w-full max-w-md bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-2xl dark:shadow-purple-500/5">
                {/* mock header */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-white/10 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                    H
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">H AI</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Online</span>
                  </span>
                </div>
                {/* mock messages */}
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[80%]">
                      Hello! How can I assist you today?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-purple-600 text-white text-sm rounded-2xl rounded-br-md px-3.5 py-2 max-w-[80%]">
                      What can you help me with?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[80%]">
                      I can answer questions, write content, explain concepts, and much more. Try asking me anything!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Excellence
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Every detail crafted to deliver a premium AI experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              desc="Real-time responses powered by optimized async infrastructure."
              delay={100}
            />
            <FeatureCard
              icon="🧠"
              title="Smart AI"
              desc="Cutting-edge language models for accurate, context-aware replies."
              delay={200}
            />
            <FeatureCard
              icon="🎨"
              title="Beautiful UI"
              desc="Premium design with dark mode, animations, and glassmorphism."
              delay={300}
            />
            <FeatureCard
              icon="🕐"
              title="Always Available"
              desc="24/7 uptime with automatic scaling and fault tolerance."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-3xl py-12 px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Conversations</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                99.9%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Uptime</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to experience the
            <br />
            <span className="text-purple-600 dark:text-purple-400">
              future of AI chat?
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start a conversation right now and see what H AI can do for you.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-300 shadow-2xl shadow-purple-500/30 text-lg group"
          >
            Start Chatting
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-200 dark:border-white/5 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <HLogo size={24} />
            <span>H AI</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} H AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
