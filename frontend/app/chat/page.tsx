"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ---------- premium H logo as SVG ---------- */
function HLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hgrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M20 2L35.5 11V29L20 38L4.5 29V11L20 2Z" fill="url(#hgrad)" />
      <path d="M20 4.5L33.5 12.5V27.5L20 35.5L6.5 27.5V12.5L20 4.5Z" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
      <rect x="13" y="12" width="3" height="16" rx="1.5" fill="white" />
      <rect x="24" y="12" width="3" height="16" rx="1.5" fill="white" />
      <rect x="13" y="18.5" width="14" height="3" rx="1.5" fill="white" />
    </svg>
  );
}

// API URL: set NEXT_PUBLIC_API_URL env var for production (e.g. "/api/backend"), falls back to localhost for dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  // quick suggestions shown in the empty state
  const suggestions = [
    "What can you help me with?",
    "Tell me a fun fact",
    "Explain AI in simple terms",
    "Write a short poem",
  ];

  async function handleSubmit(q?: string) {
    const msg = q || text;
    if (!msg.trim()) return;
    setText("");
    setMessages((prev) => [...prev, { from: "user", text: msg }]);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Error: Could not reach the server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0a0a0f] transition-colors">

      {/* header - top bar with branding */}
      <header className="sticky top-0 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-3 px-5 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <HLogo size={34} />
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              H <span className="text-gray-400 font-normal">AI</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse-soft"></span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400">Online</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors hidden sm:block"
          >
            Home
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
        </div>
      </header>

      {/* chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
        {messages.length === 0 && !loading ? (
          // empty state - shown when no messages exist
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-500/10">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to H AI</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Your intelligent assistant. Ask me anything!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end gap-2 animate-fade-in-up`}
                style={{ animationDelay: "0ms" }}
              >
                {msg.from === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-lg shadow-purple-500/20">
                    H
                  </div>
                )}
                {msg.from === "user" ? (
                  <div className="max-w-[75%] px-4 py-2.5 leading-relaxed bg-purple-600 text-white rounded-2xl rounded-br-md text-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[75%] px-4 py-2.5 leading-relaxed bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-200 rounded-2xl rounded-bl-md text-sm [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-gray-200 dark:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-gray-200 dark:bg-white/5 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:text-xs [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-purple-600 dark:text-purple-400 [&_a]:underline">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
                {msg.from === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[10px] font-bold shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            {loading && (
              // typing indicator with bouncing dots
              <div className="flex justify-start items-end gap-2 animate-fade-in-up">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  H
                </div>
                <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl rounded-bl-md px-5 py-3.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input area */}
      <div className="border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0f] px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-400 dark:placeholder-gray-600 transition-all text-sm"
            maxLength={500}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!text.trim() || loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white p-3 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
