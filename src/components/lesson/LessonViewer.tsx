"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Code2,
  Cpu,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { LessonDetail } from "@/lib/types";
import {
  isLessonCompleted,
  isLessonBookmarked,
  markLessonCompleted,
  toggleBookmark,
  setLastVisited,
} from "@/lib/progress";

// Visualizer imports
import { SqlLab } from "@/components/sql/SqlLab";
import { AnatomyBTree } from "@/components/anatomy/AnatomyBTree";
import { AnatomyPipeline } from "@/components/anatomy/AnatomyPipeline";
import { AnatomyJoin } from "@/components/anatomy/AnatomyJoin";
import { AnatomyTransaction } from "@/components/anatomy/AnatomyTransaction";
import { AnatomyStorage } from "@/components/anatomy/AnatomyStorage";
import { AnatomyNormalization } from "@/components/anatomy/AnatomyNormalization";
import { NoSqlVisualizer } from "@/components/visualizers/NoSqlVisualizer";
import { PowerBiVisualizer } from "@/components/visualizers/PowerBiVisualizer";
import { AssessmentCard } from "@/components/lesson/AssessmentCard";

interface LessonViewerProps {
  lesson: LessonDetail;
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const [completed, setCompleted] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [activeTabs, setActiveTabs] = useState<Record<number, number>>({});
  const [showSqlLabToggle, setShowSqlLabToggle] = useState<boolean>(false);

  useEffect(() => {
    setCompleted(isLessonCompleted(lesson.slug));
    setBookmarked(isLessonBookmarked(lesson.slug));
    setLastVisited(lesson.slug);
  }, [lesson.slug]);

  const handleToggleComplete = () => {
    const nextState = !completed;
    setCompleted(nextState);
    markLessonCompleted(lesson.slug, nextState);
  };

  const handleToggleBookmark = () => {
    const next = toggleBookmark(lesson.slug);
    setBookmarked(next);
  };

  // Render the primary interactive visualizer for this lesson
  const renderInteractiveComponent = () => {
    switch (lesson.interactiveType) {
      case "anatomy-btree":
        return <AnatomyBTree />;
      case "anatomy-pipeline":
        return <AnatomyPipeline />;
      case "anatomy-join":
        return <AnatomyJoin />;
      case "anatomy-transaction":
        return <AnatomyTransaction />;
      case "anatomy-storage":
        return <AnatomyStorage />;
      case "anatomy-normalization":
        return <AnatomyNormalization />;
      case "nosql-simulator":
        return <NoSqlVisualizer />;
      case "powerbi-dashboard":
        return <PowerBiVisualizer />;
      case "sql-lab":
      default:
        return (
          <SqlLab
            initialQuery={lesson.labConfig.defaultQuery}
            sampleQueries={lesson.labConfig.sampleQueries}
            targetDatabase={lesson.labConfig.targetDatabase}
            title={`Interactive SQL Studio — ${lesson.title}`}
          />
        );
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-1.5 text-xs font-mono text-ink-muted mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-ink transition-colors">
          Curriculum
        </Link>
        <ChevronRight className="w-3 h-3 text-ink-faint" />
        <span>Week {lesson.weekNumber}</span>
        <ChevronRight className="w-3 h-3 text-ink-faint" />
        <span className="truncate max-w-[200px]" title={lesson.moduleTitle}>
          {lesson.moduleTitle}
        </span>
        <ChevronRight className="w-3 h-3 text-ink-faint" />
        <span className="text-ink font-bold truncate max-w-[240px]">
          Lesson {lesson.lessonNumber}: {lesson.title}
        </span>
      </nav>

      {/* Main Lesson Header Card */}
      <div className="bg-paper border border-border-warm rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-canvas text-accent-brass border border-border-warm px-2.5 py-1 rounded">
              Module {lesson.overallOrder} • Lesson {lesson.lessonNumber}
            </span>
            <span className="text-xs font-mono text-ink-muted bg-canvas border border-border-warm px-2.5 py-1 rounded capitalize">
              {lesson.type}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded border transition-colors ${
                bookmarked
                  ? "bg-accent-brass/20 border-accent-brass text-accent-brass"
                  : "bg-canvas border-border-warm text-ink-muted hover:text-ink"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold border transition-colors ${
                completed
                  ? "bg-accent-sage/20 border-accent-sage text-accent-sage"
                  : "bg-ink text-paper border-ink hover:bg-ink-muted"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {completed ? "Completed" : "Mark as Completed"}
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink mb-3 leading-tight">
          {lesson.title}
        </h1>

        {lesson.objective && (
          <div className="p-3 bg-canvas rounded border border-border-warm text-xs text-ink-muted font-sans flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-accent-brass shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-mono text-[11px] block uppercase">
                Learning Objective
              </strong>
              {lesson.objective}
            </div>
          </div>
        )}
      </div>

      {/* Primary Interactive Simulation / Lab Rig */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-accent-brass" />
            Interactive Learning Rig
          </h2>
          {lesson.interactiveType !== "sql-lab" && (
            <button
              onClick={() => setShowSqlLabToggle(!showSqlLabToggle)}
              className="text-xs font-mono text-accent-orange hover:underline flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showSqlLabToggle ? "Hide SQL Execution Sandbox" : "Open SQL Execution Sandbox"}
            </button>
          )}
        </div>

        {renderInteractiveComponent()}

        {/* Optional Secondary SQL Lab Drawer if requested by learner */}
        {showSqlLabToggle && lesson.interactiveType !== "sql-lab" && (
          <div className="mt-6 border-t-2 border-dashed border-border-warm pt-6">
            <SqlLab
              initialQuery={lesson.labConfig.defaultQuery}
              sampleQueries={lesson.labConfig.sampleQueries}
              targetDatabase={lesson.labConfig.targetDatabase}
              title={`SQL Lab Sandbox — ${lesson.title}`}
            />
          </div>
        )}
      </section>

      {/* Structured Content Sections & Tabs */}
      <section className="space-y-8 mb-12">
        {lesson.sections.map((section, sIdx) => {
          const activeTabIdx = activeTabs[sIdx] || 0;
          return (
            <div
              key={sIdx}
              className="bg-paper border border-border-warm rounded-lg p-6 shadow-sm"
            >
              {section.title && (
                <h3 className="text-lg font-serif font-bold text-ink mb-3 pb-2 border-b border-border-warm flex items-center gap-2">
                  <span className="text-xs font-mono text-accent-brass">§{sIdx + 1}</span>
                  {section.title}
                </h3>
              )}

              {/* Section Markdown Description */}
              {section.description_markdown && (
                <div className="text-sm font-sans text-ink leading-relaxed mb-4 whitespace-pre-wrap">
                  {section.description_markdown}
                </div>
              )}

              {/* Sub-tabs if available */}
              {section.tabs && section.tabs.length > 0 && (
                <div className="mt-4 border border-border-warm rounded-lg overflow-hidden bg-canvas">
                  <div className="flex border-b border-border-warm bg-paper overflow-x-auto">
                    {section.tabs.map((tab, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() =>
                          setActiveTabs({ ...activeTabs, [sIdx]: tIdx })
                        }
                        className={`px-3 py-2 text-xs font-mono font-semibold border-r border-border-warm transition-colors whitespace-nowrap ${
                          activeTabIdx === tIdx
                            ? "bg-canvas text-accent-orange border-b-2 border-b-accent-orange"
                            : "text-ink-muted hover:text-ink hover:bg-canvas/50"
                        }`}
                      >
                        {tab.tab_title}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 text-xs font-sans text-ink leading-relaxed whitespace-pre-wrap">
                    {section.tabs[activeTabIdx]?.tab_content_markdown}
                  </div>
                </div>
              )}

              {/* Resources & High-Res Diagram Assets */}
              {section.resources && section.resources.length > 0 && (
                <div className="mt-6 space-y-4">
                  {section.resources.map((res, rIdx) => {
                    if (res.type === "image") {
                      return (
                        <div
                          key={rIdx}
                          className="border border-border-warm rounded-lg overflow-hidden bg-canvas p-2"
                        >
                          <div className="text-[10px] font-mono text-ink-muted mb-1 px-1 flex items-center justify-between">
                            <span>Technical Diagram Asset: {res.filename}</span>
                            <span className="text-accent-sage uppercase">{res.type}</span>
                          </div>
                          <div className="relative w-full aspect-video bg-paper rounded overflow-hidden flex items-center justify-center border border-border-warm/50">
                            <img
                              src={`/images/${res.filename}`}
                              alt={res.filename}
                              className="max-h-full max-w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Module Assessment Card if questions available */}
      {lesson.assessment && lesson.assessment.questions.length > 0 && (
        <section className="mb-12">
          <AssessmentCard
            lessonSlug={lesson.slug}
            assessment={lesson.assessment}
          />
        </section>
      )}

      {/* Navigation Footer (Prev / Next Lesson Links) */}
      <footer className="pt-6 border-t border-border-warm flex flex-wrap items-center justify-between gap-4">
        {lesson.prevSlug ? (
          <Link
            href={`/lesson/${lesson.prevSlug}`}
            className="flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-ink p-3 rounded-lg border border-border-warm hover:border-ink-muted transition-all bg-paper group max-w-[280px]"
          >
            <ArrowLeft className="w-4 h-4 text-accent-brass group-hover:-translate-x-1 transition-transform" />
            <div className="text-left truncate">
              <span className="text-[10px] text-ink-faint uppercase block">Previous Lesson</span>
              <span className="font-bold truncate block">{lesson.prevTitle}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {lesson.nextSlug ? (
          <Link
            href={`/lesson/${lesson.nextSlug}`}
            className="flex items-center gap-2 text-xs font-mono text-ink hover:text-accent-orange p-3 rounded-lg border border-border-warm hover:border-accent-orange transition-all bg-paper group max-w-[280px]"
          >
            <div className="text-right truncate">
              <span className="text-[10px] text-ink-faint uppercase block">Next Lesson</span>
              <span className="font-bold truncate block">{lesson.nextTitle}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-accent-brass group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper text-xs font-mono font-bold rounded-lg hover:bg-ink-muted transition-all"
          >
            Course Complete! Return to Overview
          </Link>
        )}
      </footer>
    </article>
  );
}
