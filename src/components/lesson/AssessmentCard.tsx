"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { AssessmentData } from "@/lib/types";
import { recordQuizScore, getProgress } from "@/lib/progress";

interface AssessmentCardProps {
  lessonSlug: string;
  assessment: AssessmentData;
}

export function AssessmentCard({ lessonSlug, assessment }: AssessmentCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Check if previously scored
    const progress = getProgress();
    const prev = progress.quizScores[lessonSlug];
    if (prev) {
      setScore(prev.score);
      setSubmitted(true);
    }
  }, [lessonSlug]);

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return null;
  }

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    assessment.questions.forEach((q, qIdx) => {
      const selected = selectedAnswers[qIdx];
      if (selected !== undefined && q.options[selected]?.is_correct) {
        correctCount += 1;
      }
    });

    setScore(correctCount);
    setSubmitted(true);
    recordQuizScore(lessonSlug, correctCount, assessment.questions.length);

    const pct = correctCount / assessment.questions.length;
    if (pct >= 0.7) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#91A58B", "#C3A56B", "#D86C45"],
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const isComplete = Object.keys(selectedAnswers).length === assessment.questions.length;

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-6 font-sans my-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-brass" />
          <h3 className="text-lg font-serif font-bold text-ink">
            Module Knowledge Assessment
          </h3>
          <span className="text-xs font-mono text-ink-muted bg-paper px-2 py-0.5 rounded border border-border-warm">
            {assessment.questions.length} Questions
          </span>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <div className="text-sm font-mono font-bold">
              Score:{" "}
              <span className={score / assessment.questions.length >= 0.7 ? "text-accent-sage" : "text-accent-orange"}>
                {score} / {assessment.questions.length} (
                {Math.round((score / assessment.questions.length) * 100)}%)
              </span>
            </div>
            <button
              onClick={handleRetake}
              className="flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-ink border border-border-warm rounded px-2.5 py-1 bg-paper"
            >
              <RotateCcw className="w-3 h-3" /> Retake
            </button>
          </div>
        )}
      </div>

      {/* Questions Stack */}
      <div className="mt-6 space-y-6">
        {assessment.questions.map((q, qIdx) => {
          const selectedOpt = selectedAnswers[qIdx];
          return (
            <div key={qIdx} className="p-4 rounded-lg bg-paper border border-border-warm">
              <div className="flex items-start gap-2.5 mb-3">
                <span className="text-xs font-mono font-bold text-accent-brass mt-0.5">
                  Q{qIdx + 1}.
                </span>
                <p className="text-sm font-medium text-ink leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 ml-5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  const isCorrect = opt.is_correct;

                  let optClasses =
                    "p-2.5 rounded border text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ";

                  if (submitted) {
                    if (isCorrect) {
                      optClasses += "bg-accent-sage/20 border-accent-sage text-ink font-semibold";
                    } else if (isSelected && !isCorrect) {
                      optClasses += "bg-red-500/15 border-red-400 text-red-700";
                    } else {
                      optClasses += "bg-canvas border-border-warm/50 text-ink-muted opacity-60";
                    }
                  } else {
                    if (isSelected) {
                      optClasses += "bg-ink text-paper border-ink font-semibold";
                    } else {
                      optClasses += "bg-canvas border-border-warm hover:border-ink-muted text-ink";
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={optClasses}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {submitted && (
                        <div>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-accent-sage" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation note when submitted */}
              {submitted && q.explanation && (
                <div className="mt-3 ml-5 p-3 rounded bg-canvas border border-border-warm text-xs font-sans text-ink-muted">
                  <strong className="text-ink font-mono text-[11px] block mb-1">
                    Explanation:
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit Button */}
      {!submitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="flex items-center gap-2 px-5 py-2 bg-ink text-paper text-xs font-mono font-bold rounded-lg hover:bg-ink-muted transition-all disabled:opacity-40 shadow-sm"
          >
            Submit Answers ({Object.keys(selectedAnswers).length}/{assessment.questions.length})
            <ArrowRight className="w-3.5 h-3.5 text-accent-brass" />
          </button>
        </div>
      )}
    </div>
  );
}
