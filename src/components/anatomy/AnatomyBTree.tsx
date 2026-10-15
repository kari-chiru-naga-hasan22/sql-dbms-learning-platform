"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Zap, Layers, Database } from "lucide-react";

export function AnatomyBTree() {
  const [searchKey, setSearchKey] = useState<number>(45);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scanType, setScanType] = useState<"index" | "full">("index");
  const [fullScanProgress, setFullScanProgress] = useState<number>(0);

  // Pre-configured B+ Tree hierarchy (Degree 3)
  const treeData = {
    root: { id: "root", keys: [40, 70] },
    internal: [
      { id: "int-1", keys: [20], parentKey: "< 40" },
      { id: "int-2", keys: [55], parentKey: "40 - 70" },
      { id: "int-3", keys: [85], parentKey: ">= 70" },
    ],
    leaves: [
      { id: "leaf-1", keys: [10, 15], records: [{ key: 10, name: "Alice", page: "Page 0x1A" }, { key: 15, name: "Bob", page: "Page 0x1A" }] },
      { id: "leaf-2", keys: [20, 30], records: [{ key: 20, name: "Carol", page: "Page 0x1B" }, { key: 30, name: "David", page: "Page 0x1B" }] },
      { id: "leaf-3", keys: [40, 45, 50], records: [{ key: 40, name: "Eve", page: "Page 0x2A" }, { key: 45, name: "Frank", page: "Page 0x2A" }, { key: 50, name: "Grace", page: "Page 0x2A" }] },
      { id: "leaf-4", keys: [55, 65], records: [{ key: 55, name: "Heidi", page: "Page 0x2B" }, { key: 65, name: "Ivan", page: "Page 0x2B" }] },
      { id: "leaf-5", keys: [70, 80], records: [{ key: 70, name: "Judy", page: "Page 0x3A" }, { key: 80, name: "Mallory", page: "Page 0x3A" }] },
      { id: "leaf-6", keys: [85, 95], records: [{ key: 85, name: "Oscar", page: "Page 0x3B" }, { key: 95, name: "Peggy", page: "Page 0x3B" }] },
    ],
  };

  const handleSearch = () => {
    setIsAnimating(true);
    setVisitedNodes([]);

    if (scanType === "index") {
      // Step 1: Root
      setTimeout(() => {
        setVisitedNodes(["root"]);

        // Step 2: Determine Internal Node
        let targetInt = "int-2";
        let targetLeaf = "leaf-3";
        if (searchKey < 40) {
          targetInt = "int-1";
          targetLeaf = searchKey < 20 ? "leaf-1" : "leaf-2";
        } else if (searchKey >= 70) {
          targetInt = "int-3";
          targetLeaf = searchKey < 85 ? "leaf-5" : "leaf-6";
        } else {
          targetInt = "int-2";
          targetLeaf = searchKey < 55 ? "leaf-3" : "leaf-4";
        }

        setTimeout(() => {
          setVisitedNodes(["root", targetInt]);

          // Step 3: Determine Leaf Node
          setTimeout(() => {
            setVisitedNodes(["root", targetInt, targetLeaf]);
            setIsAnimating(false);
          }, 650);
        }, 650);
      }, 500);
    } else {
      // Full table scan animation
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setFullScanProgress(count);
        if (count >= 6) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 250);
    }
  };

  const handleReset = () => {
    setVisitedNodes([]);
    setFullScanProgress(0);
    setIsAnimating(false);
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
            <h4 className="text-base font-serif font-bold text-ink">B+ Tree Index Traversal Engine</h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Observe logarithmic pointer traversal versus physical sequential page scans.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border-warm p-0.5 bg-paper text-xs">
            <button
              onClick={() => { setScanType("index"); handleReset(); }}
              className={`px-2.5 py-1 rounded transition-colors font-mono ${scanType === "index" ? "bg-ink text-paper font-semibold shadow-sm" : "text-ink-muted hover:text-ink"}`}
            >
              B+ Tree Index Scan
            </button>
            <button
              onClick={() => { setScanType("full"); handleReset(); }}
              className={`px-2.5 py-1 rounded transition-colors font-mono ${scanType === "full" ? "bg-accent-orange text-paper font-semibold shadow-sm" : "text-ink-muted hover:text-ink"}`}
            >
              Full Table Scan
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-paper border border-border-warm rounded px-2 py-1">
            <span className="text-xs font-mono text-ink-muted">Key:</span>
            <select
              value={searchKey}
              onChange={(e) => { setSearchKey(Number(e.target.value)); handleReset(); }}
              className="bg-transparent text-xs font-mono font-bold text-ink outline-none cursor-pointer"
            >
              {[10, 15, 20, 30, 40, 45, 50, 55, 65, 70, 80, 85, 95].map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={isAnimating}
            className="flex items-center gap-1 px-3 py-1 bg-accent-sage text-paper text-xs font-mono font-semibold rounded hover:brightness-105 transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3" /> Search
          </button>
          <button
            onClick={handleReset}
            className="p-1 border border-border-warm rounded text-ink-muted hover:text-ink hover:bg-paper"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-5 relative overflow-x-auto pb-4">
        {scanType === "index" ? (
          <div className="min-w-[640px] flex flex-col items-center gap-6">
            {/* Level 0: Root */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint mb-1">
                Level 0 — Root Page [Node 0x01]
              </span>
              <div
                className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border-2 transition-all duration-300 ${
                  visitedNodes.includes("root")
                    ? "bg-accent-brass/10 border-accent-brass ring-4 ring-accent-brass/20 scale-105"
                    : "bg-paper border-border-warm"
                }`}
              >
                <div className="text-xs font-mono text-ink-muted">Keys:</div>
                {treeData.root.keys.map((k) => (
                  <span
                    key={k}
                    className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                      searchKey === k
                        ? "bg-accent-orange text-paper"
                        : "bg-border-warm/50 text-ink"
                    }`}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Level 1: Internal Nodes */}
            <div className="w-full flex justify-around items-center px-4">
              {treeData.internal.map((node) => {
                const isVisited = visitedNodes.includes(node.id);
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-ink-muted mb-1">
                      {node.parentKey}
                    </span>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded border-2 transition-all duration-300 ${
                        isVisited
                          ? "bg-accent-brass/10 border-accent-brass ring-4 ring-accent-brass/20 scale-105"
                          : "bg-paper border-border-warm"
                      }`}
                    >
                      <div className="text-[11px] font-mono text-ink-muted">Split:</div>
                      {node.keys.map((k) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-border-warm/50 text-ink"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level 2: Leaf Nodes (Data Pages) */}
            <div className="w-full grid grid-cols-6 gap-2">
              {treeData.leaves.map((leaf) => {
                const isVisited = visitedNodes.includes(leaf.id);
                const hasTarget = leaf.keys.includes(searchKey);
                return (
                  <div
                    key={leaf.id}
                    className={`flex flex-col p-2.5 rounded border-2 transition-all duration-300 ${
                      isVisited
                        ? hasTarget
                          ? "bg-accent-sage/15 border-accent-sage ring-4 ring-accent-sage/20 scale-105"
                          : "bg-accent-brass/10 border-accent-brass"
                        : "bg-paper border-border-warm"
                    }`}
                  >
                    <div className="text-[9px] font-mono text-ink-muted uppercase mb-1">
                      Leaf Page
                    </div>
                    <div className="flex flex-col gap-1">
                      {leaf.records?.map((rec) => (
                        <div
                          key={rec.key}
                          className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[11px] font-mono ${
                            rec.key === searchKey && isVisited
                              ? "bg-accent-sage text-paper font-bold"
                              : "text-ink bg-canvas/60"
                          }`}
                        >
                          <span>#{rec.key}</span>
                          <span className="truncate ml-1">{rec.name}</span>
                        </div>
                      ))}
                    </div>
                    {isVisited && hasTarget && (
                      <span className="mt-2 text-[9px] font-mono text-accent-sage font-bold uppercase text-center bg-accent-sage/20 py-0.5 rounded">
                        Row Match!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Full Table Scan View */
          <div className="flex flex-col gap-3 py-2">
            <div className="text-xs font-mono text-ink-muted flex items-center gap-2">
              <Database className="w-4 h-4 text-accent-orange" />
              <span>Scanning consecutive heap file blocks without index:</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {treeData.leaves.map((leaf, idx) => {
                const isScanned = fullScanProgress > idx;
                const isCurrent = fullScanProgress === idx + 1;
                const hasTarget = leaf.keys.includes(searchKey);
                return (
                  <div
                    key={leaf.id}
                    className={`p-3 rounded border-2 transition-all ${
                      isCurrent
                        ? "bg-accent-orange/20 border-accent-orange scale-105"
                        : isScanned
                        ? hasTarget
                          ? "bg-accent-sage/20 border-accent-sage"
                          : "bg-border-warm/20 border-border-warm opacity-60"
                        : "bg-paper border-border-warm"
                    }`}
                  >
                    <div className="text-[10px] font-mono text-ink-muted">Page 0x0{idx + 1}</div>
                    <div className="text-xs font-mono font-bold mt-1">
                      {leaf.keys.join(", ")}
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-ink-faint">
                      {isCurrent ? "Reading I/O..." : isScanned ? (hasTarget ? "FOUND" : "Checked") : "Pending"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Metrics & Analytical Summary Footer */}
      <div className="mt-4 pt-3 border-t border-border-warm flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-brass" />
            <span className="text-ink-muted">Tree Height:</span>
            <span className="font-bold text-ink">3 Levels</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent-sage" />
            <span className="text-ink-muted">Page I/O Cost:</span>
            <span className="font-bold text-ink">
              {scanType === "index" ? (visitedNodes.length > 0 ? `${visitedNodes.length} Pages (O(log N))` : "—") : (fullScanProgress > 0 ? `${fullScanProgress} Pages (O(N))` : "—")}
            </span>
          </div>
        </div>

        <div className="text-ink-muted">
          {scanType === "index" ? (
            <span>Index efficiency factor: <strong>2x faster</strong> page read count</span>
          ) : (
            <span className="text-accent-orange font-semibold">Full scan forced to load all 6 heap pages into buffer memory</span>
          )}
        </div>
      </div>
    </div>
  );
}
