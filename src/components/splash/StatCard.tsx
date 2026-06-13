"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  delay?: number;
  loading: boolean;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function StatCard({ icon, label, value, delay = 0, loading }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [loading, delay]);

  useEffect(() => {
    if (!visible || value === 0) return;
    const duration = 1600; // slightly faster count up
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.round(easeOutExpo(progress) * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    // start the count animation slightly after card slide in starts to feel more organic
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 150);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, value]);

  if (loading) {
    return (
      <div className="sd-stat-card sd-stat-skeleton">
        <div className="sd-skeleton-line sd-skeleton-icon-line" />
        <div className="sd-skeleton-line sd-skeleton-value-line" />
        <div className="sd-skeleton-line sd-skeleton-label-line" />
      </div>
    );
  }

  return (
    <div
      className={`sd-stat-card ${visible ? "sd-card-in" : ""}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <span className="sd-stat-icon">{icon}</span>
      <span className="sd-stat-value">{displayValue.toLocaleString()}</span>
      <span className="sd-stat-label">{label}</span>
      <span className="sd-stat-shimmer" />
    </div>
  );
}
