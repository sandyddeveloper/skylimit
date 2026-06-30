"use client";

import { useEffect, useState } from "react";
import type { ContributionData } from "@/hooks/use-github-stats";

interface ContributionGridProps {
  data: ContributionData | null;
  loading: boolean;
  delay?: number;
}

const LEVEL_COLORS = [
  "var(--sd-contrib-l0)",    // level 0 — empty (visible grid shape)
  "var(--sd-contrib-l1)", // level 1
  "var(--sd-contrib-l2)", // level 2
  "var(--sd-contrib-l3)", // level 3
  "var(--sd-contrib-l4)",   // level 4
];

export function ContributionGrid({ data, loading, delay = 400 }: ContributionGridProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || !data) return;
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [loading, data, delay]);

  if (loading || !data) {
    return (
      <div className="sd-contrib-section sd-contrib-skeleton">
        <div className="sd-skeleton-line sd-skeleton-contrib-title" />
        <div className="sd-contrib-grid-skeleton">
          {Array.from({ length: 140 }, (_, i) => (
            <div key={i} className="sd-contrib-cell-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const weeklyTotals = data.weeks.map((w) => w.reduce((sum, d) => sum + d.count, 0));
  const maxWeekly = Math.max(...weeklyTotals, 1);
  const chartHeight = 50;
  const chartWidth = 320;

  const points = weeklyTotals.map((val, idx) => {
    const x = (idx / (weeklyTotals.length - 1)) * chartWidth;
    const y = chartHeight - 4 - (val / maxWeekly) * (chartHeight - 8);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${chartHeight} L ${points[0].x.toFixed(1)} ${chartHeight} Z`
    : "";

  return (
    <div
      className={`sd-contrib-section ${visible ? "sd-contrib-in" : ""}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <div className="sd-contrib-header">
        <h3 className="sd-section-title">Activity</h3>
        <span className="sd-contrib-total">
          {data.totalContributions.toLocaleString()} contributions
        </span>
      </div>

      <div className="sd-contrib-grid">
        {data.weeks.map((week, wi) => (
          <div key={wi} className="sd-contrib-col">
            {week.map((day, di) => (
              <div
                key={`${wi}-${di}`}
                className="sd-contrib-cell"
                style={{
                  backgroundColor: visible ? LEVEL_COLORS[day.level] : LEVEL_COLORS[0],
                  transitionDelay: visible ? `${(wi * 7 + di) * 4}ms` : "0ms",
                }}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="sd-contrib-legend">
        <span className="sd-contrib-legend-label">Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div
            key={i}
            className="sd-contrib-legend-cell"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="sd-contrib-legend-label">More</span>
      </div>

      {/* Commit Sparkline Trend Line */}
      <div className="sd-contrib-chart-wrap">
        <div className="sd-contrib-chart-header">
          <span className="sd-contrib-chart-lbl">Commit Activity Trend</span>
          <span className="sd-contrib-chart-peak">Peak: {maxWeekly} commits/wk</span>
        </div>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="sd-contrib-chart-svg">
          <defs>
            <linearGradient id="contrib-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--sd-log-system)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--sd-log-system)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1="0" y1={chartHeight - 4} x2={chartWidth} y2={chartHeight - 4} stroke="var(--sd-card-border)" strokeWidth="1" />
          <line x1="0" y1="4" x2={chartWidth} y2={4} stroke="var(--sd-card-border)" strokeOpacity="0.35" strokeWidth="1" />
          
          <path d={areaPath} fill="url(#contrib-area-grad)" />
          <path
            d={linePath}
            fill="transparent"
            stroke="var(--sd-log-system)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
