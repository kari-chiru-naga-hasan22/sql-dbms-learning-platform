"use client";

import React, { useState } from "react";
import { FileJson } from "lucide-react";

interface MongoDoc {
  _id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  specs: { ram_gb: number; storage_gb: number; color: string };
  stock: number;
}

export function NoSqlVisualizer() {
  const [activeStage, setActiveStage] = useState<"$all" | "$match" | "$project" | "$group">("$all");

  const initialDocs: MongoDoc[] = [
    {
      _id: "6501a1b2c3d4e5f601",
      name: "Quantum Laptop Pro",
      category: "Laptops",
      price: 1299.99,
      tags: ["workstation", "developer", "4k"],
      specs: { ram_gb: 32, storage_gb: 1000, color: "Space Gray" },
      stock: 15,
    },
    {
      _id: "6501a1b2c3d4e5f602",
      name: "AirFlow Ultrabook",
      category: "Laptops",
      price: 899.50,
      tags: ["ultralight", "student", "battery"],
      specs: { ram_gb: 16, storage_gb: 512, color: "Silver" },
      stock: 28,
    },
    {
      _id: "6501a1b2c3d4e5f603",
      name: "ErgoMechanical Keyboard",
      category: "Peripherals",
      price: 149.00,
      tags: ["mechanical", "rgb", "ergonomic"],
      specs: { ram_gb: 0, storage_gb: 0, color: "Matte Black" },
      stock: 64,
    },
    {
      _id: "6501a1b2c3d4e5f604",
      name: "Studio 4K Ultra Display",
      category: "Monitors",
      price: 649.00,
      tags: ["4k", "hdr", "color-accurate"],
      specs: { ram_gb: 0, storage_gb: 0, color: "Silver" },
      stock: 8,
    },
  ];

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-5 font-sans my-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-sage px-2 py-0.5 bg-paper rounded border border-border-warm">
              NoSQL Simulator
            </span>
            <h4 className="text-base font-serif font-bold text-ink">
              MongoDB Document Model & Aggregation Pipeline
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Experience schema-flexible BSON document structures and multistage aggregation transforms.
          </p>
        </div>

        {/* Aggregation Stage Buttons */}
        <div className="flex rounded-md border border-border-warm p-0.5 bg-paper text-xs font-mono">
          <button
            onClick={() => setActiveStage("$all")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStage === "$all" ? "bg-ink text-paper font-bold shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            Raw Collection
          </button>
          <button
            onClick={() => setActiveStage("$match")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStage === "$match" ? "bg-accent-orange text-paper font-bold shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            $match
          </button>
          <button
            onClick={() => setActiveStage("$project")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStage === "$project" ? "bg-accent-brass text-ink font-bold shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            $project
          </button>
          <button
            onClick={() => setActiveStage("$group")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStage === "$group" ? "bg-accent-sage text-paper font-bold shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            $group
          </button>
        </div>
      </div>

      {/* Code pipeline banner */}
      <div className="mt-4 p-3 bg-paper rounded border border-border-warm font-mono text-xs">
        {activeStage === "$all" && (
          <div>
            <span className="text-accent-orange font-bold">db.products.find()</span>
            <p className="text-ink-muted mt-1 font-sans text-xs">
              Showing raw nested BSON documents. Notice heterogeneous attributes like embedded <code>specs</code> objects and <code>tags</code> arrays without separate relational tables.
            </p>
          </div>
        )}
        {activeStage === "$match" && (
          <div>
            <span className="text-accent-orange font-bold">
              db.products.aggregate([ {"{"} $match: {"{"} category: &quot;Laptops&quot;, price: {"{"} $gte: 900 {"}"} {"}"} {"}"} ])
            </span>
            <p className="text-ink-muted mt-1 font-sans text-xs">
              Filters document stream analogous to SQL <code>WHERE</code> clause.
            </p>
          </div>
        )}
        {activeStage === "$project" && (
          <div>
            <span className="text-accent-brass font-bold">
              db.products.aggregate([ {"{"} $project: {"{"} name: 1, &quot;specs.ram_gb&quot;: 1, total_inventory_value: {"{"} $multiply: [&quot;$price&quot;, &quot;$stock&quot;] {"}"} {"}"} {"}"} ])
            </span>
            <p className="text-ink-muted mt-1 font-sans text-xs">
              Reshapes documents, computes calculated fields, and projects nested attributes.
            </p>
          </div>
        )}
        {activeStage === "$group" && (
          <div>
            <span className="text-accent-sage font-bold">
              db.products.aggregate([ {"{"} $group: {"{"} _id: &quot;$category&quot;, avgPrice: {"{"} $avg: &quot;$price&quot; {"}"}, count: {"{"} $sum: 1 {"}"} {"}"} {"}"} ])
            </span>
            <p className="text-ink-muted mt-1 font-sans text-xs">
              Groups documents by field expression and computes accumulators (like SQL <code>GROUP BY</code>).
            </p>
          </div>
        )}
      </div>

      {/* Document Viewer Container */}
      <div className="mt-4 border border-border-warm rounded-lg overflow-hidden bg-paper">
        <div className="px-3 py-2 bg-canvas border-b border-border-warm flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-accent-brass" />
            <span className="font-bold text-ink">BSON Document Stream Output</span>
          </div>
          <span className="text-ink-muted">
            {activeStage === "$all" ? "4 Documents" : activeStage === "$match" ? "1 Matched" : activeStage === "$project" ? "4 Projected" : "3 Groups"}
          </span>
        </div>

        <div className="p-3 max-h-72 overflow-y-auto space-y-3 font-mono text-xs">
          {activeStage === "$all" &&
            initialDocs.map((doc) => (
              <pre
                key={doc._id}
                className="bg-canvas p-3 rounded border border-border-warm text-ink overflow-x-auto"
              >
                {JSON.stringify(doc, null, 2)}
              </pre>
            ))}

          {activeStage === "$match" && (
            <pre className="bg-canvas p-3 rounded border border-accent-orange text-ink overflow-x-auto">
              {JSON.stringify(
                initialDocs.filter((d) => d.category === "Laptops" && d.price >= 900),
                null,
                2
              )}
            </pre>
          )}

          {activeStage === "$project" &&
            initialDocs.map((doc) => (
              <pre
                key={doc._id}
                className="bg-canvas p-3 rounded border border-accent-brass text-ink overflow-x-auto"
              >
                {JSON.stringify(
                  {
                    _id: doc._id,
                    name: doc.name,
                    ram_gb: doc.specs.ram_gb,
                    total_inventory_value: Math.round(doc.price * doc.stock * 100) / 100,
                  },
                  null,
                  2
                )}
              </pre>
            ))}

          {activeStage === "$group" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-canvas rounded border border-accent-sage">
                <div className="text-[10px] text-accent-sage font-bold uppercase mb-1">Group: Laptops</div>
                <div className="text-xs">Count: 2</div>
                <div className="text-xs">Avg Price: $1,099.75</div>
              </div>
              <div className="p-3 bg-canvas rounded border border-accent-sage">
                <div className="text-[10px] text-accent-sage font-bold uppercase mb-1">Group: Peripherals</div>
                <div className="text-xs">Count: 1</div>
                <div className="text-xs">Avg Price: $149.00</div>
              </div>
              <div className="p-3 bg-canvas rounded border border-accent-sage">
                <div className="text-[10px] text-accent-sage font-bold uppercase mb-1">Group: Monitors</div>
                <div className="text-xs">Count: 1</div>
                <div className="text-xs">Avg Price: $649.00</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
