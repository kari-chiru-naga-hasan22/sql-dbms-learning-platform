import React from "react";
import Link from "next/link";
import {
  Layers,
  Cpu,
  GitMerge,
  ShieldCheck,
  HardDrive,
  FileJson,
  BarChart3,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";
import { getCourseData } from "@/lib/courseData";

export default function Home() {
  const course = getCourseData();

  const anatomyShowcases = [
    {
      title: "B+ Tree Index Engine",
      desc: "Logarithmic pointer traversal versus sequential page I/O scans.",
      icon: Layers,
      color: "text-accent-brass",
      route: "/lesson/week-06/module-01/lesson-02",
    },
    {
      title: "Query Pipeline Engine",
      desc: "AST parsing, catalog resolution, cost optimizer, and Volcano iterators.",
      icon: Cpu,
      color: "text-accent-sage",
      route: "/lesson/week-02/module-02/lesson-02",
    },
    {
      title: "Relational JOIN Matcher",
      desc: "Interactive key matching across INNER, LEFT, RIGHT, FULL, and CROSS joins.",
      icon: GitMerge,
      color: "text-accent-orange",
      route: "/lesson/week-02/module-01/lesson-01",
    },
    {
      title: "ACID & WAL State Machine",
      desc: "RAM buffer dirty pages, append-only WAL logs, and ARIES crash recovery.",
      icon: ShieldCheck,
      color: "text-accent-brass",
      route: "/lesson/week-01/module-02/lesson-04",
    },
    {
      title: "Slotted-Page Storage",
      desc: "8KB block architecture with downward slot pointers and upward tuple payloads.",
      icon: HardDrive,
      color: "text-accent-slate",
      route: "/lesson/week-01/module-02/lesson-02",
    },
    {
      title: "Normalization Rig",
      desc: "Decomposition from UNF through 1NF, 2NF, and 3NF to eliminate anomalies.",
      icon: Sparkles,
      color: "text-accent-orange",
      route: "/lesson/week-01/module-02/lesson-01",
    },
    {
      title: "MongoDB BSON Simulator",
      desc: "Schema-flexible documents and multi-stage aggregation pipeline transforms.",
      icon: FileJson,
      color: "text-accent-sage",
      route: "/lesson/week-02/module-02/lesson-04",
    },
    {
      title: "Power BI & DAX Studio",
      desc: "Star Schema dimensional cross-filtering and live DAX measure calculation.",
      icon: BarChart3,
      color: "text-accent-brass",
      route: "/lesson/week-04/module-01/lesson-03",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-sans space-y-12">
      {/* Hero Header Banner */}
      <section className="bg-paper border border-border-warm rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas border border-border-warm text-xs font-mono text-ink-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-sage animate-pulse" />
            <span>Complete 10-Week / 18-Module Interactive Laboratory</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink leading-tight mb-4">
            SQL & Database Management Systems
          </h1>

          <p className="text-base md:text-lg text-ink-muted font-sans leading-relaxed mb-6">
            Master relational schema design, query optimization, indexing algorithms, transaction guarantees, and analytical pipelines through direct interaction and live WebAssembly SQLite execution.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/lesson/week-01/module-01/lesson-01"
              className="flex items-center gap-2 px-5 py-2.5 bg-ink text-paper text-xs font-mono font-bold rounded-lg hover:bg-ink-muted transition-all shadow-sm"
            >
              Start Course (Lesson 1)
              <ArrowRight className="w-4 h-4 text-accent-brass" />
            </Link>

            <Link
              href="/lesson/week-02/module-01/lesson-01"
              className="flex items-center gap-2 px-4 py-2.5 bg-canvas border border-border-warm text-ink text-xs font-mono font-semibold rounded-lg hover:border-ink-muted transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-accent-orange" />
              Jump to SQL Queries & JOINs
            </Link>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full border-l border-dashed border-ink grid grid-cols-4 grid-rows-4" />
        </div>
      </section>

      {/* Global Curriculum Metrics Ribbon */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        <div className="bg-paper border border-border-warm rounded-xl p-4 shadow-sm">
          <div className="text-[10px] uppercase text-ink-muted">Total Weeks</div>
          <div className="text-2xl font-serif font-bold text-ink mt-1">10</div>
          <div className="text-[11px] text-accent-sage mt-0.5">Weeks 1 — 10 Complete</div>
        </div>
        <div className="bg-paper border border-border-warm rounded-xl p-4 shadow-sm">
          <div className="text-[10px] uppercase text-ink-muted">Total Modules</div>
          <div className="text-2xl font-serif font-bold text-ink mt-1">18</div>
          <div className="text-[11px] text-accent-brass mt-0.5">Full LMS Curriculum</div>
        </div>
        <div className="bg-paper border border-border-warm rounded-xl p-4 shadow-sm">
          <div className="text-[10px] uppercase text-ink-muted">Dedicated Sub-modules</div>
          <div className="text-2xl font-serif font-bold text-accent-orange mt-1">89</div>
          <div className="text-[11px] text-ink-muted mt-0.5">Individual Routes</div>
        </div>
        <div className="bg-paper border border-border-warm rounded-xl p-4 shadow-sm">
          <div className="text-[10px] uppercase text-ink-muted">Technical Diagrams</div>
          <div className="text-2xl font-serif font-bold text-ink mt-1">138</div>
          <div className="text-[11px] text-accent-sage mt-0.5">PNG Architectural Assets</div>
        </div>
        <div className="bg-paper border border-border-warm rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="text-[10px] uppercase text-ink-muted">SQL Execution</div>
          <div className="text-2xl font-serif font-bold text-accent-sage mt-1">WASM</div>
          <div className="text-[11px] text-ink-muted mt-0.5">Zero-Latency Client-Side</div>
        </div>
      </section>

      {/* Interactive Anatomy Showcase Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-ink">
              Interactive Anatomy Showcase
            </h2>
            <p className="text-xs font-mono text-ink-muted mt-0.5">
              Experience core database algorithms through dedicated visualizer rigs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {anatomyShowcases.map((showcase) => {
            const Icon = showcase.icon;
            return (
              <Link
                key={showcase.title}
                href={showcase.route}
                className="bg-paper border border-border-warm rounded-xl p-4 hover:border-ink-muted transition-all group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-2 rounded-lg bg-canvas ${showcase.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-ink-faint group-hover:translate-x-1 group-hover:text-ink transition-all" />
                  </div>
                  <h3 className="text-sm font-serif font-bold text-ink mb-1 group-hover:text-accent-orange transition-colors">
                    {showcase.title}
                  </h3>
                  <p className="text-xs font-sans text-ink-muted leading-relaxed">
                    {showcase.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-border-warm/60 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span>Interactive Rig</span>
                  <span className="text-accent-brass font-bold">Launch →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Full 10-Week Curriculum Map */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-ink">
            Complete 10-Week Curriculum Map
          </h2>
          <p className="text-xs font-mono text-ink-muted mt-0.5">
            Every module and sub-module has its own dedicated page with notes, diagrams, and labs.
          </p>
        </div>

        <div className="space-y-6">
          {course.weeks.map((week) => (
            <div
              key={week.weekNumber}
              className="bg-paper border border-border-warm rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-border-warm">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold bg-canvas text-accent-orange border border-border-warm px-2.5 py-1 rounded">
                    Week 0{week.weekNumber}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-ink">
                    {week.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-muted">
                  {week.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Sub-modules
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {week.modules.map((mod) => (
                  <div
                    key={mod.moduleId}
                    className="border border-border-warm/70 rounded-lg p-4 bg-canvas/40"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-accent-brass">
                        Module {mod.overallOrder}
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted">
                        {mod.lessons.length} Lessons
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-ink mb-1">
                      {mod.title}
                    </h4>

                    {mod.description && (
                      <p className="text-xs font-sans text-ink-muted mb-3 line-clamp-2">
                        {mod.description}
                      </p>
                    )}

                    <div className="space-y-1 pt-2 border-t border-border-warm/50">
                      {mod.lessons.map((lesson) => (
                        <Link
                          key={lesson.slug}
                          href={`/lesson/${lesson.slug}`}
                          className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-paper transition-colors group text-xs font-sans text-ink"
                        >
                          <span className="truncate pr-2">
                            <span className="font-mono text-ink-muted mr-1.5 text-[11px]">
                              {lesson.lessonNumber}.
                            </span>
                            <span className="group-hover:text-accent-orange transition-colors">
                              {lesson.title}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-ink-muted uppercase shrink-0">
                            {lesson.interactiveType === "sql-lab" ? "SQL" : "Rig"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
