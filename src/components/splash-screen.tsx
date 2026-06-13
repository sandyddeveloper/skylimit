"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useGitHubStats } from "@/hooks/use-github-stats";
import { ProfileCard } from "./splash/ProfileCard";
import { StatCard } from "./splash/StatCard";
import { LanguageBar } from "./splash/LanguageBar";
import { ContributionGrid } from "./splash/ContributionGrid";

// ── Subtle floating particles ──
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    interface Dot {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      alpha: number;
      phase: number;
    }

    let dots: Dot[] = [];

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((w * h) / 14000), 100);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: 0.8 + Math.random() * 1.2,
        alpha: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    init();

    let t = 0;
    const animate = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const flicker = 0.5 + 0.5 * Math.sin(t * 2.5 + p.phase);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha * flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="sd-canvas" />;
}

// ── Audio Sound Effects Synthesizer (Pure Web Audio API) ──
class SoundEffects {
  private ctx: AudioContext | null = null;

  initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playWhoosh() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 1.8;

      // 1. Sub-bass sweep
      const oscSub = ctx.createOscillator();
      const subGain = ctx.createGain();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(45, now);
      oscSub.frequency.exponentialRampToValueAtTime(180, now + duration);
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.15, now + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      oscSub.connect(subGain);
      subGain.connect(ctx.destination);
      oscSub.start(now);
      oscSub.stop(now + duration);

      // 2. Cybernetic filter sweep (Triangle wave chorus)
      const oscSaw = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      oscSaw.type = "triangle";
      oscSaw.frequency.setValueAtTime(70, now);
      oscSaw.frequency.exponentialRampToValueAtTime(320, now + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(80, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscSaw.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscSaw.start(now);
      oscSaw.stop(now + duration);

      // 3. Noise component for textured details
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(200, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1600, now + duration);
      noiseFilter.Q.setValueAtTime(2.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.012, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playFlashCharge() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 2.0;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(850, now + duration);

      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(82, now); // detuned
      osc2.frequency.exponentialRampToValueAtTime(856, now + duration);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + duration);
      filter.Q.setValueAtTime(5.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + duration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playFlashBurst() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 1.6;

      // Noise explosion
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(50, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);

      // Low frequency rumble/impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(25, now + 1.0);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 1.0);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playAssembleChime() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Synthesize a beautiful Cmaj9 chord (C4, E4, G4, B4, D5)
      const notes = [261.63, 329.63, 392.00, 493.88, 587.33];
      notes.forEach((f, idx) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const delayOffset = idx * 0.12;
        
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(f, now + delayOffset);
        
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(f + 1.5, now + delayOffset); // slight chorus detuning
        
        gain.gain.setValueAtTime(0.001, now + delayOffset);
        gain.gain.linearRampToValueAtTime(0.04, now + delayOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delayOffset + 2.0);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(now + delayOffset);
        osc2.start(now + delayOffset);
        osc1.stop(now + delayOffset + 2.0);
        osc2.stop(now + delayOffset + 2.0);
      });
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playHover() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playClick() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }
}

const sfx = new SoundEffects();

// ── Developer Streak / Insights Card ──
interface StreakCardProps {
  totalContributions: number;
  loading: boolean;
  delay?: number;
}

export function StreakCard({ totalContributions, loading, delay = 0 }: StreakCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [loading, delay]);

  if (loading) {
    return (
      <div className="sd-streak-section sd-streak-skeleton">
        <div className="sd-skeleton-line sd-skeleton-streak-title" />
        <div className="sd-streak-grid-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sd-skeleton-line sd-skeleton-streak-item" />
          ))}
        </div>
      </div>
    );
  }

  const items = [
    { icon: "🔥", label: "Longest Streak", value: "32 Days", color: "#f97316" },
    { icon: "⚡", label: "Commit Rate", value: "94.8% Active", color: "#eab308" },
    { icon: "🏆", label: "Year Total", value: `${totalContributions.toLocaleString()} Commits`, color: "#10b981" },
  ];

  return (
    <div
      className={`sd-streak-section ${visible ? "sd-streak-in" : ""}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <h3 className="sd-section-title">Developer Insights</h3>
      <div className="sd-streak-list">
        {items.map((item) => (
          <div key={item.label} className="sd-streak-item">
            <div className="sd-streak-icon-wrap" style={{ textShadow: `0 0 10px \${item.color}` }}>
              {item.icon}
            </div>
            <div className="sd-streak-details">
              <span className="sd-streak-label">{item.label}</span>
              <span className="sd-streak-val" style={{ color: item.color }}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { profile, stats, contributions, loading, error } = useGitHubStats();
  const [phase, setPhase] = useState<"loading" | "visible" | "exit" | "done">("loading");
  const [introStage, setIntroStage] = useState<"plain" | "teaser" | "flash" | "assembled">("plain");

  // Unlock audio state on first interaction
  useEffect(() => {
    const unlock = () => {
      sfx.initCtx();
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      // Step 1: Plain screen -> Teaser
      setIntroStage("teaser");

      // Play whoosh sounds for sliding teaser rows
      const tWhoosh1 = setTimeout(() => sfx.playWhoosh(), 100);
      const tWhoosh2 = setTimeout(() => sfx.playWhoosh(), 1300);
      const tWhoosh3 = setTimeout(() => sfx.playWhoosh(), 2500);
      const tWhoosh4 = setTimeout(() => sfx.playWhoosh(), 3700);

      // Play build charge whoosh leading to the flash
      const tCharge = setTimeout(() => sfx.playFlashCharge(), 2300);

      // Step 2: Teaser -> Flash overlay (trigger at 4300ms)
      const tFlash = setTimeout(() => {
        setIntroStage("flash");
        sfx.playFlashBurst();
      }, 4300);

      // Step 3: Flash overlay -> Assembled final state (trigger at 4550ms)
      const tAssembled = setTimeout(() => {
        setIntroStage("assembled");
        setPhase("visible");
        sfx.playAssembleChime();
      }, 4550);

      return () => {
        clearTimeout(tWhoosh1);
        clearTimeout(tWhoosh2);
        clearTimeout(tWhoosh3);
        clearTimeout(tWhoosh4);
        clearTimeout(tCharge);
        clearTimeout(tFlash);
        clearTimeout(tAssembled);
      };
    }
  }, [loading]);

  const handleEnter = useCallback(() => {
    setPhase("exit");
    setTimeout(() => {
      setPhase("done");
      setTimeout(onComplete, 100);
    }, 700);
  }, [onComplete]);

  if (phase === "done") return null;

  const vis = phase === "visible" || phase === "exit";

  const statItems = [
    { icon: "⟐", label: "Commits", value: stats?.totalCommits ?? 0 },
    { icon: "⤝", label: "Pull Requests", value: stats?.totalPRs ?? 0 },
    { icon: "✦", label: "Stars", value: stats?.totalStars ?? 0 },
    { icon: "◈", label: "Repos", value: profile?.public_repos ?? 0 },
  ];

  return (
    <div
      className="sd-root"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(0.97)" : "scale(1)",
      }}
    >
      {/* 1. Only show ParticleCanvas in assembled stage */}
      {introStage === "assembled" && <ParticleCanvas />}

      {/* 2. Teaser gliders (fully cinematic 3D elements) */}
      {introStage === "teaser" && (
        <div className="sd-teaser-container">
          {/* Scene 1: Header */}
          <div className="sd-teaser-element sd-teaser-header">
            <div className="sd-teaser-fullscreen-card sd-teaser-glow-blue">
              <div className="sd-teaser-corner-hud tl" />
              <div className="sd-teaser-corner-hud tr" />
              <div className="sd-teaser-corner-hud bl" />
              <div className="sd-teaser-corner-hud br" />
              <div className="sd-teaser-heading">STATS ANALYTICS</div>
              <div className="sd-teaser-hud-text">SYSTEM INITIALIZATION STARTED...</div>
              <div className="sd-teaser-progressbar-container">
                <div className="sd-teaser-progressbar" />
              </div>
            </div>
          </div>

          {/* Scene 2: Profile */}
          <div className="sd-teaser-element sd-teaser-profile">
            <div className="sd-teaser-fullscreen-card sd-teaser-glow-indigo">
              <div className="sd-teaser-corner-hud tl" />
              <div className="sd-teaser-corner-hud tr" />
              <div className="sd-teaser-corner-hud bl" />
              <div className="sd-teaser-corner-hud br" />
              <div className="sd-teaser-profile-content">
                <div className="sd-teaser-avatar-wrap">
                  <div className="sd-teaser-avatar" />
                  <div className="sd-teaser-avatar-glow" />
                </div>
                <div className="sd-teaser-info">
                  <div className="sd-teaser-profile-title">DEVELOPER PROFILE</div>
                  <div className="sd-teaser-line l1" />
                  <div className="sd-teaser-line l2" />
                  <div className="sd-teaser-line l3" />
                </div>
              </div>
            </div>
          </div>

          {/* Scene 3: Stats Grid */}
          <div className="sd-teaser-element sd-teaser-grid">
            <div className="sd-teaser-fullscreen-card sd-teaser-glow-purple">
              <div className="sd-teaser-corner-hud tl" />
              <div className="sd-teaser-corner-hud tr" />
              <div className="sd-teaser-corner-hud bl" />
              <div className="sd-teaser-corner-hud br" />
              <div className="sd-teaser-grid-title">ANALYTICS METRICS</div>
              <div className="sd-teaser-grid-content">
                {[
                  { lbl: "COMMITS", val: "••••", color: "#a855f7" },
                  { lbl: "PULL REQUESTS", val: "••", color: "#ec4899" },
                  { lbl: "STARS", val: "•••", color: "#e9d5ff" },
                  { lbl: "REPOSITORIES", val: "••", color: "#d8b4fe" },
                ].map((item, idx) => (
                  <div key={idx} className="sd-teaser-card" style={{ borderColor: item.color }}>
                    <div className="sd-teaser-card-icon" style={{ color: item.color }}>✦</div>
                    <div className="sd-teaser-card-val" style={{ textShadow: `0 0 15px ${item.color}` }}>{item.val}</div>
                    <div className="sd-teaser-card-lbl">{item.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scene 4: Bottom Layout */}
          <div className="sd-teaser-element sd-teaser-bottom">
            <div className="sd-teaser-fullscreen-card sd-teaser-glow-violet">
              <div className="sd-teaser-corner-hud tl" />
              <div className="sd-teaser-corner-hud tr" />
              <div className="sd-teaser-corner-hud bl" />
              <div className="sd-teaser-corner-hud br" />
              <div className="sd-teaser-bottom-title">DATA VISUALIZATIONS</div>
              <div className="sd-teaser-bottom-content">
                <div className="sd-teaser-card-bottom cb1">
                  <div className="sd-teaser-cb-header">TOP LANGUAGES</div>
                  <div className="sd-teaser-donut-mock">
                    <div className="sd-teaser-donut-inner" />
                  </div>
                </div>
                <div className="sd-teaser-card-bottom cb2">
                  <div className="sd-teaser-cb-header">INSIGHTS</div>
                  <div className="sd-teaser-streak-mock">
                    <span className="sd-teaser-streak-fire">🔥</span>
                    <div className="sd-teaser-streak-lines">
                      <div className="sd-teaser-streak-line" />
                      <div className="sd-teaser-streak-line" />
                    </div>
                  </div>
                </div>
                <div className="sd-teaser-card-bottom cb3">
                  <div className="sd-teaser-cb-header">CONTRIBUTIONS</div>
                  <div className="sd-teaser-chart-mock">
                    <svg viewBox="0 0 100 40" className="sd-teaser-chart-svg">
                      <path d="M 0,35 Q 25,10 50,25 T 100,5 L 100,40 L 0,40 Z" fill="rgba(139, 92, 246, 0.15)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Real assembled dashboard */}
      {(introStage === "assembled" || phase === "exit") && (
        <div className="sd-fullpage">
          <div className="sd-container">
            {/* Header */}
            <div className={`sd-header ${vis ? "sd-header-in" : ""}`}>
              <span className="sd-header-dot" />
              <h1 className="sd-title">Stats at a Glance</h1>
              <p className="sd-subtitle">Real-time GitHub analytics</p>
            </div>

            {/* Profile */}
            <ProfileCard profile={profile} loading={loading} />

            {/* Error banner */}
            {error && (
              <div className="sd-error">
                <span>⚠</span> {error} — showing cached/fallback data
              </div>
            )}

            {/* Stat Cards */}
            <div className="sd-grid">
              {statItems.map((s, i) => (
                <StatCard
                  key={s.label}
                  icon={s.icon}
                  label={s.label}
                  value={s.value}
                  delay={100 + i * 200}
                  loading={loading}
                />
              ))}
            </div>

            {/* Bottom Row */}
            <div className="sd-bottom-row">
              <LanguageBar
                languages={stats?.topLanguages ?? []}
                loading={loading}
                delay={900}
              />
              <StreakCard
                totalContributions={contributions?.totalContributions ?? 0}
                loading={loading}
                delay={1100}
              />
              <ContributionGrid
                data={contributions}
                loading={loading}
                delay={1300}
              />
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                sfx.playClick();
                handleEnter();
              }}
              onMouseEnter={() => sfx.playHover()}
              className={`sd-cta ${vis ? "sd-cta-in" : ""}`}
              id="splash-enter-btn"
            >
              <span className="sd-cta-pulse" />
              <span className="sd-cta-text">
                Enter Portfolio
                <span className="sd-cta-arrow">→</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Full screen white flash */}
      {introStage === "flash" && <div className="sd-flash-overlay" />}

      {/* Corner HUD accents (only visible after assembled) */}
      {introStage === "assembled" && (
        <>
          <i className="sd-corner sd-corner-tl" />
          <i className="sd-corner sd-corner-tr" />
          <i className="sd-corner sd-corner-bl" />
          <i className="sd-corner sd-corner-br" />
        </>
      )}

      <style>{splashCSS}</style>
    </div>
  );
}

const splashCSS = `
/* ── Root ── */
.sd-root {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh; height: 100dvh;
  z-index: 9999;
  background: #06070a;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  will-change: opacity, transform;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-tap-highlight-color: transparent;
}

.sd-canvas {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
  opacity: 0.85;
}

/* ── Full-page centered wrapper ── */
.sd-fullpage {
  position: relative; z-index: 2;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: clamp(1.5rem, 3.5vh, 3rem) clamp(1.5rem, 4vw, 4.5rem);
  box-sizing: border-box;
  backdrop-filter: blur(1px);
}

/* ── Container ── */
.sd-container {
  display: flex; flex-direction: column; align-items: center;
  justify-content: space-between;
  gap: clamp(0.8rem, 2vh, 1.6rem);
  width: 100%;
  height: 100%;
}

/* ── Teaser 3D Cinematic Container ── */
.sd-teaser-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 3;
  perspective: 2000px;
  transform-style: preserve-3d;
}
.sd-teaser-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: clamp(1rem, 3vh, 3rem) clamp(1rem, 3vw, 4rem);
  opacity: 0;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
  animation: sd-teaser-scroll-3d 1.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* Sequential right-to-left 3D scroll offsets */
.sd-teaser-header {
  animation-delay: 0.1s;
}
.sd-teaser-profile {
  animation-delay: 1.3s;
}
.sd-teaser-grid {
  animation-delay: 2.5s;
}
.sd-teaser-bottom {
  animation-delay: 3.7s;
}

@keyframes sd-teaser-scroll-3d {
  0% {
    transform: translate3d(100vw, 0, -800px) rotateY(45deg) scale(0.75);
    opacity: 0;
  }
  30% {
    transform: translate3d(0, 0, 0) rotateY(0deg) scale(1);
    opacity: 1;
  }
  70% {
    transform: translate3d(0, 0, 0) rotateY(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100vw, 0, -800px) rotateY(-45deg) scale(0.75);
    opacity: 0;
  }
}

/* Teaser Fullscreen Glow Cards */
.sd-teaser-fullscreen-card {
  position: relative;
  width: min(92vw, 1200px);
  height: min(80vh, 680px);
  background: #090b11;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vh, 3rem);
  box-sizing: border-box;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.sd-teaser-glow-blue {
  border: 2px solid rgba(59, 130, 246, 0.45);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(59, 130, 246, 0.18), inset 0 0 30px rgba(59, 130, 246, 0.08);
}
.sd-teaser-glow-indigo {
  border: 2px solid rgba(99, 102, 241, 0.45);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(99, 102, 241, 0.18), inset 0 0 30px rgba(99, 102, 241, 0.08);
}
.sd-teaser-glow-purple {
  border: 2px solid rgba(168, 85, 247, 0.45);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(168, 85, 247, 0.18), inset 0 0 30px rgba(168, 85, 247, 0.08);
}
.sd-teaser-glow-violet {
  border: 2px solid rgba(139, 92, 246, 0.45);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(139, 92, 246, 0.18), inset 0 0 30px rgba(139, 92, 246, 0.08);
}

/* Teaser HUD Corners */
.sd-teaser-corner-hud {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(129, 140, 248, 0.65);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}
.sd-teaser-corner-hud.tl { top: 16px; left: 16px; border-top-width: 2.5px; border-left-width: 2.5px; }
.sd-teaser-corner-hud.tr { top: 16px; right: 16px; border-top-width: 2.5px; border-right-width: 2.5px; }
.sd-teaser-corner-hud.bl { bottom: 16px; left: 16px; border-bottom-width: 2.5px; border-left-width: 2.5px; }
.sd-teaser-corner-hud.br { bottom: 16px; right: 16px; border-bottom-width: 2.5px; border-right-width: 2.5px; }

/* Teaser Header Scene */
.sd-teaser-heading {
  font-size: clamp(2.2rem, 5.5vmin, 4.2rem);
  font-weight: 900;
  color: #f8fafc;
  letter-spacing: 0.35em;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4);
  font-family: var(--font-geist-mono), monospace;
  text-transform: uppercase;
  margin-bottom: 24px;
  text-align: center;
}
.sd-teaser-hud-text {
  font-size: clamp(0.85rem, 1.8vmin, 1.25rem);
  color: #93c5fd;
  letter-spacing: 0.18em;
  font-family: var(--font-geist-mono), monospace;
  margin-bottom: 48px;
  opacity: 0.9;
  text-shadow: 0 0 10px rgba(147, 197, 253, 0.4);
}
.sd-teaser-progressbar-container {
  width: 300px;
  height: 8px;
  background: rgba(59, 130, 246, 0.12);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
}
.sd-teaser-progressbar {
  height: 100%;
  width: 65%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 999px;
  box-shadow: 0 0 15px #3b82f6;
  animation: sd-teaser-progress 2.6s ease-in-out infinite;
}
@keyframes sd-teaser-progress {
  0% { width: 0%; }
  50% { width: 85%; }
  100% { width: 100%; }
}

/* Teaser Profile Scene */
.sd-teaser-profile-content {
  display: flex;
  align-items: center;
  gap: clamp(2.5rem, 6vw, 5rem);
  width: 100%;
  max-width: 850px;
  justify-content: center;
}
.sd-teaser-avatar-wrap {
  position: relative;
  width: clamp(110px, 16vmin, 160px);
  height: clamp(110px, 16vmin, 160px);
  flex-shrink: 0;
}
.sd-teaser-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3.5px solid #6366f1;
  box-shadow: 0 0 35px rgba(99, 102, 241, 0.7);
  background: rgba(99, 102, 241, 0.12);
}
.sd-teaser-avatar-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 1.5px dashed rgba(99, 102, 241, 0.55);
  animation: sd-spin 12s linear infinite;
}
.sd-teaser-profile-title {
  font-size: clamp(1.3rem, 2.5vmin, 1.95rem);
  font-weight: 800;
  color: #c7d2fe;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.12em;
  text-shadow: 0 0 15px rgba(199, 210, 254, 0.4);
}
.sd-teaser-line {
  height: 16px;
  border-radius: 7px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.55), rgba(99, 102, 241, 0.15));
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.25);
}
.sd-teaser-line.l1 { width: 90%; }
.sd-teaser-line.l2 { width: 65%; }
.sd-teaser-line.l3 { width: 50%; }

/* Teaser Grid Scene */
.sd-teaser-grid-title {
  font-size: clamp(1.3rem, 2.5vmin, 1.95rem);
  font-weight: 800;
  color: #f3e8ff;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.18em;
  margin-bottom: 35px;
  text-align: center;
  text-shadow: 0 0 15px rgba(243, 232, 255, 0.4);
}
.sd-teaser-grid-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1000px;
}
@media (max-width: 768px) {
  .sd-teaser-grid-content { grid-template-columns: repeat(2, 1fr); gap: 18px; }
}
.sd-teaser-card {
  aspect-ratio: 1 / 1.15;
  background: rgba(168, 85, 247, 0.05);
  border: 2px solid rgba(168, 85, 247, 0.45);
  border-radius: 18px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.45), 0 0 20px rgba(168, 85, 247, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}
.sd-teaser-card-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px currentColor);
}
.sd-teaser-card-val {
  font-size: 2.6rem;
  font-weight: 900;
  color: #f8fafc;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
.sd-teaser-card-lbl {
  font-size: 0.78rem;
  font-weight: 600;
  color: #c084fc;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.06em;
  text-align: center;
}

/* Teaser Bottom Scene */
.sd-teaser-bottom-title {
  font-size: clamp(1.3rem, 2.5vmin, 1.95rem);
  font-weight: 800;
  color: #ddd6fe;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.18em;
  margin-bottom: 35px;
  text-align: center;
  text-shadow: 0 0 15px rgba(221, 214, 254, 0.4);
}
.sd-teaser-bottom-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
}
@media (max-width: 860px) {
  .sd-teaser-bottom-content { grid-template-columns: 1fr; gap: 18px; }
}
.sd-teaser-card-bottom {
  background: rgba(139, 92, 246, 0.05);
  border: 2px solid rgba(139, 92, 246, 0.45);
  border-radius: 18px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.1);
  padding: clamp(1.2rem, 3vh, 2.2rem);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sd-teaser-cb-header {
  font-size: 0.78rem;
  font-weight: 600;
  color: #c084fc;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.1em;
  text-shadow: 0 0 6px rgba(192, 132, 252, 0.4);
}
.sd-teaser-donut-mock {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 10px solid rgba(139, 92, 246, 0.12);
  border-top-color: rgba(139, 92, 246, 0.75);
  border-right-color: rgba(168, 85, 247, 0.65);
  margin: 0 auto;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.35);
  animation: sd-spin 6s linear infinite;
}
.sd-teaser-donut-inner {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: transparent;
}
.sd-teaser-streak-mock {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  height: 110px;
}
.sd-teaser-streak-fire {
  font-size: 2.8rem;
  filter: drop-shadow(0 0 12px #f97316);
}
.sd-teaser-streak-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.sd-teaser-streak-line {
  height: 12px;
  background: rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
  border-radius: 5px;
}
.sd-teaser-streak-line:first-child { width: 85%; }
.sd-teaser-streak-line:last-child { width: 55%; }

.sd-teaser-chart-mock {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
}
.sd-teaser-chart-svg {
  width: 100%;
  height: 90px;
}

/* ── Fullscreen Flash Overlay ── */
.sd-flash-overlay {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 10000;
  animation: sd-flash-anim 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  pointer-events: none;
}
@keyframes sd-flash-anim {
  0% { opacity: 0; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── Header ── */
.sd-header {
  text-align: center;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-header.sd-header-in {
  animation: sd-assemble-zoom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-header-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #818cf8;
  box-shadow: 0 0 16px 2px rgba(129, 140, 248, 0.75);
  margin-bottom: clamp(0.25rem, 0.5vh, 0.45rem);
  animation: sd-dot-glow 2s ease-in-out infinite alternate;
}
@keyframes sd-dot-glow {
  0% { transform: scale(0.9); box-shadow: 0 0 12px rgba(129, 140, 248, 0.6); }
  100% { transform: scale(1.15); box-shadow: 0 0 24px 4px rgba(129, 140, 248, 0.9); }
}

.sd-title {
  margin: 0;
  font-size: clamp(1.6rem, 3.8vmin, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #f8fafc;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1.1;
  text-shadow: 0 0 40px rgba(129, 140, 248, 0.15);
}
.sd-subtitle {
  margin: 6px 0 0;
  font-size: clamp(0.75rem, 1.3vmin, 1.0rem);
  color: #64748b;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
}

/* ── Profile Card ── */
.sd-profile {
  display: flex; align-items: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  border: 1px solid rgba(129, 140, 248, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: clamp(0.8rem, 1.8vh, 1.25rem) clamp(1.2rem, 2.2vw, 1.85rem);
  opacity: 0;
  will-change: opacity, transform;
}
.sd-profile-in {
  animation: sd-assemble-profile 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-avatar {
  width: clamp(54px, 8vmin, 76px);
  height: clamp(54px, 8vmin, 76px);
  border-radius: 50%;
  border: 2px solid rgba(129, 140, 248, 0.35);
  box-shadow: 0 0 16px rgba(129, 140, 248, 0.15);
  flex-shrink: 0;
  transition: transform 0.4s ease;
}
.sd-profile:hover .sd-avatar {
  transform: scale(1.05) rotate(3deg);
  border-color: rgba(129, 140, 248, 0.6);
}
.sd-profile-info {
  min-width: 0;
}
.sd-profile-name {
  margin: 0;
  font-size: clamp(1.0rem, 2vmin, 1.4rem);
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.01em;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
.sd-profile-bio {
  margin: 2px 0 0;
  font-size: clamp(0.75rem, 1.2vmin, 0.95rem);
  color: #94a3b8;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1.35;
}
.sd-profile-meta {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 4px;
  font-size: clamp(0.7rem, 1.1vmin, 0.85rem);
  color: #475569;
  font-family: var(--font-geist-mono), monospace;
  flex-wrap: wrap;
}
.sd-meta-num {
  color: #a5b4fc;
  font-weight: 600;
}
.sd-profile-meta-dot {
  color: rgba(100, 116, 139, 0.25);
}
.sd-meta-loc {
  color: #64748b;
}

/* ── Skeleton Loading ── */
.sd-skeleton-line {
  background: linear-gradient(90deg, rgba(51,56,70,0.2) 25%, rgba(129,140,248,0.1) 50%, rgba(51,56,70,0.2) 75%);
  background-size: 200% 100%;
  animation: sd-shimmer-move 1.6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
  border-radius: 6px;
}
@keyframes sd-shimmer-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.sd-profile-skeleton {
  opacity: 1 !important;
  transform: none !important;
}
.sd-avatar-skeleton {
  width: clamp(54px, 8vmin, 76px);
  height: clamp(54px, 8vmin, 76px);
  border-radius: 50%;
  background: rgba(51,56,70,0.2);
  flex-shrink: 0;
  animation: sd-shimmer-move 1.6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, rgba(51,56,70,0.2) 25%, rgba(129,140,248,0.1) 50%, rgba(51,56,70,0.2) 75%);
}
.sd-skeleton-name { width: 140px; height: 18px; }
.sd-skeleton-bio { width: 220px; height: 14px; margin-top: 5px; }
.sd-skeleton-meta { width: 160px; height: 12px; margin-top: 5px; }

/* ── Error Banner ── */
.sd-error {
  width: 100%;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  font-size: clamp(0.55rem, 1vmin, 0.7rem);
  font-family: var(--font-geist-mono), monospace;
  text-align: center;
}

/* ── Stat Cards Grid ── */
.sd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(0.4rem, 0.8vmin, 0.75rem);
  width: 100%;
}
@media (max-width: 520px) {
  .sd-grid { grid-template-columns: repeat(2, 1fr); }
}

.sd-stat-card {
  position: relative;
  background: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  border: 1px solid rgba(129, 140, 248, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(0.8rem, 1.5vw, 1.2rem);
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(0.3rem, 0.6vh, 0.5rem);
  overflow: hidden;
  opacity: 0;
  cursor: default;
  will-change: opacity, transform;
}
.sd-stat-card.sd-card-in {
  animation: sd-assemble-stat 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-stat-card:hover {
  border-color: rgba(129,140,248,0.4);
  box-shadow: 0 0 25px rgba(129,140,248,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
}
.sd-stat-icon {
  font-size: clamp(1.1rem, 1.8vmin, 1.4rem);
  color: #818cf8;
  line-height: 1;
  filter: drop-shadow(0 0 6px rgba(129,140,248,0.35));
}
.sd-stat-value {
  font-size: clamp(1.8rem, 3.5vmin, 2.8rem);
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.1;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.sd-stat-label {
  font-size: clamp(0.6rem, 1vmin, 0.75rem);
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
}
.sd-stat-shimmer {
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(129, 140, 248, 0.02) 40%, rgba(129, 140, 248, 0.08) 50%, rgba(129, 140, 248, 0.02) 60%, transparent 100%);
  pointer-events: none;
}
.sd-stat-card.sd-card-in .sd-stat-shimmer {
  animation: sd-shimmer-sweep 2.6s ease-out 0.8s forwards;
}
@keyframes sd-shimmer-sweep {
  0% { left: -100%; }
  100% { left: 200%; }
}
.sd-stat-skeleton {
  opacity: 1 !important;
  transform: none !important;
}
.sd-skeleton-icon-line { width: 22px; height: 22px; border-radius: 50%; margin-bottom: 2px; }
.sd-skeleton-value-line { width: 70px; height: 26px; }
.sd-skeleton-label-line { width: 60px; height: 12px; }

/* ── Bottom Row: 3 Columns ── */
.sd-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: clamp(0.4rem, 0.8vmin, 0.75rem);
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
}
@media (max-width: 860px) {
  .sd-bottom-row { grid-template-columns: 1fr; }
}

/* ── Streak / Insights Section ── */
.sd-streak-section {
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  border: 1px solid rgba(129, 140, 248, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-streak-in {
  animation: sd-assemble-streak 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-streak-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.2vh, 0.9rem);
  flex: 1;
  justify-content: center;
}
.sd-streak-item {
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1.2vw, 1.0rem);
  background: rgba(129, 140, 248, 0.02);
  border: 1px solid rgba(129, 140, 248, 0.05);
  padding: clamp(0.4rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.2vw, 0.9rem);
  border-radius: 10px;
  transition: border-color 0.3s, background-color 0.3s;
}
.sd-streak-item:hover {
  border-color: rgba(129, 140, 248, 0.2);
  background: rgba(129, 140, 248, 0.04);
}
.sd-streak-icon-wrap {
  font-size: clamp(1rem, 1.8vmin, 1.4rem);
  line-height: 1;
}
.sd-streak-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.sd-streak-label {
  font-size: clamp(0.5rem, 0.85vmin, 0.65rem);
  color: #64748b;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
  font-weight: 500;
}
.sd-streak-val {
  font-size: clamp(0.8rem, 1.4vmin, 1.05rem);
  font-weight: 800;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
/* Skeletons */
.sd-streak-skeleton { opacity: 1; }
.sd-skeleton-streak-title { width: 90px; height: 12px; margin-bottom: 6px; }
.sd-streak-grid-skeleton {
  display: flex; flex-direction: column; gap: 8px; margin-top: 6px;
}
.sd-skeleton-streak-item { width: 100%; height: 36px; border-radius: 10px; }

/* ── Language Bar Section ── */
.sd-lang-section {
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  border: 1px solid rgba(129, 140, 248, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-lang-in {
  animation: sd-assemble-lang 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-section-title {
  margin: 0 0 clamp(0.5rem, 0.8vh, 0.75rem);
  font-size: clamp(0.7rem, 1.2vmin, 0.85rem);
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
}
.sd-lang-body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2.5vw, 2.2rem);
  flex: 1;
  width: 100%;
}
.sd-lang-chart-container {
  position: relative;
  width: clamp(100px, 15vmin, 135px);
  height: clamp(100px, 15vmin, 135px);
  flex-shrink: 0;
}
.sd-lang-doughnut {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(129, 140, 248, 0.25));
}
.sd-lang-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.sd-lang-center-val {
  font-size: clamp(1.1rem, 2vmin, 1.45rem);
  font-weight: 800;
  color: #f8fafc;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1;
}
.sd-lang-center-lbl {
  font-size: clamp(0.5rem, 0.8vmin, 0.62rem);
  color: #64748b;
  font-family: var(--font-geist-mono), monospace;
  text-transform: uppercase;
  margin-top: 2px;
  letter-spacing: 0.05em;
}
.sd-lang-legend {
  display: flex;
  flex-direction: column;
  gap: clamp(0.4rem, 0.8vh, 0.65rem);
  flex: 1;
  width: 100%;
}
.sd-lang-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}
.sd-lang-item-header {
  display: flex;
  align-items: center;
  gap: clamp(0.3rem, 0.6vmin, 0.45rem);
}
.sd-lang-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
}
.sd-lang-name {
  font-size: clamp(0.62rem, 1vmin, 0.76rem);
  color: #94a3b8;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-weight: 500;
}
.sd-lang-pct {
  font-size: clamp(0.55rem, 0.9vmin, 0.68rem);
  color: #64748b;
  font-family: var(--font-geist-mono), monospace;
  margin-left: auto;
}
.sd-lang-item-bar-bg {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}
.sd-lang-item-bar {
  height: 100%;
  border-radius: 999px;
}
.sd-lang-skeleton { opacity: 1; }
.sd-lang-track-skeleton {
  width: 100%; height: 7px; border-radius: 999px;
  background: linear-gradient(90deg, rgba(51,56,70,0.2) 25%, rgba(129,140,248,0.1) 50%, rgba(51,56,70,0.2) 75%);
  background-size: 200% 100%;
  animation: sd-shimmer-move 1.6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}
.sd-skeleton-lang-title { width: 90px; height: 12px; margin-bottom: 6px; }
.sd-lang-legend-skeleton {
  display: flex; gap: 10px; margin-top: 6px;
}
.sd-skeleton-lang-item { width: 55px; height: 10px; }

/* ── Contribution Grid ── */
.sd-contrib-section {
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  border: 1px solid rgba(129, 140, 248, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  min-width: 0;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-contrib-in {
  animation: sd-assemble-contrib 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-contrib-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: clamp(0.35rem, 0.6vh, 0.55rem);
}
.sd-contrib-total {
  font-size: clamp(0.6rem, 0.9vmin, 0.75rem);
  color: #64748b;
  font-family: var(--font-geist-mono), monospace;
}
.sd-contrib-grid {
  display: flex;
  gap: 3px;
  overflow: hidden;
  flex: 1;
  align-items: flex-start;
}
.sd-contrib-col {
  display: flex; flex-direction: column;
  gap: 3px;
}
.sd-contrib-cell {
  width: clamp(10px, 1.5vmin, 14px);
  height: clamp(10px, 1.5vmin, 14px);
  border-radius: 2.5px;
  transition: background-color 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.sd-contrib-legend {
  display: flex; align-items: center;
  gap: 3px;
  margin-top: clamp(0.3rem, 0.5vh, 0.45rem);
  justify-content: flex-end;
}
.sd-contrib-legend-label {
  font-size: clamp(0.55rem, 0.85vmin, 0.68rem);
  color: #475569;
  font-family: var(--font-geist-mono), monospace;
  margin: 0 3px;
}
.sd-contrib-legend-cell {
  width: clamp(9px, 1.3vmin, 12px);
  height: clamp(9px, 1.3vmin, 12px);
  border-radius: 2px;
}

/* Contribution Sparkline Chart */
.sd-contrib-chart-wrap {
  margin-top: clamp(0.7rem, 1.5vh, 1.2rem);
  padding-top: clamp(0.6rem, 1.2vh, 1rem);
  border-top: 1px dashed rgba(129, 140, 248, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}
.sd-contrib-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sd-contrib-chart-lbl {
  font-size: clamp(0.5rem, 0.85vmin, 0.65rem);
  color: #64748b;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.sd-contrib-chart-peak {
  font-size: clamp(0.48rem, 0.8vmin, 0.6rem);
  color: #818cf8;
  font-family: var(--font-geist-mono), monospace;
  font-weight: 500;
  background: rgba(129, 140, 248, 0.05);
  padding: 1px 5px;
  border-radius: 4px;
}
.sd-contrib-chart-svg {
  width: 100%;
  height: 50px;
  display: block;
  overflow: visible;
}

/* Contribution skeleton */
.sd-contrib-skeleton { opacity: 1; }
.sd-skeleton-contrib-title { width: 60px; height: 12px; margin-bottom: 6px; }
.sd-contrib-grid-skeleton {
  display: flex; flex-wrap: wrap; gap: 3px;
}
.sd-contrib-cell-skeleton {
  width: 9px; height: 9px;
  border-radius: 2px;
  background: rgba(51,56,70,0.2);
}

/* ── CTA ── */
.sd-cta {
  position: relative;
  padding: clamp(0.6rem, 1.2vh, 0.95rem) clamp(2rem, 4vw, 3.5rem);
  background: rgba(129, 140, 248, 0.03);
  border: 1px solid rgba(129, 140, 248, 0.16);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-radius: 11px;
  cursor: pointer;
  opacity: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
  will-change: opacity, transform;
}
.sd-cta-in {
  animation: sd-cta-zoom-in 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards;
}
@keyframes sd-cta-zoom-in {
  0% { opacity: 0; transform: translateY(30px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.sd-cta:hover {
  border-color: rgba(129,140,248,0.55);
  box-shadow: 0 0 30px rgba(129,140,248,0.12), inset 0 0 20px rgba(129,140,248,0.06);
}
.sd-cta:active { transform: scale(0.97); }
.sd-cta-pulse {
  position: absolute; inset: -1px;
  border-radius: 11px;
  border: 1px solid rgba(129,140,248,0.2);
  animation: sd-pulse 3.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes sd-pulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
.sd-cta-text {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: clamp(0.4rem, 0.8vmin, 0.6rem);
  font-size: clamp(0.7rem, 1.15vmin, 0.88rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(199,210,254,0.8);
  font-family: var(--font-geist-mono), monospace;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.3s;
}
.sd-cta:hover .sd-cta-text { color: #e0e7ff; }
.sd-cta-arrow {
  display: inline-block;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 1.15em;
}
.sd-cta:hover .sd-cta-arrow { transform: translateX(5px); }

/* ── Corner HUD Accents ── */
.sd-corner {
  position: absolute;
  width: clamp(12px, 1.6vmin, 20px);
  height: clamp(12px, 1.6vmin, 20px);
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  animation: sd-corner-fade 1.2s ease 1.8s forwards;
}
.sd-corner-tl { top: clamp(10px, 1.8vmin, 20px); left: clamp(10px, 1.8vmin, 20px); border-top: 1.5px solid rgba(129,140,248,0.15); border-left: 1.5px solid rgba(129,140,248,0.15); }
.sd-corner-tr { top: clamp(10px, 1.8vmin, 20px); right: clamp(10px, 1.8vmin, 20px); border-top: 1.5px solid rgba(129,140,248,0.15); border-right: 1.5px solid rgba(129,140,248,0.15); }
.sd-corner-bl { bottom: clamp(10px, 1.8vmin, 20px); left: clamp(10px, 1.8vmin, 20px); border-bottom: 1.5px solid rgba(129,140,248,0.15); border-left: 1.5px solid rgba(129,140,248,0.15); }
.sd-corner-br { bottom: clamp(10px, 1.8vmin, 20px); right: clamp(10px, 1.8vmin, 20px); border-bottom: 1.5px solid rgba(129,140,248,0.15); border-right: 1.5px solid rgba(129,140,248,0.15); }
@keyframes sd-corner-fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
/* ── Side Assembly Keyframes ── */
@keyframes sd-assemble-header {
  0% { opacity: 0; transform: translateY(-60px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes sd-assemble-profile {
  0% { opacity: 0; transform: translate3d(-150px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes sd-assemble-stat {
  0% { opacity: 0; transform: translate3d(0, -60px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes sd-assemble-lang {
  0% { opacity: 0; transform: translate3d(-120px, 120px, 0) scale(0.95); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes sd-assemble-streak {
  0% { opacity: 0; transform: translate3d(0, 150px, 0) scale(0.95); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes sd-assemble-contrib {
  0% { opacity: 0; transform: translate3d(120px, 120px, 0) scale(0.95); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
`;

