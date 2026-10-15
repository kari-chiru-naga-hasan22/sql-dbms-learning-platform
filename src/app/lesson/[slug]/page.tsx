import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLessons, getLessonBySlug } from "@/lib/courseData";
import { LessonViewer } from "@/components/lesson/LessonViewer";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((l) => ({
    slug: l.slug,
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lesson = getLessonBySlug(resolvedParams.slug);
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

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const lesson = getLessonBySlug(resolvedParams.slug);

  if (!lesson) {
    notFound();
  }

  return <LessonViewer lesson={lesson} />;
}
