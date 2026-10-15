"use client";

import React, { useState } from "react";
import { BarChart3, Filter, Sparkles } from "lucide-react";

export function PowerBiVisualizer() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const salesData = [
    { region: "North America", category: "Hardware", month: "Jan", sales: 120, target: 100 },
    { region: "North America", category: "Hardware", month: "Feb", sales: 145, target: 110 },
    { region: "North America", category: "Software", month: "Jan", sales: 85, target: 80 },
    { region: "North America", category: "Software", month: "Feb", sales: 95, target: 85 },
    { region: "Europe", category: "Hardware", month: "Jan", sales: 90, target: 95 },
    { region: "Europe", category: "Hardware", month: "Feb", sales: 110, target: 100 },
    { region: "Europe", category: "Software", month: "Jan", sales: 70, target: 65 },
    { region: "Europe", category: "Software", month: "Feb", sales: 85, target: 75 },
    { region: "Asia Pacific", category: "Hardware", month: "Jan", sales: 150, target: 130 },
    { region: "Asia Pacific", category: "Hardware", month: "Feb", sales: 180, target: 140 },
    { region: "Asia Pacific", category: "Software", month: "Jan", sales: 110, target: 90 },
    { region: "Asia Pacific", category: "Software", month: "Feb", sales: 130, target: 100 },
  ];

  // Slicer filter
  const filtered = salesData.filter((d) => {
    if (selectedRegion !== "All" && d.region !== selectedRegion) return false;
    if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
    return true;
  });

  const totalSales = filtered.reduce((acc, d) => acc + d.sales, 0);
  const totalTarget = filtered.reduce((acc, d) => acc + d.target, 0);
  const performancePct = totalTarget > 0 ? Math.round((totalSales / totalTarget) * 100) : 100;

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-5 font-sans my-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-brass px-2 py-0.5 bg-paper rounded border border-border-warm">
              Analytics Studio
            </span>
            <h4 className="text-base font-serif font-bold text-ink">
              Power BI Dimensional Reporting & DAX Engine
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Explore Star Schema dimensional slicing, cross-filtering, and DAX aggregated measures.
          </p>
        </div>

        {/* Slicer Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-paper border border-border-warm rounded px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-accent-brass" />
            <span className="text-ink-muted">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent font-bold text-ink outline-none cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-paper border border-border-warm rounded px-2 py-1">
            <span className="text-ink-muted">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-ink outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-paper rounded-lg border border-border-warm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1">
            Total Materialized Revenue
          </div>
          <div className="text-xl font-serif font-bold text-ink">
            ${(totalSales * 1000).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-accent-sage mt-1">
            DAX: [Total Sales Amount]
          </div>
        </div>

        <div className="p-3 bg-paper rounded-lg border border-border-warm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1">
            Sales Target Attainment
          </div>
          <div className="text-xl font-serif font-bold text-accent-orange">
            {performancePct}%
          </div>
          <div className="text-[11px] font-mono text-ink-muted mt-1">
            Target: ${(totalTarget * 1000).toLocaleString()}
          </div>
        </div>

        <div className="p-3 bg-paper rounded-lg border border-border-warm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mb-1">
            Dimensional Cross-Filter
          </div>
          <div className="text-sm font-mono font-bold text-ink mt-1 truncate">
            {selectedRegion} / {selectedCategory}
          </div>
          <div className="text-[11px] font-mono text-accent-brass mt-1">
            {filtered.length} Fact Records Aggregated
          </div>
        </div>
      </div>

      {/* Visual Chart Rig */}
      <div className="mt-4 border border-border-warm rounded-lg overflow-hidden bg-paper p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-ink">
            <BarChart3 className="w-4 h-4 text-accent-brass" />
            <span>Regional Sales Volume Comparison</span>
          </div>
          <span className="text-[10px] font-mono text-ink-muted">In Thousands ($K)</span>
        </div>

        {/* Bar Visualizer */}
        <div className="space-y-3">
          {["North America", "Europe", "Asia Pacific"].map((reg) => {
            if (selectedRegion !== "All" && selectedRegion !== reg) return null;
            const regSales = filtered
              .filter((d) => d.region === reg)
              .reduce((acc, d) => acc + d.sales, 0);
            const maxVal = 400;
            const pct = Math.min(100, Math.round((regSales / maxVal) * 100));

            return (
              <div key={reg} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ink">{reg}</span>
                  <span className="text-accent-orange font-bold">${regSales}k</span>
                </div>
                <div className="w-full h-3 bg-canvas rounded-full overflow-hidden border border-border-warm">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-accent-brass transition-all duration-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* DAX Formula Insight Card */}
        <div className="mt-4 pt-3 border-t border-border-warm bg-canvas p-3 rounded text-xs font-mono">
          <div className="text-[10px] uppercase text-accent-sage font-bold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Under the Hood: DAX Calculation Engine
          </div>
          <code className="text-ink">
            Sales_Attainment = DIVIDE(SUM(FactSales[Revenue]), SUM(FactSales[TargetRevenue]), 0)
          </code>
        </div>
      </div>
    </div>
  );
}
