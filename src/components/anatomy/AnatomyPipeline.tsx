"use client";

import React, { useState } from "react";
import { Terminal, Cpu, Play, CheckCircle2, Sliders } from "lucide-react";

export function AnatomyPipeline() {
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const sampleQueries = [
    {
      label: "Predicate Filter",
      sql: "SELECT name, salary FROM instructors WHERE salary > 80000;",
      stages: [
        {
          title: "1. Lexical & Syntax Parser",
          shortDesc: "Tokenizes SQL characters and builds an Abstract Syntax Tree (AST).",
          badge: "Parser AST",
          details: {
            input: "SELECT name, salary FROM instructors WHERE salary > 80000;",
            output: "AST: SelectStmt(fields=[name, salary], from=[instructors], where=Gt(salary, 80000))",
            operation: "Tokenization & Grammar Verification",
            technicalNotes: "Verifies grammar against SQL-92 BNF specification. Fails early on missing clauses or bad syntax.",
          },
        },
        {
          title: "2. Semantic Analyzer & Catalog",
          shortDesc: "Validates table and column identifiers against the system catalog.",
          badge: "Catalog Resolution",
          details: {
            input: "AST: SelectStmt(fields=[name, salary], from=[instructors], where=Gt(salary, 80000))",
            output: "Resolved Plan: TableID: 104 ('instructors'), Columns: [ColID: 1 ('name', VARCHAR), ColID: 4 ('salary', NUMERIC)]",
            operation: "Metadata Lookup & Type Checking",
            technicalNotes: "Confirms user permissions, verifies existence of 'instructors', and confirms 'salary' is a numeric type comparable to 80000.",
          },
        },
        {
          title: "3. Cost-Based Optimizer",
          shortDesc: "Calculates physical costs (I/O & CPU) across indexes and sequential scans.",
          badge: "Plan Selection",
          details: {
            input: "Resolved Logical Plan with 2 alternative paths (SeqScan vs IndexScan on idx_instructor_salary)",
            output: "Physical Plan: IndexScan(idx_instructor_salary, condition='salary > 80000', cost=4.25, estimated_rows=4)",
            operation: "Cost Modeling & Access Path Selection",
            technicalNotes: "Optimizer estimates 22% selectivity. Using B-tree index costs 4.25 pages vs 18 pages for sequential scan.",
          },
        },
        {
          title: "4. Execution Engine (Volcano Model)",
          shortDesc: "Pulls tuple iterators via top-down open() -> next() -> close() interface.",
          badge: "Volcano Iterator",
          details: {
            input: "Physical Plan Root Operator",
            output: "Yielded 4 Tuples: ('Dr. Alan Turing', 95000), ('Dr. Ada Lovelace', 110000), ...",
            operation: "Tuple pipelining without buffering entire result in memory",
            technicalNotes: "Pulls one tuple at a time through iterator stack, minimizing peak memory usage.",
          },
        },
        {
          title: "5. Buffer Pool & Disk I/O",
          shortDesc: "Fetches page blocks from RAM buffer pool frames; triggers disk I/O on misses.",
          badge: "Buffer Manager",
          details: {
            input: "Page request: Page 0x04, Page 0x05",
            output: "Cache Hit: Page 0x04 in Frame 12. Cache Miss: Page 0x05 read from disk into Frame 13.",
            operation: "LRU/Clock Eviction & Memory Page Pinning",
            technicalNotes: "Pins active pages in RAM to prevent replacement during scan; unlocks once tuple read completes.",
          },
        },
      ],
    },
    {
      label: "Relational JOIN & Aggregate",
      sql: "SELECT dept_name, COUNT(*) AS total_students FROM students GROUP BY dept_name HAVING COUNT(*) > 1;",
      stages: [
        {
          title: "1. Lexical & Syntax Parser",
          shortDesc: "Tokenizes aggregate functions and GROUP BY/HAVING clauses.",
          badge: "Parser AST",
          details: {
            input: "SELECT dept_name, COUNT(*) ... GROUP BY dept_name HAVING ...",
            output: "AST: AggregateStmt(group=[dept_name], aggs=[COUNT(*)], having=Gt(COUNT(*), 1))",
            operation: "Grammar parsing of aggregation keywords",
            technicalNotes: "Validates that non-aggregated SELECT expressions appear in the GROUP BY clause.",
          },
        },
        {
          title: "2. Semantic Analyzer & Catalog",
          shortDesc: "Resolves relations, attributes, and aggregate function signatures.",
          badge: "Catalog Resolution",
          details: {
            input: "AST: AggregateStmt on 'students'",
            output: "Resolved Schema: Table 'students' (Cols: dept_name: VARCHAR(50))",
            operation: "System catalog symbol binding",
            technicalNotes: "Checks system catalog to ensure COUNT(*) has valid integer return type.",
          },
        },
        {
          title: "3. Cost-Based Optimizer",
          shortDesc: "Decides between Hash Aggregate versus Sort Aggregate.",
          badge: "Hash vs Sort",
          details: {
            input: "Logical Aggregate Plan",
            output: "Physical Plan: HashAggregate(group_key=dept_name, hash_table=in-memory, cost=12.80)",
            operation: "Aggregation Strategy Selection",
            technicalNotes: "Estimated groups (5) easily fit in work_mem (4MB); selects in-memory Hash Aggregate over Sort Aggregate.",
          },
        },
        {
          title: "4. Execution Engine",
          shortDesc: "Constructs in-memory hash buckets and iterates grouped buckets.",
          badge: "Hash Table Exec",
          details: {
            input: "Input tuple stream from sequential table scan",
            output: "Aggregated Groups: 'Computer Science' -> 4, 'Mathematics' -> 2",
            operation: "Hash probe & accumulator updates, then HAVING filter evaluation",
            technicalNotes: "Discards groups where count <= 1 during the HAVING filter phase.",
          },
        },
        {
          title: "5. Buffer Pool & Storage",
          shortDesc: "Reads student table data pages into shared memory buffer frames.",
          badge: "Buffer Manager",
          details: {
            input: "Sequential page scan across Pages 0x01 through 0x04",
            output: "Loaded 4 pages into cache frames; 0 dirty pages written",
            operation: "Read-only shared locks acquired and released",
            technicalNotes: "Sequential pre-fetching loads upcoming pages asynchronously before the engine requests them.",
          },
        },
      ],
    },
  ];

  const currentQuery = sampleQueries[selectedQueryIdx];

  const runSimulation = () => {
    setIsProcessing(true);
    setActiveStage(0);
    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < currentQuery.stages.length) {
        setActiveStage(stage);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 700);
  };

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-5 font-sans my-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-sage px-2 py-0.5 bg-paper rounded border border-border-warm">
              Anatomy Visualizer
            </span>
            <h4 className="text-base font-serif font-bold text-ink">
              RDBMS Query Processing Pipeline
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Trace a SQL string from raw tokens through compilation, cost optimization, execution, and buffer I/O.
          </p>
        </div>

        {/* Query selector & Run button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedQueryIdx}
            onChange={(e) => {
              setSelectedQueryIdx(Number(e.target.value));
              setActiveStage(0);
            }}
            className="bg-paper border border-border-warm text-xs font-mono rounded px-2.5 py-1 text-ink outline-none"
          >
            {sampleQueries.map((q, idx) => (
              <option key={q.label} value={idx}>
                {q.label}
              </option>
            ))}
          </select>

          <button
            onClick={runSimulation}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1 bg-ink text-paper text-xs font-mono font-semibold rounded hover:bg-ink-muted transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-accent-brass" /> Run Pipeline
          </button>
        </div>
      </div>

      {/* Query Banner */}
      <div className="mt-4 p-3 bg-paper rounded border border-border-warm flex items-center gap-2 font-mono text-xs">
        <Terminal className="w-4 h-4 text-accent-orange shrink-0" />
        <span className="text-ink font-semibold">{currentQuery.sql}</span>
      </div>

      {/* Stepper Rail */}
      <div className="mt-5 grid grid-cols-5 gap-2">
        {currentQuery.stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          const isDone = activeStage > idx;
          return (
            <button
              key={stage.title}
              onClick={() => setActiveStage(idx)}
              className={`text-left p-2.5 rounded border transition-all ${
                isActive
                  ? "bg-accent-sage/15 border-accent-sage ring-2 ring-accent-sage/30"
                  : isDone
                  ? "bg-paper border-accent-sage/50 text-ink"
                  : "bg-paper/50 border-border-warm text-ink-muted hover:border-ink-muted/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-accent-brass uppercase">
                  Stage {idx + 1}
                </span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-accent-sage" />}
              </div>
              <div className="text-xs font-serif font-bold text-ink leading-tight">
                {stage.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="mt-4 p-4 rounded-lg bg-paper border border-border-warm">
        <div className="flex items-center justify-between border-b border-border-warm pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-brass" />
            <span className="text-sm font-serif font-bold text-ink">
              {currentQuery.stages[activeStage].title}
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border-warm">
            {currentQuery.stages[activeStage].details.operation}
          </span>
        </div>

        <p className="text-xs text-ink-muted mb-3 font-sans">
          {currentQuery.stages[activeStage].shortDesc}
        </p>

        {/* Input/Output Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-canvas p-2.5 rounded border border-border-warm">
            <div className="text-[10px] uppercase text-ink-faint mb-1">Stage Input</div>
            <div className="text-ink break-words text-[11px]">
              {currentQuery.stages[activeStage].details.input}
            </div>
          </div>
          <div className="bg-canvas p-2.5 rounded border border-border-warm">
            <div className="text-[10px] uppercase text-accent-sage font-bold mb-1">
              Stage Output / Artifact
            </div>
            <div className="text-ink break-words text-[11px]">
              {currentQuery.stages[activeStage].details.output}
            </div>
          </div>
        </div>

        {/* Technical Explanatory Note */}
        <div className="mt-3 pt-2.5 border-t border-border-warm flex items-start gap-2 text-xs text-ink-muted">
          <Sliders className="w-3.5 h-3.5 text-accent-orange shrink-0 mt-0.5" />
          <span>
            <strong className="text-ink">Architecture Insight:</strong>{" "}
            {currentQuery.stages[activeStage].details.technicalNotes}
          </span>
        </div>
      </div>
    </div>
  );
}
