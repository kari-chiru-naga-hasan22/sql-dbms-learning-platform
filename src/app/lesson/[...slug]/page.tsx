import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLessons, getLessonBySlug } from "@/lib/courseData";
import { LessonViewer } from "@/components/lesson/LessonViewer";

interface LessonPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  const params: { slug: string[] }[] = [];
  for (const l of lessons) {
    const parts = l.slug.split("/").filter(Boolean);
    params.push({ slug: parts });
    params.push({ slug: [parts.join("-")] });
  }
  return params;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugJoined = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.join("-")
    : resolvedParams.slug;
  const lesson = getLessonBySlug(slugJoined);
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
  const slugJoined = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.join("-")
    : resolvedParams.slug;
  const lesson = getLessonBySlug(slugJoined);

  if (!lesson) {
    notFound();
  }

  return <LessonViewer lesson={lesson} />;
}
