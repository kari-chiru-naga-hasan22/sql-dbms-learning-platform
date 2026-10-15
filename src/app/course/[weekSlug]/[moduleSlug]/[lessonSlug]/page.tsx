import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLessons, getLessonBySlug } from "@/lib/courseData";
import { LessonViewer } from "@/components/lesson/LessonViewer";

interface CourseLessonPageProps {
  params: Promise<{
    weekSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((l) => {
    const weekSlug = `week-${String(l.weekNumber).padStart(2, "0")}`;
    const moduleSlug = `module-${String(l.moduleNumber).padStart(2, "0")}`;
    const lessonSlug = `lesson-${String(l.lessonNumber).padStart(2, "0")}`;
    return { weekSlug, moduleSlug, lessonSlug };
  });
}

export async function generateMetadata({ params }: CourseLessonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const fullSlug = `${resolvedParams.weekSlug}-${resolvedParams.moduleSlug}-${resolvedParams.lessonSlug}`;
  const lesson = getLessonBySlug(fullSlug);
  if (!lesson) {
    return {
      title: "Lesson Not Found | SQL & DBMS Studio",
    };
  }
  return {
    title: `${lesson.title} | SQL & DBMS Interactive Studio`,
    description: lesson.objective || `Learn ${lesson.title} in Week ${lesson.weekNumber}`,
  };
}

export default async function CourseLessonPage({ params }: CourseLessonPageProps) {
  const resolvedParams = await params;
  const fullSlug = `${resolvedParams.weekSlug}-${resolvedParams.moduleSlug}-${resolvedParams.lessonSlug}`;
  const lesson = getLessonBySlug(fullSlug);

  if (!lesson) {
    notFound();
  }

  return <LessonViewer lesson={lesson} />;
}
