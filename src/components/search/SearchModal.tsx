"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight } from "lucide-react";
import { searchCourseContent, SearchResult } from "@/lib/courseData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const hits = searchCourseContent(query);
    setResults(hits);
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(`/lesson/${results[selectedIndex].lesson.slug}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="w-full max-w-2xl bg-paper border border-border-warm rounded-xl shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="p-3.5 border-b border-border-warm flex items-center gap-3 bg-canvas">
          <Search className="w-4 h-4 text-accent-brass shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 89 lessons, SQL syntax, indexes, transactions, normalization..."
            className="w-full bg-transparent text-sm font-sans text-ink placeholder:text-ink-muted/60 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-ink-muted hover:text-ink hover:bg-paper"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-xs font-mono text-ink-muted">
              Type to search across 10 weeks, 18 modules, and 89 dedicated lessons.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-ink-muted">
              No matching lessons found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const lesson = item.lesson;
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={lesson.slug}
                    onClick={() => {
                      router.push(`/lesson/${lesson.slug}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-canvas border border-accent-brass"
                        : "hover:bg-canvas/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
                      <span>
                        Week {lesson.weekNumber} • Module {lesson.overallOrder}
                      </span>
                      <span className="text-[10px] uppercase bg-paper px-1.5 py-0.5 rounded border border-border-warm">
                        {item.matchedField}: {lesson.interactiveType}
                      </span>
                    </div>
                    <div className="text-sm font-serif font-bold text-ink flex items-center justify-between">
                      <span>{lesson.title}</span>
                      <ChevronRight className="w-4 h-4 text-ink-faint" />
                    </div>
                    <p className="text-xs text-ink-muted line-clamp-1 mt-1 font-sans">
                      {item.snippet}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="px-4 py-2 bg-canvas border-t border-border-warm flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>89 Lessons Indexed</span>
        </div>
      </div>
    </div>
  );
}
