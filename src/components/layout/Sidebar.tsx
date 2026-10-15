"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { WeekSummary } from "@/lib/types";
import { getProgress } from "@/lib/progress";

interface SidebarProps {
  weeks: WeekSummary[];
}

export function Sidebar({ weeks }: SidebarProps) {
  const pathname = usePathname();
  const [filterText, setFilterText] = useState("");
  const [openWeeks, setOpenWeeks] = useState<Record<number, boolean>>({ 1: true });
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  const refreshProgress = () => {
    const p = getProgress();
    setCompletedSlugs(p.completedLessons);
  };

  useEffect(() => {
    refreshProgress();
    window.addEventListener("storage-progress-update", refreshProgress);
    return () => window.removeEventListener("storage-progress-update", refreshProgress);
  }, []);

  // Automatically expand the week corresponding to current path
  useEffect(() => {
    weeks.forEach((w) => {
      w.modules.forEach((m) => {
        m.lessons.forEach((l) => {
          if (pathname.includes(l.slug)) {
            setOpenWeeks((prev) => ({ ...prev, [w.weekNumber]: true }));
          }
        });
      });
    });
  }, [pathname, weeks]);

  const toggleWeek = (num: number) => {
    setOpenWeeks((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <aside className="w-80 shrink-0 border-r border-border-warm bg-paper h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col font-sans select-none">
      {/* Sidebar Filter Input */}
      <div className="p-3 border-b border-border-warm bg-canvas/40">
        <div className="relative">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter curriculum..."
            className="w-full pl-8 pr-3 py-1.5 bg-paper border border-border-warm rounded text-xs font-mono text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-brass"
          />
          <Filter className="w-3.5 h-3.5 text-accent-brass absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Week & Module Tree View */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-2">
        {weeks.map((week) => {
          const isOpen = openWeeks[week.weekNumber] ?? false;

          // Check if any lesson matches filter
          const matchesFilter = (title: string) =>
            filterText.trim() === "" ||
            title.toLowerCase().includes(filterText.toLowerCase());

          const hasVisibleLessons = week.modules.some((m) =>
            m.lessons.some((l) => matchesFilter(l.title) || matchesFilter(m.title))
          );

          if (filterText && !hasVisibleLessons) return null;

          return (
            <div
              key={week.weekNumber}
              className="rounded-lg border border-border-warm/60 bg-paper overflow-hidden"
            >
              {/* Week Accordion Header */}
              <button
                onClick={() => toggleWeek(week.weekNumber)}
                className="w-full px-3 py-2 bg-canvas/50 hover:bg-canvas flex items-center justify-between text-left transition-colors border-b border-border-warm/40"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-orange bg-paper px-1.5 py-0.5 rounded border border-border-warm">
                    W0{week.weekNumber}
                  </span>
                  <span className="text-xs font-serif font-bold text-ink truncate max-w-[170px]">
                    {week.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                )}
              </button>

              {/* Modules & Lessons */}
              {isOpen && (
                <div className="p-1 space-y-2">
                  {week.modules.map((mod) => (
                    <div key={mod.moduleId} className="space-y-0.5">
                      {/* Module Title */}
                      <div className="px-2 pt-1.5 pb-0.5 text-[10px] font-mono text-accent-brass uppercase font-bold tracking-wider truncate">
                        Mod {mod.overallOrder}: {mod.title}
                      </div>

                      {/* Lesson Links */}
                      {mod.lessons.map((lesson) => {
                        if (!matchesFilter(lesson.title) && !matchesFilter(mod.title)) {
                          return null;
                        }

                        const isActive = pathname.includes(lesson.slug);
                        const isCompleted = completedSlugs.includes(lesson.slug);

                        return (
                          <Link
                            key={lesson.slug}
                            href={`/lesson/${lesson.slug}`}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors group ${
                              isActive
                                ? "bg-accent-orange/10 text-accent-orange font-semibold border border-accent-orange/30"
                                : "text-ink hover:bg-canvas hover:text-ink"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate pr-2">
                              <span className="text-[10px] font-mono text-ink-muted">
                                {lesson.lessonNumber}.
                              </span>
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent-sage shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-border-warm group-hover:bg-accent-brass shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border-warm bg-canvas/30 text-[11px] font-mono text-ink-muted flex items-center justify-between">
        <span>89 Dedicated Routes</span>
        <span className="text-accent-sage font-bold">WASM SQLite Ready</span>
      </div>
    </aside>
  );
}
