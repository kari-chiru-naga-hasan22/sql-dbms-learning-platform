"use client";

export interface ProgressState {
  completedLessons: string[]; // slugs
  bookmarkedLessons: string[]; // slugs
  quizScores: Record<string, { score: number; total: number; passed: boolean }>; // slug -> score
  lastVisitedSlug?: string;
  notes?: Record<string, string>; // slug -> student notes
}

const STORAGE_KEY = "sql_learning_platform_progress_v1";

export function getProgress(): ProgressState {
  if (typeof window === "undefined") {
    return {
      completedLessons: [],
      bookmarkedLessons: [],
      quizScores: {},
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedLessons: [],
        bookmarkedLessons: [],
        quizScores: {},
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      completedLessons: [],
      bookmarkedLessons: [],
      quizScores: {},
    };
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("storage-progress-update"));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
}

export function markLessonCompleted(slug: string, completed: boolean = true): ProgressState {
  const current = getProgress();
  const set = new Set(current.completedLessons);
  if (completed) {
    set.add(slug);
  } else {
    set.delete(slug);
  }
  const next: ProgressState = {
    ...current,
    completedLessons: Array.from(set),
    lastVisitedSlug: slug,
  };
  saveProgress(next);
  return next;
}

export function toggleBookmark(slug: string): boolean {
  const current = getProgress();
  const set = new Set(current.bookmarkedLessons);
  let isBookmarked = false;
  if (set.has(slug)) {
    set.delete(slug);
    isBookmarked = false;
  } else {
    set.add(slug);
    isBookmarked = true;
  }
  saveProgress({
    ...current,
    bookmarkedLessons: Array.from(set),
  });
  return isBookmarked;
}

export function recordQuizScore(slug: string, score: number, total: number): ProgressState {
  const current = getProgress();
  const passed = total > 0 ? (score / total) >= 0.7 : true;
  const next: ProgressState = {
    ...current,
    quizScores: {
      ...current.quizScores,
      [slug]: { score, total, passed },
    },
  };
  if (passed) {
    const set = new Set(next.completedLessons);
    set.add(slug);
    next.completedLessons = Array.from(set);
  }
  saveProgress(next);
  return next;
}

export function setLastVisited(slug: string): void {
  const current = getProgress();
  saveProgress({ ...current, lastVisitedSlug: slug });
}

export function isLessonCompleted(slug: string): boolean {
  const current = getProgress();
  return current.completedLessons.includes(slug);
}

export function isLessonBookmarked(slug: string): boolean {
  const current = getProgress();
  return current.bookmarkedLessons.includes(slug);
}
