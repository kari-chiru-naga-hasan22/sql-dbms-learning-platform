"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Database,
  Table as TableIcon,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { executeQuery, resetDatabase, getTableSchemas } from "@/lib/sqlEngine";
import { QueryResult, TableSchema, SampleQuery } from "@/lib/types";

interface SqlLabProps {
  initialQuery?: string;
  sampleQueries?: SampleQuery[];
  targetDatabase?: "university" | "retail" | "general";
  title?: string;
}

export function SqlLab({
  initialQuery = "SELECT * FROM instructors WHERE salary > 75000 ORDER BY salary DESC;",
  sampleQueries = [],
  targetDatabase = "university",
  title = "Interactive SQL Execution Lab",
}: SqlLabProps) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [schemaOpen, setSchemaOpen] = useState(true);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "diff" | "explanation">("results");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dbType = targetDatabase === "retail" ? "retail" : "university";

  const handleRunQuery = useCallback(async (sqlToRun?: string) => {
    const q = (sqlToRun !== undefined ? sqlToRun : query).trim();
    if (!q) return;

    setIsRunning(true);
    try {
      const res = await executeQuery(q, dbType);
      setResult(res);
      // Refresh schemas if DDL or DML ran
      if (res.diff && res.diff.operation !== "SELECT") {
        getTableSchemas(dbType).then(setSchemas).catch(console.error);
        setActiveTab("diff");
      } else {
        setActiveTab("results");
      }
    } catch (e: unknown) {
      setResult({
        columns: [],
        values: [],
        rowsAffected: 0,
        executionTimeMs: 0,
        error: (e as Error)?.message || "Execution failed",
      });
    } finally {
      setIsRunning(false);
    }
  }, [query, dbType]);

  useEffect(() => {
    // Load schemas on mount
    getTableSchemas(dbType).then(setSchemas).catch(console.error);
    // Execute initial query
    handleRunQuery(initialQuery);
  }, [dbType, initialQuery, handleRunQuery]);

  const handleReset = async () => {
    await resetDatabase(dbType);
    const updatedSchemas = await getTableSchemas(dbType);
    setSchemas(updatedSchemas);
    handleRunQuery(initialQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunQuery();
    }
  };

  return (
    <div className="bg-canvas border border-border-warm rounded-lg overflow-hidden font-sans my-6 shadow-sm">
      {/* Top Header Bar */}
      <div className="bg-paper border-b border-border-warm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-ink text-paper text-xs font-mono font-bold">
            <Database className="w-3.5 h-3.5 text-accent-brass" />
          </span>
          <div>
            <h4 className="text-sm font-serif font-bold text-ink leading-tight">{title}</h4>
            <span className="text-[11px] font-mono text-ink-muted">
              Live WebAssembly SQLite Engine • In-Memory Database
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {sampleQueries.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setQuery(e.target.value);
                  handleRunQuery(e.target.value);
                }
              }}
              className="text-xs font-mono bg-canvas border border-border-warm rounded px-2.5 py-1 text-ink outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Select Sample Query...
              </option>
              {sampleQueries.map((sq, idx) => (
                <option key={idx} value={sq.sql}>
                  {sq.label}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-ink-muted hover:text-ink bg-canvas border border-border-warm rounded hover:bg-border-warm/30 transition-all"
            title="Reset database tables to initial seed data"
          >
            <RotateCcw className="w-3 h-3" /> Reset DB
          </button>

          <button
            onClick={() => handleRunQuery()}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-ink text-paper rounded hover:bg-ink-muted transition-all disabled:opacity-50 shadow-sm"
          >
            <Play className="w-3 h-3 text-accent-brass" /> Run (Ctrl+↵)
          </button>
        </div>
      </div>

      {/* Main Grid: Schema Drawer + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-border-warm">
        {/* Schema Explorer */}
        <div className="lg:col-span-1 border-r border-border-warm bg-paper/60 p-3 max-h-72 overflow-y-auto">
          <div
            onClick={() => setSchemaOpen(!schemaOpen)}
            className="flex items-center justify-between cursor-pointer text-xs font-mono font-bold text-ink mb-2 select-none"
          >
            <div className="flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-accent-sage" />
              <span>Database Schema</span>
            </div>
            {schemaOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </div>

          {schemaOpen && (
            <div className="space-y-1 text-xs font-mono">
              {schemas.map((schema) => (
                <div key={schema.name} className="rounded border border-border-warm/50 bg-paper overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedTable(expandedTable === schema.name ? null : schema.name)
                    }
                    className="w-full text-left px-2 py-1.5 flex items-center justify-between hover:bg-canvas transition-colors"
                  >
                    <span className="font-semibold text-ink">{schema.name}</span>
                    <span className="text-[10px] text-ink-muted bg-canvas px-1 rounded">
                      {schema.rowCount} rows
                    </span>
                  </button>

                  {expandedTable === schema.name && (
                    <div className="p-2 border-t border-border-warm/50 bg-canvas space-y-1 text-[11px]">
                      {schema.columns.map((col) => (
                        <div key={col.name} className="flex items-center justify-between text-ink-muted">
                          <span className={col.primaryKey ? "text-accent-orange font-bold" : "text-ink"}>
                            {col.name} {col.primaryKey && "(PK)"}
                          </span>
                          <span className="text-[10px] text-ink-faint uppercase">{col.type}</span>
                        </div>
                      ))}
                      <div className="pt-1 mt-1 border-t border-border-warm/30">
                        <button
                          onClick={() => {
                            const selectSql = `SELECT * FROM ${schema.name} LIMIT 10;`;
                            setQuery(selectSql);
                            handleRunQuery(selectSql);
                          }}
                          className="text-[10px] text-accent-brass hover:underline block"
                        >
                          → Query first 10 rows
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SQL Code Area */}
        <div className="lg:col-span-3 flex flex-col bg-paper">
          <div className="px-3 py-1 bg-canvas border-b border-border-warm flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>SQL Query Editor</span>
            <span>SQLite 3 (WASM)</span>
          </div>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            className="w-full p-3 font-mono text-xs bg-paper text-ink focus:outline-none resize-y leading-relaxed border-0"
            placeholder="Type your SQL query here... (e.g., SELECT * FROM instructors;)"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Tabs & Meta Bar */}
      <div className="bg-paper border-b border-border-warm px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "results"
                ? "bg-ink text-paper font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Output Grid ({result ? result.values.length : 0})
          </button>
          {result?.diff && (
            <button
              onClick={() => setActiveTab("diff")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "diff"
                  ? "bg-accent-orange text-paper font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              State Diff ({result.diff.operation})
            </button>
          )}
          {result?.explanation && (
            <button
              onClick={() => setActiveTab("explanation")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "explanation"
                  ? "bg-accent-sage text-paper font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Query Semantics
            </button>
          )}
        </div>

        {result && (
          <div className="flex items-center gap-3 text-xs font-mono text-ink-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent-brass" />
              {result.executionTimeMs.toFixed(2)} ms
            </span>
            {result.error ? (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Syntax Error
              </span>
            ) : (
              <span className="text-accent-sage font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Success
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-paper min-h-[160px]">
        {/* Error State */}
        {result?.error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 font-mono text-xs">
            <div className="font-bold mb-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> SQLite Runtime Error:
            </div>
            <p className="whitespace-pre-wrap">{result.error}</p>
          </div>
        )}

        {/* Tab 1: Materialized Results Grid */}
        {activeTab === "results" && !result?.error && result && (
          <div>
            {result.columns.length === 0 ? (
              <div className="text-center py-6 text-xs font-mono text-ink-muted">
                Query executed successfully. {result.rowsAffected} rows affected.
              </div>
            ) : (
              <div className="overflow-x-auto border border-border-warm rounded-lg bg-canvas">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-paper border-b border-border-warm text-ink text-left">
                      {result.columns.map((col, idx) => (
                        <th key={idx} className="px-3 py-2 font-bold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.values.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-border-warm/40 hover:bg-paper transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-3 py-1.5 whitespace-nowrap text-ink"
                          >
                            {cell === null ? (
                              <span className="text-ink-faint italic">NULL</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mutation Diff Viewer */}
        {activeTab === "diff" && result?.diff && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-canvas rounded border border-accent-orange/40">
              <span className="font-bold text-accent-orange uppercase">
                {result.diff.operation} Detected
              </span>
              <p className="text-ink-muted mt-1 font-sans">
                This operation modified database persistent storage. {result.diff.rowsAffected} rows were altered.
              </p>
            </div>

            {result.diff.insertedRows && result.diff.insertedRows.length > 0 && (
              <div className="border border-accent-sage rounded overflow-hidden">
                <div className="px-3 py-1.5 bg-accent-sage/20 text-accent-sage font-bold">
                  + Inserted Rows ({result.diff.insertedRows.length})
                </div>
                <div className="p-2 space-y-1 bg-paper">
                  {result.diff.insertedRows.map((r, i) => (
                    <pre key={i} className="text-[11px] text-ink p-1 bg-canvas rounded">
                      {JSON.stringify(r)}
                    </pre>
                  ))}
                </div>
              </div>
            )}

            {result.diff.deletedRows && result.diff.deletedRows.length > 0 && (
              <div className="border border-red-500 rounded overflow-hidden">
                <div className="px-3 py-1.5 bg-red-500/20 text-red-600 font-bold">
                  - Deleted Rows ({result.diff.deletedRows.length})
                </div>
                <div className="p-2 space-y-1 bg-paper">
                  {result.diff.deletedRows.map((r, i) => (
                    <pre key={i} className="text-[11px] text-ink p-1 bg-canvas rounded">
                      {JSON.stringify(r)}
                    </pre>
                  ))}
                </div>
              </div>
            )}

            {result.diff.modifiedCells && result.diff.modifiedCells.length > 0 && (
              <div className="border border-accent-brass rounded overflow-hidden">
                <div className="px-3 py-1.5 bg-accent-brass/20 text-ink font-bold">
                  ~ Modified Cells ({result.diff.modifiedCells.length})
                </div>
                <div className="p-2 space-y-1 bg-paper">
                  {result.diff.modifiedCells.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] bg-canvas p-1 rounded">
                      <span className="font-bold text-ink">Row {c.rowIndex + 1} [{c.columnName}]:</span>
                      <span className="line-through text-red-500">{String(c.oldValue)}</span>
                      <span>→</span>
                      <span className="font-bold text-accent-sage">{String(c.newValue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Plain-Language Semantics */}
        {activeTab === "explanation" && result?.explanation && (
          <div className="p-4 bg-canvas rounded border border-border-warm text-xs font-mono leading-relaxed">
            <div className="text-[10px] text-accent-sage font-bold uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Logical Query Walkthrough
            </div>
            <p className="text-ink font-sans text-xs whitespace-pre-wrap">
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
