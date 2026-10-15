"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

type NormalFormStage = "UNF" | "1NF" | "2NF" | "3NF";

export function AnatomyNormalization() {
  const [stage, setStage] = useState<NormalFormStage>("1NF");

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-5 font-sans my-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-brass px-2 py-0.5 bg-paper rounded border border-border-warm">
              Anatomy Visualizer
            </span>
            <h4 className="text-base font-serif font-bold text-ink">
              Normalization Decomposition Rig (1NF → 2NF → 3NF)
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Step through relation decomposition to eliminate insertion, update, and deletion anomalies.
          </p>
        </div>

        {/* Stepper Buttons */}
        <div className="flex rounded-md border border-border-warm p-0.5 bg-paper text-xs font-mono">
          {(["UNF", "1NF", "2NF", "3NF"] as NormalFormStage[]).map((st) => (
            <button
              key={st}
              onClick={() => setStage(st)}
              className={`px-3 py-1 rounded transition-colors font-bold ${
                stage === st
                  ? "bg-ink text-paper shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Explainer */}
      <div className="mt-4 p-3 bg-paper rounded border border-border-warm">
        {stage === "UNF" && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-600 font-bold mb-1">
              <AlertTriangle className="w-4 h-4" /> Unnormalized Form (UNF)
            </div>
            <p className="text-xs text-ink-muted">
              Relation contains non-atomic, multivalued values (e.g., comma-separated course list). Fails 1NF requirements immediately.
            </p>
          </div>
        )}
        {stage === "1NF" && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-orange font-bold mb-1">
              <AlertTriangle className="w-4 h-4" /> First Normal Form (1NF) Achieved
            </div>
            <p className="text-xs text-ink-muted">
              All column values are atomic (single scalar per cell). Composite Primary Key: <code>(StudentID, CourseID)</code>.
              <strong> Flaw:</strong> Instructor Office depends solely on <code>CourseID</code>, not the full composite key (Partial Dependency).
            </p>
          </div>
        )}
        {stage === "2NF" && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-brass font-bold mb-1">
              <CheckCircle className="w-4 h-4" /> Second Normal Form (2NF) Achieved
            </div>
            <p className="text-xs text-ink-muted">
              Partial dependencies removed by splitting into <code>StudentCourses</code> and <code>Courses</code> relations.
              <strong> Flaw:</strong> In <code>Courses</code>, <code>InstructorEmail</code> depends on <code>InstructorName</code> (Transitive Dependency).
            </p>
          </div>
        )}
        {stage === "3NF" && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-sage font-bold mb-1">
              <ShieldCheck className="w-4 h-4" /> Third Normal Form (3NF) — Anomaly-Free
            </div>
            <p className="text-xs text-ink-muted">
              Transitive dependencies decomposed into a dedicated <code>Instructors</code> relation. Every non-key attribute depends strictly on the primary key, the whole key, and nothing but the key.
            </p>
          </div>
        )}
      </div>

      {/* Relations Presentation based on Stage */}
      <div className="mt-4 space-y-4">
        {stage === "UNF" && (
          <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
            <div className="px-3 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-ink">
              Table: StudentEnrollment_Raw (UNF)
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                  <th className="px-3 py-1.5">StudentID</th>
                  <th className="px-3 py-1.5">StudentName</th>
                  <th className="px-3 py-1.5">Courses (Non-Atomic!)</th>
                  <th className="px-3 py-1.5">Instructor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-warm/50">
                  <td className="px-3 py-1.5 font-bold">S101</td>
                  <td className="px-3 py-1.5">Alice Smith</td>
                  <td className="px-3 py-1.5 text-red-600 bg-red-500/10 font-bold">
                    CS101, CS204, MATH301
                  </td>
                  <td className="px-3 py-1.5">Dr. Alan, Dr. Ada</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold">S102</td>
                  <td className="px-3 py-1.5">Bob Jones</td>
                  <td className="px-3 py-1.5 text-red-600 bg-red-500/10 font-bold">
                    CS101, PHYS100
                  </td>
                  <td className="px-3 py-1.5">Dr. Alan, Dr. Feynman</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {stage === "1NF" && (
          <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
            <div className="px-3 py-1.5 bg-canvas border-b border-border-warm flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ink">Table: Enrollment_1NF (Atomic Rows)</span>
              <span className="text-accent-orange font-bold">Composite PK: (StudentID, CourseID)</span>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                  <th className="px-3 py-1.5 text-accent-orange">StudentID (PK1)</th>
                  <th className="px-3 py-1.5 text-accent-orange">CourseID (PK2)</th>
                  <th className="px-3 py-1.5">StudentName</th>
                  <th className="px-3 py-1.5">CourseTitle</th>
                  <th className="px-3 py-1.5 text-red-600">InstructorOffice (Partial Dep!)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-warm/50">
                  <td className="px-3 py-1.5 font-bold">S101</td>
                  <td className="px-3 py-1.5 font-bold">CS101</td>
                  <td className="px-3 py-1.5">Alice Smith</td>
                  <td className="px-3 py-1.5">Intro to CS</td>
                  <td className="px-3 py-1.5 bg-red-500/10 text-red-700">Turing Hall 301</td>
                </tr>
                <tr className="border-b border-border-warm/50">
                  <td className="px-3 py-1.5 font-bold">S101</td>
                  <td className="px-3 py-1.5 font-bold">MATH301</td>
                  <td className="px-3 py-1.5">Alice Smith</td>
                  <td className="px-3 py-1.5">Linear Algebra</td>
                  <td className="px-3 py-1.5 bg-red-500/10 text-red-700">Newton Hall 104</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold">S102</td>
                  <td className="px-3 py-1.5 font-bold">CS101</td>
                  <td className="px-3 py-1.5">Bob Jones</td>
                  <td className="px-3 py-1.5">Intro to CS</td>
                  <td className="px-3 py-1.5 bg-red-500/10 text-red-700">Turing Hall 301 (Redundant!)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {stage === "2NF" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Table 1 */}
            <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
              <div className="px-3 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-ink">
                Relation: Enrollment (PK: StudentID, CourseID)
              </div>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                    <th className="px-3 py-1.5">StudentID</th>
                    <th className="px-3 py-1.5">CourseID</th>
                    <th className="px-3 py-1.5">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-warm/50">
                    <td className="px-3 py-1.5 font-bold">S101</td>
                    <td className="px-3 py-1.5 font-bold">CS101</td>
                    <td className="px-3 py-1.5 font-bold text-accent-sage">A</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 font-bold">S102</td>
                    <td className="px-3 py-1.5 font-bold">CS101</td>
                    <td className="px-3 py-1.5 font-bold text-accent-sage">B+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2 */}
            <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
              <div className="px-3 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-ink">
                Relation: Courses (PK: CourseID)
              </div>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                    <th className="px-3 py-1.5">CourseID (PK)</th>
                    <th className="px-3 py-1.5">Title</th>
                    <th className="px-3 py-1.5">Instructor</th>
                    <th className="px-3 py-1.5 text-accent-orange">Email (Transitive!)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-warm/50">
                    <td className="px-3 py-1.5 font-bold">CS101</td>
                    <td className="px-3 py-1.5">Intro to CS</td>
                    <td className="px-3 py-1.5">Dr. Alan</td>
                    <td className="px-3 py-1.5 text-accent-orange bg-accent-orange/10">alan@univ.edu</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {stage === "3NF" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Table 1 */}
            <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
              <div className="px-2.5 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-ink">
                1. Enrollment
              </div>
              <div className="p-2 text-xs font-mono space-y-1">
                <div className="text-[11px] text-ink-muted">PK: (StudentID, CourseID)</div>
                <div className="bg-canvas p-1 rounded">S101 | CS101 | Grade: A</div>
                <div className="bg-canvas p-1 rounded">S102 | CS101 | Grade: B+</div>
              </div>
            </div>

            {/* Table 2 */}
            <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
              <div className="px-2.5 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-ink">
                2. Courses
              </div>
              <div className="p-2 text-xs font-mono space-y-1">
                <div className="text-[11px] text-ink-muted">PK: CourseID, FK: InstructorID</div>
                <div className="bg-canvas p-1 rounded">CS101 | Intro CS | Inst: #401</div>
                <div className="bg-canvas p-1 rounded">MATH301 | LinAlg | Inst: #402</div>
              </div>
            </div>

            {/* Table 3 */}
            <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
              <div className="px-2.5 py-1.5 bg-canvas border-b border-border-warm text-xs font-mono font-bold text-accent-sage">
                3. Instructors
              </div>
              <div className="p-2 text-xs font-mono space-y-1">
                <div className="text-[11px] text-ink-muted">PK: InstructorID</div>
                <div className="bg-canvas p-1 rounded">#401 | Dr. Alan | alan@univ.edu</div>
                <div className="bg-canvas p-1 rounded">#402 | Dr. Ada | ada@univ.edu</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anomaly scorecard footer */}
      <div className="mt-4 pt-3 border-t border-border-warm flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted">Insertion Anomaly:</span>
            <span className={stage === "3NF" ? "text-accent-sage font-bold" : "text-red-500 font-bold"}>
              {stage === "3NF" ? "Eliminated" : "Vulnerable"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted">Update Anomaly:</span>
            <span className={stage === "3NF" ? "text-accent-sage font-bold" : "text-red-500 font-bold"}>
              {stage === "3NF" ? "Eliminated" : "Vulnerable"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted">Deletion Anomaly:</span>
            <span className={stage === "3NF" ? "text-accent-sage font-bold" : "text-red-500 font-bold"}>
              {stage === "3NF" ? "Eliminated" : "Vulnerable"}
            </span>
          </div>
        </div>

        <div className="text-ink-muted">
          Decomposition preserves lossless join & functional dependencies
        </div>
      </div>
    </div>
  );
}
