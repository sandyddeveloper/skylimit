"use client";

import { useEffect, useState } from "react";
import type { LanguageStat } from "@/hooks/use-github-stats";

interface LanguageBarProps {
  languages: LanguageStat[];
  loading: boolean;
  delay?: number;
}

export function LanguageBar({ languages, loading, delay = 600 }: LanguageBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (loading || languages.length === 0) return;
    const timeout = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timeout);
  }, [loading, languages, delay]);

  if (loading) {
    return (
      <div className="sd-lang-section sd-lang-skeleton">
        <div className="sd-skeleton-line sd-skeleton-lang-title" />
        <div className="sd-lang-track-skeleton" />
        <div className="sd-lang-legend-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="sd-skeleton-line sd-skeleton-lang-item" />
          ))}
        </div>
      </div>
    );
  }

  // Doughnut segments math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const topLang = languages[0] || { name: "None", percentage: 0 };

  const segments = languages.map((lang, i) => {
    const strokeDashoffset = circumference - (lang.percentage / 100) * circumference;
    const prevPercentageSum = languages.slice(0, i).reduce((sum, l) => sum + l.percentage, 0);
    const rotation = (prevPercentageSum / 100) * 360;
    return (
      <circle
        key={lang.name}
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke={lang.color}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={animated ? strokeDashoffset : circumference}
        transform={`rotate(${rotation - 90} 50 50)`}
        style={{
          transition: "stroke-dashoffset 1.3s cubic-bezier(0.19, 1, 0.22, 1)",
          transitionDelay: `${i * 100}ms`,
        }}
      />
    );
  });

  return (
    <div
      className={`sd-lang-section ${animated ? "sd-lang-in" : ""}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <h3 className="sd-section-title">Top Languages</h3>

      <div className="sd-lang-body">
        {/* Doughnut SVG */}
        <div className="sd-lang-chart-container">
          <svg viewBox="0 0 100 100" className="sd-lang-doughnut">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--sd-lang-track-bg)" strokeWidth="6" />
            {segments}
          </svg>
          <div className="sd-lang-center-text">
            <span className="sd-lang-center-val">{topLang.percentage.toFixed(0)}%</span>
            <span className="sd-lang-center-lbl">{topLang.name}</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="sd-lang-legend">
          {languages.map((lang) => (
            <div key={lang.name} className="sd-lang-item">
              <div className="sd-lang-item-header">
                <span
                  className="sd-lang-dot"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="sd-lang-name">{lang.name}</span>
                <span className="sd-lang-pct">{lang.percentage.toFixed(1)}%</span>
              </div>
              <div className="sd-lang-item-bar-bg">
                <div
                  className="sd-lang-item-bar"
                  style={{
                    backgroundColor: lang.color,
                    width: animated ? `${lang.percentage}%` : "0%",
                    transition: "width 1.1s cubic-bezier(0.19, 1, 0.22, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
