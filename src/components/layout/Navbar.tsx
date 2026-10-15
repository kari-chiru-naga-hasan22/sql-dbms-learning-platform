"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Database, CheckCircle2, Menu, X } from "lucide-react";
import { getProgress, ProgressState } from "@/lib/progress";
import { SearchModal } from "@/components/search/SearchModal";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    completedLessons: [],
    bookmarkedLessons: [],
    quizScores: {},
  });

  const updateProgress = () => {
    setProgress(getProgress());
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener("storage-progress-update", updateProgress);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("storage-progress-update", updateProgress);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const totalLessons = 89;
  const completedCount = progress.completedLessons.length;
  const pct = Math.round((completedCount / totalLessons) * 100);

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-border-warm font-sans">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-ink text-paper flex items-center justify-center font-mono font-bold text-sm shadow-sm group-hover:bg-accent-orange transition-colors">
              <Database className="w-4 h-4 text-accent-brass" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-serif font-bold text-ink leading-none">
                SQL & DBMS Studio
              </span>
              <span className="text-[10px] font-mono text-ink-muted leading-tight mt-0.5">
                10-Week Complete Technical Curriculum
              </span>
            </div>
          </Link>

          {/* Quick Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-canvas border border-border-warm text-xs font-mono text-ink-muted hover:border-ink-muted hover:text-ink transition-all w-72"
          >
            <Search className="w-3.5 h-3.5 text-accent-brass" />
            <span className="flex-1 text-left">Search 89 lessons...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-paper border border-border-warm text-[10px] font-mono">
              Ctrl K
            </kbd>
          </button>

          {/* Progress & Quick Links */}
          <div className="flex items-center gap-3">
            {/* Progress Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-canvas border border-border-warm text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-sage" />
              <span className="text-ink font-semibold">
                {completedCount}/{totalLessons}
              </span>
              <span className="text-ink-muted">({pct}%)</span>
              <div className="w-12 h-1.5 bg-border-warm rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-accent-sage transition-all duration-300 rounded-full"
                />
              </div>
            </div>

            {/* Curriculum Hub Link */}
            <Link
              href="/"
              className="text-xs font-mono text-ink hover:text-accent-orange px-2.5 py-1 rounded hover:bg-canvas transition-colors hidden md:block"
            >
              Curriculum Map
            </Link>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded text-ink-muted hover:text-ink hover:bg-canvas"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-ink-muted hover:text-ink hover:bg-canvas"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-warm bg-paper px-4 py-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1 border-b border-border-warm/50">
              <span className="text-ink-muted">Progress:</span>
              <span className="font-bold text-accent-sage">
                {completedCount} / {totalLessons} Lessons ({pct}%)
              </span>
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-ink hover:text-accent-orange"
            >
              Curriculum Overview & Roadmap
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
