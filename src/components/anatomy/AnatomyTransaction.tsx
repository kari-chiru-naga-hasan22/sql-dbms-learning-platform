"use client";

import React, { useState } from "react";
import { CheckCircle, Flame, HardDrive, Cpu, AlertTriangle } from "lucide-react";

interface WalEntry {
  lsn: number; // Log Sequence Number
  txId: string;
  op: "BEGIN" | "UPDATE" | "COMMIT" | "ABORT";
  detail: string;
  flushed: boolean;
}

export function AnatomyTransaction() {
  const [txState, setTxState] = useState<"IDLE" | "ACTIVE" | "COMMITTED" | "ROLLED_BACK" | "CRASHED">("IDLE");
  const [walLogs, setWalLogs] = useState<WalEntry[]>([
    { lsn: 1001, txId: "TX-01", op: "BEGIN", detail: "Transaction started", flushed: true },
    { lsn: 1002, txId: "TX-01", op: "UPDATE", detail: "Alice balance: 1000 -> 900", flushed: true },
    { lsn: 1003, txId: "TX-01", op: "COMMIT", detail: "Transaction committed", flushed: true },
  ]);
  const [ramPages, setRamPages] = useState<{ id: string; dirty: boolean; data: string }[]>([
    { id: "Page 0x10", dirty: false, data: "Alice: $900, Bob: $1100" },
    { id: "Page 0x11", dirty: false, data: "Carol: $500, David: $750" },
  ]);
  const [nextLsn, setNextLsn] = useState<number>(1004);
  const [statusMessage, setStatusMessage] = useState<string>("System normal. No active transaction.");

  const startTx = () => {
    setTxState("ACTIVE");
    const newLsn = nextLsn;
    setNextLsn(newLsn + 1);
    const entry: WalEntry = {
      lsn: newLsn,
      txId: "TX-02",
      op: "BEGIN",
      detail: "Transfer $200 from Bob to Carol started",
      flushed: true,
    };
    setWalLogs((prev) => [...prev, entry]);
    setStatusMessage("TX-02 started. WAL log record flushed to disk.");
  };

  const updateBalance = () => {
    if (txState !== "ACTIVE") return;
    const lsn1 = nextLsn;
    const lsn2 = nextLsn + 1;
    setNextLsn(lsn2 + 1);

    const update1: WalEntry = {
      lsn: lsn1,
      txId: "TX-02",
      op: "UPDATE",
      detail: "Bob: 1100 -> 900",
      flushed: true,
    };
    const update2: WalEntry = {
      lsn: lsn2,
      txId: "TX-02",
      op: "UPDATE",
      detail: "Carol: 500 -> 700",
      flushed: true,
    };

    setWalLogs((prev) => [...prev, update1, update2]);
    // Mark RAM pages as dirty
    setRamPages([
      { id: "Page 0x10", dirty: true, data: "Alice: $900, Bob: $900 (DIRTY)" },
      { id: "Page 0x11", dirty: true, data: "Carol: $700 (DIRTY), David: $750" },
    ]);
    setStatusMessage("RAM Buffer Pool marked DIRTY. WAL log records fsynced to disk (WAL Protocol).");
  };

  const commitTx = () => {
    if (txState !== "ACTIVE") return;
    const lsn = nextLsn;
    setNextLsn(lsn + 1);

    const commitEntry: WalEntry = {
      lsn: lsn,
      txId: "TX-02",
      op: "COMMIT",
      detail: "TX-02 committed successfully",
      flushed: true,
    };
    setWalLogs((prev) => [...prev, commitEntry]);
    setTxState("COMMITTED");
    setStatusMessage("COMMIT record written to WAL. Transaction is officially durable!");
  };

  const rollbackTx = () => {
    if (txState !== "ACTIVE") return;
    const lsn = nextLsn;
    setNextLsn(lsn + 1);

    const abortEntry: WalEntry = {
      lsn: lsn,
      txId: "TX-02",
      op: "ABORT",
      detail: "TX-02 aborted; UNDO initiated",
      flushed: true,
    };
    setWalLogs((prev) => [...prev, abortEntry]);
    setRamPages([
      { id: "Page 0x10", dirty: false, data: "Alice: $900, Bob: $1100 (REVERTED)" },
      { id: "Page 0x11", dirty: false, data: "Carol: $500 (REVERTED), David: $750" },
    ]);
    setTxState("ROLLED_BACK");
    setStatusMessage("TX-02 aborted. Memory changes rolled back from undo history.");
  };

  const simulateCrash = () => {
    setTxState("CRASHED");
    // Volatile RAM lost entirely!
    setRamPages([
      { id: "Page 0x10", dirty: false, data: "Alice: $900, Bob: $1100 (RESTORED FROM DISK)" },
      { id: "Page 0x11", dirty: false, data: "Carol: $500, David: $750 (RESTORED FROM DISK)" },
    ]);
    setStatusMessage("POWER FAILURE SIMULATED! Volatile RAM wiped out. Invoking ARIES recovery protocol...");

    setTimeout(() => {
      setStatusMessage("ARIES Recovery: 1. Analysis Scan -> 2. REDO committed WAL logs -> 3. UNDO active/uncommitted TX-02.");
    }, 1500);
  };

  const resetAll = () => {
    setTxState("IDLE");
    setWalLogs([
      { lsn: 1001, txId: "TX-01", op: "BEGIN", detail: "Transaction started", flushed: true },
      { lsn: 1002, txId: "TX-01", op: "UPDATE", detail: "Alice balance: 1000 -> 900", flushed: true },
      { lsn: 1003, txId: "TX-01", op: "COMMIT", detail: "Transaction committed", flushed: true },
    ]);
    setRamPages([
      { id: "Page 0x10", dirty: false, data: "Alice: $900, Bob: $1100" },
      { id: "Page 0x11", dirty: false, data: "Carol: $500, David: $750" },
    ]);
    setNextLsn(1004);
    setStatusMessage("System normal. No active transaction.");
  };

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
              ACID Transaction & Write-Ahead Log (WAL) State Machine
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Simulate volatile RAM buffer mutations against durable append-only WAL logs and crash recovery.
          </p>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase ${
              txState === "ACTIVE"
                ? "bg-accent-orange/15 border-accent-orange text-accent-orange animate-pulse"
                : txState === "COMMITTED"
                ? "bg-accent-sage/20 border-accent-sage text-accent-sage"
                : txState === "CRASHED"
                ? "bg-red-500/20 border-red-500 text-red-600"
                : txState === "ROLLED_BACK"
                ? "bg-border-warm text-ink-muted border-border-warm"
                : "bg-paper border-border-warm text-ink-muted"
            }`}
          >
            State: {txState}
          </span>
          <button
            onClick={resetAll}
            className="p-1 border border-border-warm rounded hover:bg-paper text-ink-muted hover:text-ink text-xs font-mono"
            title="Reset Rig"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={startTx}
          disabled={txState === "ACTIVE"}
          className="px-3 py-1 bg-ink text-paper text-xs font-mono font-bold rounded hover:bg-ink-muted transition-all disabled:opacity-40"
        >
          BEGIN TRANSACTION
        </button>
        <button
          onClick={updateBalance}
          disabled={txState !== "ACTIVE"}
          className="px-3 py-1 bg-accent-brass text-ink text-xs font-mono font-bold rounded hover:brightness-105 transition-all disabled:opacity-40"
        >
          UPDATE Accounts
        </button>
        <button
          onClick={commitTx}
          disabled={txState !== "ACTIVE"}
          className="px-3 py-1 bg-accent-sage text-paper text-xs font-mono font-bold rounded hover:brightness-105 transition-all disabled:opacity-40"
        >
          COMMIT
        </button>
        <button
          onClick={rollbackTx}
          disabled={txState !== "ACTIVE"}
          className="px-3 py-1 bg-ink-muted text-paper text-xs font-mono font-bold rounded hover:bg-ink transition-all disabled:opacity-40"
        >
          ROLLBACK
        </button>
        <button
          onClick={simulateCrash}
          disabled={txState === "IDLE" || txState === "CRASHED"}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded hover:bg-red-700 transition-all disabled:opacity-40"
        >
          <Flame className="w-3.5 h-3.5" /> CRASH SYSTEM
        </button>
      </div>

      {/* System Status Notification */}
      <div className="mt-3 p-2.5 rounded bg-paper border border-border-warm text-xs font-mono flex items-center gap-2">
        {txState === "CRASHED" ? (
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        ) : txState === "COMMITTED" ? (
          <CheckCircle className="w-4 h-4 text-accent-sage shrink-0" />
        ) : (
          <Cpu className="w-4 h-4 text-accent-brass shrink-0" />
        )}
        <span className="text-ink">{statusMessage}</span>
      </div>

      {/* Split Architecture: RAM vs Non-Volatile Disk */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Volatile RAM: Buffer Pool */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-2 bg-canvas border-b border-border-warm flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-accent-orange" />
              <span className="text-xs font-mono font-bold text-ink">
                Volatile Memory (RAM Buffer Pool)
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-muted">Lost on power crash</span>
          </div>

          <div className="p-3 space-y-2">
            {ramPages.map((page) => (
              <div
                key={page.id}
                className={`p-2.5 rounded border text-xs font-mono transition-all ${
                  page.dirty
                    ? "bg-accent-orange/10 border-accent-orange ring-1 ring-accent-orange/30"
                    : "bg-canvas border-border-warm"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-ink">{page.id}</span>
                  {page.dirty ? (
                    <span className="text-[10px] text-accent-orange font-bold uppercase bg-accent-orange/20 px-1.5 py-0.2 rounded">
                      Dirty Frame
                    </span>
                  ) : (
                    <span className="text-[10px] text-ink-muted">Clean</span>
                  )}
                </div>
                <div className="text-ink-muted">{page.data}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Durable Disk: WAL Log & Table Heap */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-2 bg-canvas border-b border-border-warm flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-accent-sage" />
              <span className="text-xs font-mono font-bold text-ink">
                Non-Volatile Disk (WAL File)
              </span>
            </div>
            <span className="text-[10px] font-mono text-accent-sage font-bold">Fsync Durable</span>
          </div>

          <div className="max-h-52 overflow-y-auto p-2 space-y-1.5">
            {walLogs.map((log) => (
              <div
                key={log.lsn}
                className="p-2 rounded bg-canvas border border-border-warm text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-accent-brass mr-2">LSN #{log.lsn}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] mr-2 ${
                      log.op === "COMMIT"
                        ? "bg-accent-sage/20 text-accent-sage"
                        : log.op === "ABORT"
                        ? "bg-red-500/20 text-red-600"
                        : log.op === "UPDATE"
                        ? "bg-accent-orange/20 text-accent-orange"
                        : "bg-border-warm text-ink"
                    }`}
                  >
                    {log.op}
                  </span>
                  <span className="text-ink">{log.detail}</span>
                </div>
                <span className="text-[10px] text-accent-sage font-bold uppercase">fsync</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACID Guarantees Summary */}
      <div className="mt-4 pt-3 border-t border-border-warm grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-paper border border-border-warm">
          <span className="font-bold text-ink block">Atomicity</span>
          <span className="text-[11px] text-ink-muted">All updates or none via UNDO logging.</span>
        </div>
        <div className="p-2 rounded bg-paper border border-border-warm">
          <span className="font-bold text-ink block">Consistency</span>
          <span className="text-[11px] text-ink-muted">Invariants preserved across state changes.</span>
        </div>
        <div className="p-2 rounded bg-paper border border-border-warm">
          <span className="font-bold text-ink block">Isolation</span>
          <span className="text-[11px] text-ink-muted">Concurrent transactions do not see dirty states.</span>
        </div>
        <div className="p-2 rounded bg-paper border border-border-warm">
          <span className="font-bold text-ink block">Durability</span>
          <span className="text-[11px] text-ink-muted">Flushed WAL log guarantees crash survivability.</span>
        </div>
      </div>
    </div>
  );
}
