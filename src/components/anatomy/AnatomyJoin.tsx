"use client";

import React, { useState } from "react";
import { GitMerge } from "lucide-react";

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL" | "CROSS";

interface Customer {
  id: number;
  name: string;
  city: string;
}

interface Order {
  orderId: number;
  custId: number | null;
  amount: string;
}

export function AnatomyJoin() {
  const [joinType, setJoinType] = useState<JoinType>("INNER");
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);

  const leftTable: Customer[] = [
    { id: 1, name: "Alice", city: "Boston" },
    { id: 2, name: "Bob", city: "Seattle" },
    { id: 3, name: "Charlie", city: "Chicago" },
    { id: 4, name: "Diana", city: "Austin" },
  ];

  const rightTable: Order[] = [
    { orderId: 101, custId: 1, amount: "$450" },
    { orderId: 102, custId: 1, amount: "$120" },
    { orderId: 103, custId: 2, amount: "$890" },
    { orderId: 104, custId: 5, amount: "$310" },
  ];

  // Calculate Join Result Rows
  const getJoinedRows = () => {
    const result: Array<{
      custId: number | null;
      name: string | null;
      city: string | null;
      orderId: number | null;
      orderCustId: number | null;
      amount: string | null;
      matchType: "match" | "left-null" | "right-null" | "cross";
    }> = [];

    if (joinType === "CROSS") {
      leftTable.forEach((l) => {
        rightTable.forEach((r) => {
          result.push({
            custId: l.id,
            name: l.name,
            city: l.city,
            orderId: r.orderId,
            orderCustId: r.custId,
            amount: r.amount,
            matchType: "cross",
          });
        });
      });
      return result;
    }

    if (joinType === "INNER" || joinType === "LEFT" || joinType === "FULL") {
      leftTable.forEach((l) => {
        const matches = rightTable.filter((r) => r.custId === l.id);
        if (matches.length > 0) {
          matches.forEach((r) => {
            result.push({
              custId: l.id,
              name: l.name,
              city: l.city,
              orderId: r.orderId,
              orderCustId: r.custId,
              amount: r.amount,
              matchType: "match",
            });
          });
        } else if (joinType === "LEFT" || joinType === "FULL") {
          result.push({
            custId: l.id,
            name: l.name,
            city: l.city,
            orderId: null,
            orderCustId: null,
            amount: null,
            matchType: "left-null",
          });
        }
      });
    }

    if (joinType === "RIGHT" || joinType === "FULL") {
      rightTable.forEach((r) => {
        const matches = leftTable.filter((l) => l.id === r.custId);
        if (matches.length === 0) {
          result.push({
            custId: null,
            name: null,
            city: null,
            orderId: r.orderId,
            orderCustId: r.custId,
            amount: r.amount,
            matchType: "right-null",
          });
        } else if (joinType === "RIGHT") {
          matches.forEach((l) => {
            result.push({
              custId: l.id,
              name: l.name,
              city: l.city,
              orderId: r.orderId,
              orderCustId: r.custId,
              amount: r.amount,
              matchType: "match",
            });
          });
        }
      });
    }

    return result;
  };

  const joinedRows = getJoinedRows();

  const joinDescriptions: Record<JoinType, { title: string; sql: string; desc: string }> = {
    INNER: {
      title: "INNER JOIN",
      sql: "SELECT * FROM customers c INNER JOIN orders o ON c.id = o.cust_id;",
      desc: "Returns only records where the join key matches in BOTH relations. Unmatched customers (Charlie, Diana) and orders with unknown customers (#104) are excluded.",
    },
    LEFT: {
      title: "LEFT OUTER JOIN",
      sql: "SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.cust_id;",
      desc: "Preserves ALL rows from the Left table (Customers). When no matching order exists, order attributes are populated with NULL.",
    },
    RIGHT: {
      title: "RIGHT OUTER JOIN",
      sql: "SELECT * FROM customers c RIGHT JOIN orders o ON c.id = o.cust_id;",
      desc: "Preserves ALL rows from the Right table (Orders). When an order has an unmapped customer (cust_id 5), customer attributes are populated with NULL.",
    },
    FULL: {
      title: "FULL OUTER JOIN",
      sql: "SELECT * FROM customers c FULL OUTER JOIN orders o ON c.id = o.cust_id;",
      desc: "Preserves ALL rows from both tables. Matches are combined, and gaps on either side are padded with NULLs.",
    },
    CROSS: {
      title: "CROSS JOIN",
      sql: "SELECT * FROM customers c CROSS JOIN orders o;",
      desc: "Computes the full Cartesian Product (4 customers x 4 orders = 16 row combinations). No ON predicate is evaluated.",
    },
  };

  return (
    <div className="bg-canvas border border-border-warm rounded-lg p-5 font-sans my-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-orange px-2 py-0.5 bg-paper rounded border border-border-warm">
              Anatomy Visualizer
            </span>
            <h4 className="text-base font-serif font-bold text-ink">
              Relational JOIN Key Matcher
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Observe how join predicates correlate primary and foreign keys across independent relation tuples.
          </p>
        </div>

        {/* Join Dial Selector */}
        <div className="flex rounded-md border border-border-warm p-0.5 bg-paper text-xs font-mono">
          {(["INNER", "LEFT", "RIGHT", "FULL", "CROSS"] as JoinType[]).map((type) => (
            <button
              key={type}
              onClick={() => setJoinType(type)}
              className={`px-2.5 py-1 rounded transition-colors ${
                joinType === type
                  ? "bg-ink text-paper font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Snippet & Explanation */}
      <div className="mt-4 p-3 bg-paper rounded border border-border-warm">
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono text-accent-orange font-bold">
            {joinDescriptions[joinType].sql}
          </code>
          <span className="text-xs font-mono text-ink-muted font-bold">
            Output: {joinedRows.length} Rows
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-2 font-sans">
          {joinDescriptions[joinType].desc}
        </p>
      </div>

      {/* Side-by-Side Source Tables */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Table: Customers */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-1.5 bg-canvas border-b border-border-warm flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink">Left Table: customers</span>
            <span className="text-[10px] font-mono text-accent-brass">PK: id</span>
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                <th className="px-3 py-1.5">id (PK)</th>
                <th className="px-3 py-1.5">name</th>
                <th className="px-3 py-1.5">city</th>
              </tr>
            </thead>
            <tbody>
              {leftTable.map((cust) => {
                const isHovered = hoveredKey === cust.id;
                const hasMatch = rightTable.some((r) => r.custId === cust.id);
                return (
                  <tr
                    key={cust.id}
                    onMouseEnter={() => setHoveredKey(cust.id)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`border-b border-border-warm/50 cursor-pointer transition-colors ${
                      isHovered
                        ? "bg-accent-brass/20"
                        : hasMatch
                        ? "hover:bg-accent-sage/10"
                        : "hover:bg-canvas"
                    }`}
                  >
                    <td className="px-3 py-1.5 font-bold text-accent-orange">#{cust.id}</td>
                    <td className="px-3 py-1.5 text-ink">{cust.name}</td>
                    <td className="px-3 py-1.5 text-ink-muted">{cust.city}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Table: Orders */}
        <div className="border border-border-warm rounded-lg overflow-hidden bg-paper">
          <div className="px-3 py-1.5 bg-canvas border-b border-border-warm flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink">Right Table: orders</span>
            <span className="text-[10px] font-mono text-accent-sage">FK: cust_id</span>
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border-warm text-ink-muted text-left bg-canvas/40">
                <th className="px-3 py-1.5">order_id</th>
                <th className="px-3 py-1.5">cust_id (FK)</th>
                <th className="px-3 py-1.5">amount</th>
              </tr>
            </thead>
            <tbody>
              {rightTable.map((order) => {
                const isHovered = hoveredKey === order.custId;
                const hasMatch = leftTable.some((l) => l.id === order.custId);
                return (
                  <tr
                    key={order.orderId}
                    onMouseEnter={() => setHoveredKey(order.custId)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`border-b border-border-warm/50 cursor-pointer transition-colors ${
                      isHovered
                        ? "bg-accent-brass/20"
                        : hasMatch
                        ? "hover:bg-accent-sage/10"
                        : "hover:bg-canvas"
                    }`}
                  >
                    <td className="px-3 py-1.5 text-ink-muted">#{order.orderId}</td>
                    <td className="px-3 py-1.5 font-bold text-accent-sage">
                      {order.custId !== null ? `#${order.custId}` : "NULL"}
                    </td>
                    <td className="px-3 py-1.5 text-ink font-semibold">{order.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Output Projection Grid */}
      <div className="mt-4 border border-border-warm rounded-lg overflow-hidden bg-paper">
        <div className="px-3 py-2 bg-ink text-paper flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitMerge className="w-3.5 h-3.5 text-accent-brass" />
            <span className="text-xs font-mono font-bold">
              Materialized Result Set ({joinType} JOIN)
            </span>
          </div>
          <span className="text-[10px] font-mono text-paper-dark">
            Columns: (id, name, city, order_id, amount)
          </span>
        </div>

        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-canvas border-b border-border-warm">
              <tr className="text-ink-muted text-left">
                <th className="px-3 py-1.5">c.id</th>
                <th className="px-3 py-1.5">c.name</th>
                <th className="px-3 py-1.5">c.city</th>
                <th className="px-3 py-1.5">o.order_id</th>
                <th className="px-3 py-1.5">o.amount</th>
                <th className="px-3 py-1.5 text-right">Row Status</th>
              </tr>
            </thead>
            <tbody>
              {joinedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-border-warm/40 ${
                    row.matchType === "match"
                      ? "bg-accent-sage/5 hover:bg-accent-sage/15"
                      : row.matchType === "left-null" || row.matchType === "right-null"
                      ? "bg-accent-orange/5 hover:bg-accent-orange/15"
                      : "hover:bg-canvas"
                  }`}
                >
                  <td className="px-3 py-1.5 font-bold text-accent-orange">
                    {row.custId !== null ? `#${row.custId}` : <span className="text-ink-faint italic font-normal">NULL</span>}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.name || <span className="text-ink-faint italic font-normal">NULL</span>}
                  </td>
                  <td className="px-3 py-1.5 text-ink-muted">
                    {row.city || <span className="text-ink-faint italic font-normal">NULL</span>}
                  </td>
                  <td className="px-3 py-1.5 text-accent-sage font-bold">
                    {row.orderId !== null ? `#${row.orderId}` : <span className="text-ink-faint italic font-normal">NULL</span>}
                  </td>
                  <td className="px-3 py-1.5 font-semibold">
                    {row.amount || <span className="text-ink-faint italic font-normal">NULL</span>}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {row.matchType === "match" && (
                      <span className="text-[10px] text-accent-sage font-bold uppercase bg-accent-sage/15 px-1.5 py-0.5 rounded">
                        Key Matched
                      </span>
                    )}
                    {row.matchType === "left-null" && (
                      <span className="text-[10px] text-accent-orange font-bold uppercase bg-accent-orange/15 px-1.5 py-0.5 rounded">
                        Preserved Left (NULL Pad)
                      </span>
                    )}
                    {row.matchType === "right-null" && (
                      <span className="text-[10px] text-accent-brass font-bold uppercase bg-accent-brass/15 px-1.5 py-0.5 rounded">
                        Preserved Right (NULL Pad)
                      </span>
                    )}
                    {row.matchType === "cross" && (
                      <span className="text-[10px] text-ink-muted uppercase bg-canvas px-1.5 py-0.5 rounded">
                        Cross Pair
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
