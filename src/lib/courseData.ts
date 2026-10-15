import courseRaw from "@/data/courseData.json";
import { CourseData, LessonDetail, WeekSummary } from "./types";

const course = courseRaw as unknown as CourseData;

export function getCourseData(): CourseData {
  return course;
}

export function getAllLessons(): LessonDetail[] {
  return course.lessons;
}

export function getWeeksSummary(): WeekSummary[] {
  return course.weeks;
}

export function getLessonBySlug(slug: string): LessonDetail | undefined {
  // Normalize slug by removing leading/trailing slashes
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return course.lessons.find((l) => l.slug === cleanSlug);
}

export function getLessonById(id: number): LessonDetail | undefined {
  return course.lessons.find((l) => l.id === id);
}

export interface SearchResult {
  lesson: LessonDetail;
  matchedField: "title" | "section" | "objective" | "module";
  snippet: string;
}

export function searchCourseContent(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const lesson of course.lessons) {
    if (lesson.title.toLowerCase().includes(q)) {
      results.push({
        lesson,
        matchedField: "title",
        snippet: lesson.title,
      });
      continue;
    }

    if (lesson.moduleTitle.toLowerCase().includes(q)) {
      results.push({
        lesson,
        matchedField: "module",
        snippet: lesson.moduleTitle,
      });
      continue;
    }

    if (lesson.objective && lesson.objective.toLowerCase().includes(q)) {
      results.push({
        lesson,
        matchedField: "objective",
        snippet: lesson.objective.slice(0, 150) + "...",
      });
      continue;
    }

    // Check sections
    for (const sec of lesson.sections) {
      if (sec.title && sec.title.toLowerCase().includes(q)) {
        results.push({
          lesson,
          matchedField: "section",
          snippet: sec.title,
        });
        break;
      }
      if (sec.description_markdown && sec.description_markdown.toLowerCase().includes(q)) {
        const idx = sec.description_markdown.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const end = Math.min(sec.description_markdown.length, idx + 80);
        const snippet = (start > 0 ? "..." : "") + sec.description_markdown.slice(start, end).replace(/\n/g, " ") + "...";
        results.push({
          lesson,
          matchedField: "section",
          snippet,
        });
        break;
      }
    }
  }

  return results.slice(0, 12);
}
