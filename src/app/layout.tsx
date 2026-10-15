import type { Metadata } from "next";
import "./globals.css";
import { getCourseData } from "@/lib/courseData";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SQL & DBMS Interactive Studio | 10-Week Complete Curriculum",
  description:
    "Master Relational Databases, SQL Execution, B+ Tree Indexing, Query Optimization, Normalization, ACID Transactions, and NoSQL with hands-on WebAssembly SQLite simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const courseData = getCourseData();

  return (
    <html lang="en">
      <body className="bg-canvas text-ink antialiased min-h-screen flex flex-col font-sans selection:bg-accent-brass/30 selection:text-ink">
        <Navbar />
        <div className="flex-1 flex w-full">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block">
            <Sidebar weeks={courseData.weeks} />
          </div>
          {/* Main Stage */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
