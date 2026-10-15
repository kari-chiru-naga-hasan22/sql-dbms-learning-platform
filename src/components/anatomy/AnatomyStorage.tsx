"use client";

import React, { useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface SlotItem {
  id: number;
  offset: number;
  length: number;
  status: "active" | "tombstone";
  text: string;
}

export function AnatomyStorage() {
  const [slots, setSlots] = useState<SlotItem[]>([
    { id: 1, offset: 7800, length: 200, status: "active", text: "Record #1: ('Alan Turing', 'Math')" },
    { id: 2, offset: 7550, length: 250, status: "active", text: "Record #2: ('Ada Lovelace', 'CS')" },
    { id: 3, offset: 7300, length: 250, status: "tombstone", text: "[DELETED] ('Grace Hopper')" },
  ]);

  const totalPageSize = 8192; // 8KB
  const headerSize = 96; // bytes
  const slotEntrySize = 4; // 4 bytes per slot pointer (2 bytes offset + 2 bytes len)

  const usedSlotsBytes = slots.length * slotEntrySize;
  const activeRecordBytes = slots
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.length, 0);
  const deadRecordBytes = slots
    .filter((s) => s.status === "tombstone")
    .reduce((acc, s) => acc + s.length, 0);
  const freeSpaceBytes = totalPageSize - (headerSize + usedSlotsBytes + activeRecordBytes + deadRecordBytes);

  const addRecord = () => {
    if (freeSpaceBytes < 220) return;
    const nextId = slots.length + 1;
    const len = 200;
    const lowestOffset = slots.reduce((min, s) => Math.min(min, s.offset), 8000);
    const newOffset = lowestOffset - len;

    const newSlot: SlotItem = {
      id: nextId,
      offset: newOffset,
      length: len,
      status: "active",
      text: `Record #${nextId}: ('Student_${nextId}', 'Bio')`,
    };
    setSlots([...slots, newSlot]);
  };

  const deleteRecord = (id: number) => {
    setSlots(
      slots.map((s) =>
        s.id === id ? { ...s, status: "tombstone", text: `[DELETED SLOT #${id}]` } : s
      )
    );
  };

  const vacuumDefrag = () => {
    // Reclaim dead slots and pack tuples tight
    const activeOnes = slots.filter((s) => s.status === "active");
    let currentOffset = 8000;
    const repacked = activeOnes.map((s, idx) => {
      currentOffset -= s.length;
      return {
        ...s,
        id: idx + 1,
        offset: currentOffset,
      };
    });
    setSlots(repacked);
  };

  const resetPage = () => {
    setSlots([
      { id: 1, offset: 7800, length: 200, status: "active", text: "Record #1: ('Alan Turing', 'Math')" },
      { id: 2, offset: 7550, length: 250, status: "active", text: "Record #2: ('Ada Lovelace', 'CS')" },
      { id: 3, offset: 7300, length: 250, status: "tombstone", text: "[DELETED] ('Grace Hopper')" },
    ]);
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
              Slotted-Page Binary Storage Architecture (8KB Block)
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Observe the dual-growth model: slot offsets grow downwards from the header, while tuple payloads grow upwards from the bottom.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={addRecord}
            disabled={freeSpaceBytes < 220}
            className="flex items-center gap-1 px-3 py-1 bg-ink text-paper text-xs font-mono font-bold rounded hover:bg-ink-muted transition-all disabled:opacity-40"
          >
            <Plus className="w-3 h-3" /> Insert Tuple
          </button>
          <button
            onClick={vacuumDefrag}
            className="flex items-center gap-1 px-3 py-1 bg-accent-brass text-ink text-xs font-mono font-bold rounded hover:brightness-105 transition-all"
          >
            <RefreshCw className="w-3 h-3" /> VACUUM / Defrag
          </button>
          <button
            onClick={resetPage}
            className="p-1 border border-border-warm rounded text-ink-muted hover:text-ink hover:bg-paper text-xs font-mono"
            title="Reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Visual Memory Block Map */}
      <div className="mt-5 border-2 border-border-warm rounded-lg p-3 bg-paper">
        <div className="text-[10px] font-mono text-ink-muted flex justify-between mb-2">
          <span>Byte Offset: 0x0000 (Page Start)</span>
          <span>Total Size: 8192 Bytes (8 KB)</span>
          <span>Byte Offset: 0x2000 (Page End)</span>
        </div>

        {/* The Page Bar */}
        <div className="flex w-full h-12 rounded border border-border-warm overflow-hidden text-[10px] font-mono text-center font-bold">
          {/* Header */}
          <div
            style={{ width: "12%" }}
            className="bg-accent-slate/30 border-r border-border-warm flex items-center justify-center p-1 text-ink"
            title="Fixed Header: LSN, Checksum, Slot Count"
          >
            Header ({headerSize}B)
          </div>

          {/* Slot Array */}
          <div
            style={{ width: "18%" }}
            className="bg-accent-orange/20 border-r border-border-warm flex items-center justify-center p-1 text-accent-orange"
            title="Slot Array growing downwards: contains offset and length pointers"
          >
            Slots ({usedSlotsBytes}B) ↓
          </div>

          {/* Free Space Gap */}
          <div
            style={{ width: "40%" }}
            className="bg-canvas border-r border-border-warm flex items-center justify-center p-1 text-ink-muted border-dashed"
            title="Contiguous Free Space Gap"
          >
            Free Space Gap ({freeSpaceBytes}B)
          </div>

          {/* Dead Tuples */}
          {deadRecordBytes > 0 && (
            <div
              style={{ width: "10%" }}
              className="bg-red-500/20 border-r border-border-warm flex items-center justify-center p-1 text-red-600"
              title="Dead/Tombstoned Tuples waiting for VACUUM"
            >
              Dead ({deadRecordBytes}B)
            </div>
          )}

          {/* Active Tuples */}
          <div
            style={{ width: deadRecordBytes > 0 ? "20%" : "30%" }}
            className="bg-accent-sage/25 flex items-center justify-center p-1 text-accent-sage"
            title="Active Tuple data packed upwards from bottom"
          >
            Tuples ↑ ({activeRecordBytes}B)
          </div>
        </div>
      </div>

      {/* Slotted Page Table Inspection */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Slot Array */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-1.5 bg-canvas border-b border-border-warm flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink">Slot Directory (Top-down)</span>
            <span className="text-[10px] font-mono text-accent-orange">{slots.length} Slots</span>
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                <th className="px-3 py-1.5">Slot #</th>
                <th className="px-3 py-1.5">Offset</th>
                <th className="px-3 py-1.5">Length</th>
                <th className="px-3 py-1.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-border-warm/50 ${
                    s.status === "tombstone" ? "bg-red-500/5 text-ink-muted line-through" : "hover:bg-canvas"
                  }`}
                >
                  <td className="px-3 py-1.5 font-bold">Slot [{s.id}]</td>
                  <td className="px-3 py-1.5">0x{s.offset.toString(16).toUpperCase()}</td>
                  <td className="px-3 py-1.5">{s.length}B</td>
                  <td className="px-3 py-1.5">
                    {s.status === "active" ? (
                      <button
                        onClick={() => deleteRecord(s.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3 h-3" /> Del
                      </button>
                    ) : (
                      <span className="text-[10px] text-red-500 font-bold uppercase">Dead</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Tuple Heap Storage */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-1.5 bg-canvas border-b border-border-warm flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink">Tuple Payload Data (Bottom-up)</span>
            <span className="text-[10px] font-mono text-accent-sage">Physical Heap</span>
          </div>
          <div className="p-2 space-y-1.5 max-h-48 overflow-y-auto">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`p-2 rounded border text-xs font-mono ${
                  s.status === "tombstone"
                    ? "bg-red-500/5 border-red-500/30 text-ink-muted"
                    : "bg-canvas border-border-warm text-ink"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-ink-muted mb-0.5">
                  <span>Offset 0x{s.offset.toString(16).toUpperCase()} ({s.length} bytes)</span>
                  <span>RID: ({s.id})</span>
                </div>
                <div className={s.status === "tombstone" ? "line-through text-ink-faint" : "font-semibold"}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
