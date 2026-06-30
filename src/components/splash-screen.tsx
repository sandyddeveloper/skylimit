"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useGitHubStats } from "@/hooks/use-github-stats";
import { useTheme } from "@/hooks/use-theme";
import { ProfileCard } from "./splash/ProfileCard";
import { StatCard } from "./splash/StatCard";
import { LanguageBar } from "./splash/LanguageBar";
import { ContributionGrid } from "./splash/ContributionGrid";

// ── Futuristic 3D Perspective Git Grid Canvas ──
function ParticleCanvas({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const focalLength = 280;
    const maxDepth = 1000;

    const gitPhrases = [
      "git commit -m 'feat: custom audio engine'",
      "git push origin prod-main",
      "commit c8a3b8d",
      "commit e4b1a62",
      "index.css compiled (+185, -24)",
      "git branch -a --list",
      "Merge branch 'hotfix/vanta-compat'",
      "TypeScript 94.2%",
      "git clone https://github.com/sandyddeveloper/skylimit",
      "package.json updated (+12, -4)",
      "System fully functional (200 OK)",
      "SSL handshake verification complete",
      "GET /api/github/stats/sandyddeveloper",
      "1,087 contributions parsed",
      "git checkout -b release/v1.0.0",
      "ping api.github.com: 14ms",
      "npm run dev --port:3000"
    ];

    interface GitTextParticle {
      x: number;
      y: number;
      z: number;
      text: string;
      speed: number;
      colorType: number;
      opacity: number;
    }

    let particles: GitTextParticle[] = [];

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create a set of 3D particles
      particles = Array.from({ length: 30 }, () => ({
        x: (Math.random() - 0.5) * w * 1.8,
        y: (Math.random() - 0.5) * h * 1.5,
        z: Math.random() * maxDepth,
        text: gitPhrases[Math.floor(Math.random() * gitPhrases.length)],
        speed: 1.2 + Math.random() * 2.2,
        colorType: Math.random() > 0.5 ? 0 : 1,
        opacity: 0.12 + Math.random() * 0.28
      }));
    };
    init();

    let gridOffset = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2;
      const centerY = h / 2;
      const isDark = theme === "dark";

      // Draw perspective grid floor (occupies bottom 60% of viewport)
      ctx.strokeStyle = isDark ? "rgba(129, 140, 248, 0.05)" : "rgba(79, 70, 229, 0.08)";
      ctx.lineWidth = 1;
      gridOffset = (gridOffset + 0.8) % 40;

      const horizonY = centerY * 0.6;
      const gridDensity = 18;

      // Vertical lines extending from horizon to bottom of screen
      for (let i = -gridDensity; i <= gridDensity; i++) {
        const xOffset = i * (w / gridDensity);
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(centerX + xOffset * 2.8, h);
        ctx.stroke();
      }

      // Horizontal grid lines flowing towards the viewer
      for (let z = gridOffset; z < centerY; z += 40) {
        const k = (z / centerY);
        const y = horizonY + (h - horizonY) * k * k; // quadratic spacing
        const opacity = Math.min(0.09, k * 0.12);
        ctx.strokeStyle = isDark
          ? `rgba(129, 140, 248, ${opacity})`
          : `rgba(79, 70, 229, ${opacity * 1.25})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render 3D streaming text particles
      ctx.font = "bold 9px var(--font-geist-mono), monospace";
      for (const p of particles) {
        p.z -= p.speed;
        if (p.z <= 0) {
          p.z = maxDepth;
          p.x = (Math.random() - 0.5) * w * 1.8;
          p.y = (Math.random() - 0.5) * h * 1.5;
          p.text = gitPhrases[Math.floor(Math.random() * gitPhrases.length)];
        }

        const scale = focalLength / (focalLength + p.z);
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const fade = Math.min(p.opacity, (maxDepth - p.z) / 200);
          
          let colorPrefix;
          if (isDark) {
            colorPrefix = p.colorType === 0 ? "rgba(99, 102, 241, " : "rgba(129, 140, 248, ";
          } else {
            colorPrefix = p.colorType === 0 ? "rgba(79, 70, 229, " : "rgba(99, 102, 241, ";
          }

          ctx.fillStyle = `${colorPrefix}${fade})`;
          ctx.fillText(p.text, px, py);

          // Node points
          ctx.fillStyle = isDark ? `rgba(148, 163, 184, ${fade * 0.35})` : `rgba(71, 85, 105, ${fade * 0.4})`;
          ctx.beginPath();
          ctx.arc(px - 6, py - 3, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
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
  }, [theme]);

  return <canvas ref={canvasRef} className="sd-canvas" />;
}

// ── Audio Sound Effects Synthesizer (Pure Web Audio API) ──
class SoundEffects {
  private ctx: AudioContext | null = null;

  initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  playLockNote(index: number) {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Frequencies for C major pentatonic chord progression: C4, D4, E4, G4, A4, C5, E5, G5
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99];
      const freq = scale[index % scale.length];
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const biquad = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      biquad.type = "bandpass";
      biquad.frequency.setValueAtTime(freq * 1.5, now);
      biquad.Q.setValueAtTime(1.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);

      // Add high-tech mechanical snap click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(1200, now);
      clickOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.04);
      
      clickGain.gain.setValueAtTime(0.015, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.04);
    } catch (e) {
      console.warn("SFX Error: ", e);
    }
  }

  playBootGlitches() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 0.45;
      
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Choppy bursts of random white noise
        if (Math.floor(i / 1800) % 2 === 0) {
          data[i] = Math.random() * 2 - 1;
        } else {
          data[i] = 0;
        }
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);
      filter.Q.setValueAtTime(3.0, now);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start(now);
      noise.stop(now + duration);
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
  const { theme } = useTheme();
  const { profile, stats, contributions, loading, error } = useGitHubStats();
  const [phase, setPhase] = useState<"loading" | "booting" | "titlesweep" | "assembling" | "visible" | "exit" | "done">("loading");
  
  // Console logs typing progress states
  const [consoleLogs, setConsoleLogs] = useState<{ text: string; type: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

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

  // 1. Loading phase simulated progress and text logs typing effect
  useEffect(() => {
    if (phase !== "loading") return;

    const start = performance.now();
    const duration = 2800; // 2.8 seconds target boot time

    const bootLogs = [
      { text: "INITIALIZING CONNECT SECURE PROTOCOL v4.2.0...", time: 100, type: "system" },
      { text: "ESTABLISHING HANDSHAKE WITH API.GITHUB.COM...", time: 350, type: "system" },
      { text: "RESOLVING IP ADDRESS: 140.82.113.5...", time: 650, type: "info" },
      { text: "CONNECTION SECURED VIA TLS_AES_256_GCM_SHA384...", time: 950, type: "ok" },
      { text: "REQUESTING GITHUB DATA PACKET [sandyddeveloper]...", time: 1250, type: "info" },
      { text: "RESPONSE RECEIVED: STATUS 200 OK", time: 1550, type: "ok" },
      { text: "PARSING REPOSITORIES & METADATA...", time: 1850, type: "info" },
      { text: "CALCULATING COMMIT ACTIVITY & LANGUAGE BIASES...", time: 2150, type: "info" },
      { text: "DEVR_STREAK CALCULATION COMPLETE (32 DAYS)", time: 2400, type: "ok" },
      { text: "COMPILING DASHBOARD ASSEMBLY SCHEMATICS...", time: 2650, type: "system" },
      { text: "BOOT SEQUENCE TERMINATED. READY TO LAUNCH.", time: 2800, type: "ok" },
    ];

    let lastLoggedIndex = -1;
    let animId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      let targetProgress = (elapsed / duration) * 100;

      if (loading) {
        // Stalled at 98% if data hasn't loaded yet
        targetProgress = Math.min(98, targetProgress);
      } else {
        targetProgress = Math.min(100, targetProgress);
      }

      setProgress(targetProgress);

      // Add boot logs
      const newLogs: { text: string; type: string }[] = [];
      bootLogs.forEach((log, idx) => {
        if (elapsed >= log.time && idx > lastLoggedIndex) {
          newLogs.push({ text: log.text, type: log.type });
          lastLoggedIndex = idx;
        }
      });

      if (newLogs.length > 0) {
        setConsoleLogs((prev) => [...prev, ...newLogs]);
      }

      // Handle Stalling Logs
      if (loading && elapsed > 3000) {
        const stallTime = elapsed - 3000;
        const count = Math.floor(stallTime / 1200);
        const relativeCount = count + bootLogs.length;
        if (relativeCount > lastLoggedIndex) {
          setConsoleLogs((prev) => {
            const list = [...prev];
            // Remove previous stall line
            if (list[list.length - 1]?.text.startsWith("AWAITING GITHUB STREAM PACKET")) {
              list.pop();
            }
            list.push({
              text: `AWAITING GITHUB STREAM PACKET${".".repeat((count % 3) + 1)}`,
              type: "warning",
            });
            return list;
          });
          lastLoggedIndex = relativeCount;
        }
      }

      // Complete transition
      if (!loading && targetProgress >= 100) {
        sfx.playBootGlitches();
        setTimeout(() => {
          setPhase("booting");
        }, 300);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [phase, loading]);

  // 2. State machine transitions from booting -> titlesweep -> assembling -> visible
  useEffect(() => {
    if (phase === "booting") {
      sfx.playFlashBurst();
      const t = setTimeout(() => {
        setPhase("titlesweep");
      }, 550);
      return () => clearTimeout(t);
    }

    if (phase === "titlesweep") {
      sfx.playFlashCharge();
      const t = setTimeout(() => {
        setPhase("assembling");
      }, 1600);
      return () => clearTimeout(t);
    }

    if (phase === "assembling") {
      // Trigger detuned major pentatonic arpeggio lock chimes as cards register
      const t0 = setTimeout(() => sfx.playLockNote(0), 100);  // Profile (T + 100ms)
      const t1 = setTimeout(() => sfx.playLockNote(1), 400);  // Commits (T + 400ms)
      const t2 = setTimeout(() => sfx.playLockNote(2), 600);  // PRs (T + 600ms)
      const t3 = setTimeout(() => sfx.playLockNote(3), 800);  // Stars (T + 800ms)
      const t4 = setTimeout(() => sfx.playLockNote(4), 1000); // Repos (T + 1000ms)
      const t5 = setTimeout(() => sfx.playLockNote(5), 1200); // Languages (T + 1200ms)
      const t6 = setTimeout(() => sfx.playLockNote(6), 1400); // Streak (T + 1400ms)
      const t7 = setTimeout(() => sfx.playLockNote(7), 1600); // Activity Grid (T + 1600ms)

      // Play final full chord chiming locks & complete transition to visible
      const tAssembled = setTimeout(() => {
        setPhase("visible");
        sfx.playAssembleChime();
      }, 2300);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
        clearTimeout(t7);
        clearTimeout(tAssembled);
      };
    }
  }, [phase]);

  // 3. Trigger Welcome Dialog Popup after 3 seconds in the visible phase
  useEffect(() => {
    if (phase === "visible") {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        sfx.playAssembleChime(); // Play high-tech chime sound when popup shows
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);


  const handleEnter = useCallback(() => {
    setPhase("exit");
    setTimeout(() => {
      setPhase("done");
      setTimeout(onComplete, 100);
    }, 700);
  }, [onComplete]);

  if (phase === "done") return null;

  const vis = phase === "visible" || phase === "exit" || phase === "assembling";

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
      {/* 1. Perspective Grid Background */}
      {(phase === "titlesweep" || phase === "assembling" || phase === "visible" || phase === "exit") && <ParticleCanvas theme={theme} />}

      {/* 2. System Boot-up Terminal Loader */}
      {phase === "loading" && (
        <div className="sd-boot-container">
          <div className="sd-boot-hud">
            {/* Corner Bracket Accents */}
            <span className="sd-boot-corner tl" />
            <span className="sd-boot-corner tr" />
            <span className="sd-boot-corner bl" />
            <span className="sd-boot-corner br" />

            <div className="sd-boot-header">
              <span className="sd-boot-dot" />
              <span className="sd-boot-title">SYSTEM INIT DIRECTIVE</span>
            </div>

            {/* Pulsing circular grid scanner */}
            <div className="sd-boot-scanner">
              <div className="sd-boot-radar">
                <div className="sd-boot-radar-sweep" />
                <div className="sd-boot-radar-circle c1" />
                <div className="sd-boot-radar-circle c2" />
                <div className="sd-boot-radar-circle c3" />
                <span className="sd-boot-radar-glitch">SCAN ACTIVE</span>
              </div>
            </div>

            {/* Terminal Console Logs */}
            <div className="sd-boot-console">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={`sd-boot-log ${log.type}`}>
                  <span className="sd-boot-prompt">&gt;</span> {log.text}
                </div>
              ))}
              <div className="sd-boot-cursor" />
            </div>

            {/* Diagnostics progress indicators */}
            <div className="sd-boot-progress-wrap">
              <div className="sd-boot-progress-track">
                <div className="sd-boot-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="sd-boot-progress-pct">{Math.floor(progress)}%</div>
            </div>
            <div className="sd-boot-bypass-hint">Awaiting Secure Stream Handshake...</div>
          </div>
        </div>
      )}

      {/* 3. Central Title reveal overlay */}
      {phase === "titlesweep" && (
        <div className="sd-title-reveal-container">
          <div className="sd-title-reveal-content">
            <div className="sd-title-sys-id">[NODE-72_INIT]</div>
            <h2 className="sd-title-cinematic">SKYLIMIT</h2>
            <div className="sd-title-sub-cinematic">DATA RECONSTRUCTION CHOREOGRAPHY</div>
            <div className="sd-title-light-sweep" />
          </div>
        </div>
      )}

      {/* 4. Real assembled dashboard */}
      {vis && (
        <div className="sd-fullpage">
          <div className="sd-container">
            {/* Header */}
            <div className="sd-header sd-header-in">
              <span className="sd-header-dot" />
              <h1 className="sd-title">Stats at a Glance</h1>
              <p className="sd-subtitle">Real-time GitHub analytics</p>
            </div>

            {/* Profile */}
            <div
              className={`sd-assembly-wrapper ${phase === "visible" || phase === "exit" || phase === "assembling" ? "sd-assembly-active" : ""}`}
              data-label="[SYS_SEC: USER_PROFILE]"
              style={{ "--delay": 100 } as React.CSSProperties}
            >
              <span className="sd-hud-corner tl" />
              <span className="sd-hud-corner tr" />
              <span className="sd-hud-corner bl" />
              <span className="sd-hud-corner br" />
              <div className="sd-laser-border" />
              <div className="sd-scanner-line" />
              <ProfileCard profile={profile} loading={loading} />
            </div>

            {/* Error banner */}
            {error && (
              <div className="sd-error">
                <span>⚠</span> {error} — showing cached/fallback data
              </div>
            )}

            {/* Stat Cards */}
            <div className="sd-grid">
              {statItems.map((s, i) => (
                <div
                  key={s.label}
                  className={`sd-assembly-wrapper ${phase === "visible" || phase === "exit" || phase === "assembling" ? "sd-assembly-active" : ""}`}
                  data-label={`[METRIC: ${s.label.toUpperCase().replace(" ", "_")}]`}
                  style={{ "--delay": 400 + i * 200 } as React.CSSProperties}
                >
                  <span className="sd-hud-corner tl" />
                  <span className="sd-hud-corner tr" />
                  <span className="sd-hud-corner bl" />
                  <span className="sd-hud-corner br" />
                  <div className="sd-laser-border" />
                  <div className="sd-scanner-line" />
                  <StatCard
                    icon={s.icon}
                    label={s.label}
                    value={s.value}
                    delay={400 + i * 200}
                    loading={loading}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="sd-bottom-row">
              <div
                className={`sd-assembly-wrapper ${phase === "visible" || phase === "exit" || phase === "assembling" ? "sd-assembly-active" : ""}`}
                data-label="[VISUALIZER: TOP_LANGUAGES]"
                style={{ "--delay": 1200 } as React.CSSProperties}
              >
                <span className="sd-hud-corner tl" />
                <span className="sd-hud-corner tr" />
                <span className="sd-hud-corner bl" />
                <span className="sd-hud-corner br" />
                <div className="sd-laser-border" />
                <div className="sd-scanner-line" />
                <LanguageBar
                  languages={stats?.topLanguages ?? []}
                  loading={loading}
                  delay={1200}
                />
              </div>
              <div
                className={`sd-assembly-wrapper ${phase === "visible" || phase === "exit" || phase === "assembling" ? "sd-assembly-active" : ""}`}
                data-label="[ANALYTICS: DEVR_STREAK]"
                style={{ "--delay": 1400 } as React.CSSProperties}
              >
                <span className="sd-hud-corner tl" />
                <span className="sd-hud-corner tr" />
                <span className="sd-hud-corner bl" />
                <span className="sd-hud-corner br" />
                <div className="sd-laser-border" />
                <div className="sd-scanner-line" />
                <StreakCard
                  totalContributions={contributions?.totalContributions ?? 0}
                  loading={loading}
                  delay={1400}
                />
              </div>
              <div
                className={`sd-assembly-wrapper ${phase === "visible" || phase === "exit" || phase === "assembling" ? "sd-assembly-active" : ""}`}
                data-label="[ACTIVITY: CONTRIB_GRID]"
                style={{ "--delay": 1600 } as React.CSSProperties}
              >
                <span className="sd-hud-corner tl" />
                <span className="sd-hud-corner tr" />
                <span className="sd-hud-corner bl" />
                <span className="sd-hud-corner br" />
                <div className="sd-laser-border" />
                <div className="sd-scanner-line" />
                <ContributionGrid
                  data={contributions}
                  loading={loading}
                  delay={1600}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. Full screen white flash glitch */}
      {phase === "booting" && <div className="sd-flash-overlay" />}

      {/* Corner HUD accents (only visible after fully visible) */}
      {phase === "visible" && (
        <>
          <i className="sd-corner sd-corner-tl" />
          <i className="sd-corner sd-corner-tr" />
          <i className="sd-corner sd-corner-bl" />
          <i className="sd-corner sd-corner-br" />
        </>
      )}

      {/* 6. Welcome Dialog Popup */}
      {showWelcomePopup && (
        <div className="sd-popup-overlay">
          <div className="sd-popup-content">
            <span className="sd-popup-corner tl" />
            <span className="sd-popup-corner tr" />
            <span className="sd-popup-corner bl" />
            <span className="sd-popup-corner br" />
            
            <div className="sd-popup-header">
              <span className="sd-popup-dot" />
              <span className="sd-popup-title">SYSTEM NOTIFICATION</span>
            </div>

            <div className="sd-popup-body">
              <div className="sd-popup-msg">Welcome to my portfolio</div>
              <button
                onClick={() => {
                  sfx.playClick();
                  handleEnter();
                }}
                onMouseEnter={() => sfx.playHover()}
                className="sd-cta sd-cta-in"
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
        </div>
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
  background: var(--sd-bg);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  will-change: opacity, transform;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-tap-highlight-color: transparent;

  /* Default Dark Mode Theme Values */
  --sd-bg: #06070a;
  --sd-card-bg: linear-gradient(135deg, rgba(15, 17, 26, 0.75) 0%, rgba(8, 9, 15, 0.8) 100%);
  --sd-card-border: rgba(129, 140, 248, 0.1);
  --sd-card-border-hover: rgba(129, 140, 248, 0.4);
  --sd-text-title: #f8fafc;
  --sd-text-subtitle: #64748b;
  --sd-hud-accent: rgba(129, 140, 248, 0.45);
  --sd-hud-corner-accent: rgba(129, 140, 248, 0.75);
  
  --sd-boot-hud-bg: rgba(10, 12, 18, 0.85);
  --sd-boot-hud-border: rgba(129, 140, 248, 0.25);
  --sd-boot-console-bg: rgba(4, 5, 8, 0.85);
  
  --sd-log-system: #818cf8;
  --sd-log-ok: #34d399;
  --sd-log-info: #38bdf8;
  --sd-log-warning: #fbbf24;
  --sd-log-prompt: rgba(129, 140, 248, 0.5);
  
  --sd-cta-bg: rgba(129, 140, 248, 0.03);
  --sd-cta-border: rgba(129, 140, 248, 0.16);
  --sd-cta-text: rgba(199, 210, 254, 0.8);
  --sd-cta-text-hover: #e0e7ff;

  --sd-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.03);
  --sd-lang-track-bg: rgba(255, 255, 255, 0.02);
  --sd-skeleton-bg: linear-gradient(90deg, rgba(51, 56, 70, 0.25) 25%, rgba(129, 140, 248, 0.1) 50%, rgba(51, 56, 70, 0.25) 75%);

  --sd-contrib-l0: rgba(55, 60, 75, 0.6);
  --sd-contrib-l1: rgba(99, 102, 241, 0.35);
  --sd-contrib-l2: rgba(99, 102, 241, 0.55);
  --sd-contrib-l3: rgba(99, 102, 241, 0.78);
  --sd-contrib-l4: rgba(129, 140, 248, 1);
}

/* Light Theme overrides when root document doesn't have .dark class */
:root:not(.dark) .sd-root {
  --sd-bg: #f8fafc;
  --sd-card-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(241, 245, 249, 0.8) 100%);
  --sd-card-border: rgba(79, 70, 229, 0.08);
  --sd-card-border-hover: rgba(79, 70, 229, 0.35);
  --sd-text-title: #0f172a;
  --sd-text-subtitle: #475569;
  --sd-hud-accent: rgba(79, 70, 229, 0.45);
  --sd-hud-corner-accent: rgba(79, 70, 229, 0.75);
  
  --sd-boot-hud-bg: rgba(255, 255, 255, 0.85);
  --sd-boot-hud-border: rgba(79, 70, 229, 0.2);
  --sd-boot-console-bg: rgba(241, 245, 249, 0.85);
  
  --sd-log-system: #4f46e5;
  --sd-log-ok: #059669;
  --sd-log-info: #0284c7;
  --sd-log-warning: #d97706;
  --sd-log-prompt: rgba(79, 70, 229, 0.5);
  
  --sd-cta-bg: rgba(79, 70, 229, 0.03);
  --sd-cta-border: rgba(79, 70, 229, 0.16);
  --sd-cta-text: rgba(79, 70, 229, 0.8);
  --sd-cta-text-hover: #4f46e5;

  --sd-shadow: 0 8px 32px 0 rgba(79, 70, 229, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8);
  --sd-lang-track-bg: rgba(0, 0, 0, 0.04);
  --sd-skeleton-bg: linear-gradient(90deg, rgba(226, 232, 240, 0.5) 25%, rgba(79, 70, 229, 0.08) 50%, rgba(226, 232, 240, 0.5) 75%);

  --sd-contrib-l0: rgba(226, 232, 240, 0.85);
  --sd-contrib-l1: rgba(79, 70, 229, 0.25);
  --sd-contrib-l2: rgba(79, 70, 229, 0.45);
  --sd-contrib-l3: rgba(79, 70, 229, 0.7);
  --sd-contrib-l4: rgba(79, 70, 229, 1);
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

/* ── System Boot Loader HUD ── */
.sd-boot-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: var(--sd-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 2rem;
}
.sd-boot-hud {
  position: relative;
  width: 100%;
  max-width: 680px;
  background: var(--sd-boot-hud-bg);
  border: 1.5px solid var(--sd-boot-hud-border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 20px var(--sd-cta-bg), var(--sd-shadow);
  border-radius: 10px;
  padding: 2.2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  box-sizing: border-box;
}
.sd-boot-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--sd-hud-corner-accent);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}
.sd-boot-corner.tl { top: 5px; left: 5px; border-top-width: 2.5px; border-left-width: 2.5px; }
.sd-boot-corner.tr { top: 5px; right: 5px; border-top-width: 2.5px; border-right-width: 2.5px; }
.sd-boot-corner.bl { bottom: 5px; left: 5px; border-bottom-width: 2.5px; border-left-width: 2.5px; }
.sd-boot-corner.br { bottom: 5px; right: 5px; border-bottom-width: 2.5px; border-right-width: 2.5px; }

.sd-boot-header {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px dashed var(--sd-boot-hud-border);
  padding-bottom: 0.8rem;
}
.sd-boot-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 10px #ef4444;
  animation: sd-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes sd-ping {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 0.8; }
}
.sd-boot-title {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--sd-text-title);
  letter-spacing: 0.15em;
}

.sd-boot-scanner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}
.sd-boot-radar {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px dashed var(--sd-boot-hud-border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-boot-radar-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--sd-card-border);
}
.sd-boot-radar-circle.c1 { width: 50px; height: 50px; }
.sd-boot-radar-circle.c2 { width: 80px; height: 80px; }
.sd-boot-radar-circle.c3 {
  width: 110px;
  height: 110px;
  border-color: var(--sd-hud-accent);
  border-style: dotted;
  animation: sd-spin 10s linear infinite;
}
.sd-boot-radar-sweep {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--sd-hud-accent) 0deg, transparent 90deg);
  animation: sd-spin 2.2s linear infinite;
}
@keyframes sd-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.sd-boot-radar-glitch {
  font-family: var(--font-geist-mono), monospace;
  font-size: 7px;
  color: var(--sd-hud-accent);
  letter-spacing: 0.08em;
  animation: sd-glitch-text 3s infinite alternate;
}

.sd-boot-console {
  height: 130px;
  overflow-y: auto;
  background: var(--sd-boot-console-bg);
  border: 1px solid var(--sd-boot-hud-border);
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.7rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sd-boot-log {
  color: var(--sd-text-subtitle);
}
.sd-boot-log.system {
  color: var(--sd-log-system);
}
.sd-boot-log.ok {
  color: var(--sd-log-ok);
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.15);
}
.sd-boot-log.info {
  color: var(--sd-log-info);
}
.sd-boot-log.warning {
  color: var(--sd-log-warning);
}
.sd-boot-prompt {
  color: var(--sd-log-prompt);
  margin-right: 6px;
}
.sd-boot-cursor {
  width: 5px;
  height: 10px;
  background: var(--sd-log-system);
  display: inline-block;
  margin-left: 2px;
  animation: sd-cursor-blink 1s steps(2, start) infinite;
}
@keyframes sd-cursor-blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.sd-boot-progress-wrap {
  display: flex;
  align-items: center;
  gap: 15px;
}
.sd-boot-progress-track {
  flex: 1;
  height: 6px;
  background: var(--sd-cta-bg);
  border: 1px solid var(--sd-boot-hud-border);
  border-radius: 999px;
  overflow: hidden;
}
.sd-boot-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sd-log-system), var(--sd-log-info));
  box-shadow: 0 0 10px var(--sd-log-system);
  border-radius: 999px;
  transition: width 0.1s ease-out;
}
.sd-boot-progress-pct {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.75rem;
  color: var(--sd-log-system);
  font-weight: 700;
  min-width: 32px;
  text-align: right;
}
.sd-boot-bypass-hint {
  text-align: center;
  font-family: var(--font-geist-mono), monospace;
  font-size: 7px;
  color: var(--sd-text-subtitle);
  letter-spacing: 0.05em;
}

/* ── Central Cinematic Title Sweep ── */
.sd-title-reveal-container {
  position: absolute;
  inset: 0;
  background: var(--sd-bg);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-title-reveal-content {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sd-title-sys-id {
  font-family: var(--font-geist-mono), monospace;
  font-size: clamp(0.6rem, 1.2vmin, 0.78rem);
  color: var(--sd-log-system);
  letter-spacing: 0.2em;
  margin-bottom: 8px;
  opacity: 0.7;
}
.sd-title-cinematic {
  font-family: var(--font-geist-sans), sans-serif;
  font-size: clamp(3rem, 10vmin, 6rem);
  font-weight: 900;
  color: var(--sd-text-title);
  letter-spacing: 0.45em;
  margin: 0;
  text-indent: 0.45em;
  text-shadow: 0 0 40px var(--sd-card-border-hover), 0 0 80px var(--sd-card-border);
  animation: sd-title-expand 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes sd-title-expand {
  0% { transform: scale(0.95); letter-spacing: 0.2em; opacity: 0; filter: blur(5px); }
  30% { opacity: 1; filter: blur(0); }
  100% { transform: scale(1.03); letter-spacing: 0.45em; opacity: 0.9; }
}
.sd-title-sub-cinematic {
  font-family: var(--font-geist-mono), monospace;
  font-size: clamp(0.55rem, 1vmin, 0.72rem);
  color: var(--sd-text-subtitle);
  letter-spacing: 0.3em;
  margin-top: 14px;
  opacity: 0.85;
}
.sd-title-light-sweep {
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--sd-hud-corner-accent), transparent);
  transform: skewX(-25deg);
  pointer-events: none;
  animation: sd-light-sweep 1.5s ease-out forwards;
}
@keyframes sd-light-sweep {
  0% { left: -150%; }
  100% { left: 250%; }
}

/* ── Full-page centered wrapper ── */
.sd-fullpage {
  position: relative; z-index: 2;
  width: 100%; height: 100%;
  display: flex;
  padding: clamp(1.2rem, 3vh, 2.5rem) clamp(1rem, 3vw, 3rem);
  box-sizing: border-box;
  backdrop-filter: blur(1px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── Container ── */
.sd-container {
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(0.8rem, 2vh, 1.4rem);
  width: 100%;
  max-width: 1100px;
  margin: auto;
  box-sizing: border-box;
}

/* ── 3D Blueprint Assembly Wrapper ── */
.sd-assembly-wrapper {
  position: relative;
  border-radius: 10px;
  opacity: 0;
  background: var(--sd-card-bg);
  box-shadow: var(--sd-shadow);
  backdrop-filter: blur(12px);
  border: 1px solid transparent;
  transform: translate3d(0, 45px, -150px) rotateX(12deg);
  transition: 
    opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), 
    transform 1.3s cubic-bezier(0.16, 1, 0.3, 1), 
    border-color 0.8s ease, 
    box-shadow 0.3s ease;
  will-change: opacity, transform;
  width: 100%;
}
.sd-assembly-active {
  opacity: 1;
  transform: translate3d(0, 0, 0) rotateX(0deg);
  border-color: var(--sd-card-border);
  transition-delay: 
    calc(var(--delay) * 1ms), 
    calc(var(--delay) * 1ms), 
    calc((var(--delay) + 400) * 1ms), 
    0ms;
}
.sd-assembly-active:hover {
  border-color: var(--sd-card-border-hover);
  box-shadow: 0 0 25px var(--sd-cta-bg), var(--sd-shadow);
  transition-delay: 0ms;
}
.sd-assembly-wrapper::after {
  content: attr(data-label);
  position: absolute;
  top: -14px;
  left: 8px;
  font-family: var(--font-geist-mono), monospace;
  font-size: 7px;
  font-weight: 700;
  color: var(--sd-hud-accent);
  letter-spacing: 0.08em;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.sd-assembly-active::after {
  opacity: 1;
  transition-delay: calc((var(--delay) + 500) * 1ms);
}

.sd-hud-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--sd-hud-accent);
  border-style: solid;
  border-width: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 10;
}
.sd-assembly-active .sd-hud-corner {
  opacity: 0.75;
  transition-delay: calc((var(--delay) + 350) * 1ms);
}
.sd-hud-corner.tl { top: 4px; left: 4px; border-top-width: 1.5px; border-left-width: 1.5px; }
.sd-hud-corner.tr { top: 4px; right: 4px; border-top-width: 1.5px; border-right-width: 1.5px; }
.sd-hud-corner.bl { bottom: 4px; left: 4px; border-bottom-width: 1.5px; border-left-width: 1.5px; }
.sd-hud-corner.br { bottom: 4px; right: 4px; border-bottom-width: 1.5px; border-right-width: 1.5px; }

.sd-laser-border {
  position: absolute;
  inset: 0;
  border: 1.2px dashed var(--sd-hud-accent);
  border-radius: 10px;
  pointer-events: none;
  opacity: 0;
  z-index: 9;
}
.sd-assembly-active .sd-laser-border {
  animation: sd-border-draw 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay) * 1ms);
}
@keyframes sd-border-draw {
  0% {
    opacity: 0;
    clip-path: inset(0 100% 100% 0);
  }
  50% {
    opacity: 1;
    clip-path: inset(0 0 100% 0);
  }
  100% {
    opacity: 1;
    border-style: solid;
    border-color: var(--sd-card-border);
    clip-path: inset(0 0 0 0);
  }
}

.sd-scanner-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--sd-hud-corner-accent), transparent);
  box-shadow: 0 0 10px var(--sd-hud-corner-accent);
  pointer-events: none;
  opacity: 0;
  z-index: 10;
}
.sd-assembly-active .sd-scanner-line {
  animation: sd-scanner-sweep 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: calc((var(--delay) + 120) * 1ms);
}
@keyframes sd-scanner-sweep {
  0% { top: 0%; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
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
  animation: sd-assemble-header 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sd-header-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--sd-log-system);
  box-shadow: 0 0 16px 2px var(--sd-hud-corner-accent);
  margin-bottom: clamp(0.25rem, 0.5vh, 0.45rem);
  animation: sd-dot-glow 2s ease-in-out infinite alternate;
}
@keyframes sd-dot-glow {
  0% { transform: scale(0.9); box-shadow: 0 0 12px var(--sd-hud-corner-accent); }
  100% { transform: scale(1.15); box-shadow: 0 0 24px 4px var(--sd-hud-corner-accent); }
}

.sd-title {
  margin: 0;
  font-size: clamp(1.6rem, 3.8vmin, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--sd-text-title);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1.1;
  text-shadow: 0 0 40px var(--sd-card-border);
}
.sd-subtitle {
  margin: 6px 0 0;
  font-size: clamp(0.75rem, 1.3vmin, 1.0rem);
  color: var(--sd-text-subtitle);
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
  padding: clamp(0.8rem, 1.8vh, 1.25rem) clamp(1.2rem, 2.2vw, 1.85rem);
  opacity: 0;
  will-change: opacity, transform;
}
.sd-avatar {
  width: clamp(54px, 8vmin, 76px);
  height: clamp(54px, 8vmin, 76px);
  border-radius: 50%;
  border: 2px solid var(--sd-hud-accent);
  box-shadow: 0 0 16px var(--sd-card-border);
  flex-shrink: 0;
  transition: transform 0.4s ease;
}
.sd-profile:hover .sd-avatar {
  transform: scale(1.05) rotate(3deg);
  border-color: var(--sd-hud-corner-accent);
}
.sd-profile-info {
  min-width: 0;
}
.sd-profile-name {
  margin: 0;
  font-size: clamp(1.0rem, 2vmin, 1.4rem);
  font-weight: 800;
  color: var(--sd-text-title);
  letter-spacing: -0.01em;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
.sd-profile-bio {
  margin: 2px 0 0;
  font-size: clamp(0.75rem, 1.2vmin, 0.95rem);
  color: var(--sd-text-subtitle);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1.35;
}
.sd-profile-meta {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 4px;
  font-size: clamp(0.7rem, 1.1vmin, 0.85rem);
  color: var(--sd-text-subtitle);
  font-family: var(--font-geist-mono), monospace;
  flex-wrap: wrap;
}
.sd-meta-num {
  color: var(--sd-log-system);
  font-weight: 600;
}
.sd-profile-meta-dot {
  color: rgba(100, 116, 139, 0.25);
}
.sd-meta-loc {
  color: var(--sd-text-subtitle);
}

/* ── Skeleton Loading ── */
.sd-skeleton-line {
  background: var(--sd-skeleton-bg);
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
  background: var(--sd-skeleton-bg);
  flex-shrink: 0;
  animation: sd-shimmer-move 1.6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
  background-size: 200% 100%;
}
.sd-skeleton-name { width: 140px; height: 18px; }
.sd-skeleton-bio { width: 220px; height: 14px; margin-top: 5px; }
.sd-skeleton-meta { width: 160px; height: 12px; margin-top: 5px; }

/* ── Error Banner ── */
.sd-error {
  width: 100%;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  background: var(--sd-cta-bg);
  border: 1px solid var(--sd-log-warning);
  color: var(--sd-log-warning);
  font-size: clamp(0.55rem, 1vmin, 0.7rem);
  font-family: var(--font-geist-mono), monospace;
  text-align: center;
}

/* ── Stat Cards Grid ── */
.sd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(0.6rem, 1.2vmin, 1.0rem);
  width: 100%;
  margin-top: 14px;
}
@media (max-width: 520px) {
  .sd-grid { grid-template-columns: repeat(2, 1fr); }
}

.sd-stat-card {
  position: relative;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(0.8rem, 1.5vw, 1.2rem);
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(0.3rem, 0.6vh, 0.5rem);
  overflow: hidden;
  opacity: 0;
  cursor: default;
  will-change: opacity, transform;
}
.sd-stat-icon {
  font-size: clamp(1.1rem, 1.8vmin, 1.4rem);
  color: var(--sd-log-system);
  line-height: 1;
  filter: drop-shadow(0 0 6px var(--sd-hud-accent));
}
.sd-stat-value {
  font-size: clamp(1.8rem, 3.5vmin, 2.8rem);
  font-weight: 800;
  color: var(--sd-text-title);
  line-height: 1.1;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.sd-stat-label {
  font-size: clamp(0.6rem, 1vmin, 0.75rem);
  font-weight: 500;
  color: var(--sd-text-subtitle);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
}
.sd-stat-shimmer {
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent 0%, var(--sd-cta-bg) 40%, var(--sd-hud-accent) 50%, var(--sd-cta-bg) 60%, transparent 100%);
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
  gap: clamp(0.6rem, 1.2vmin, 1.0rem);
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  margin-top: 14px;
}
@media (max-width: 860px) {
  .sd-bottom-row { grid-template-columns: 1fr; }
}

/* ── Streak / Insights Section ── */
.sd-streak-section {
  width: 100%;
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  opacity: 0;
  will-change: opacity, transform;
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
  background: var(--sd-cta-bg);
  border: 1px solid var(--sd-cta-border);
  padding: clamp(0.4rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.2vw, 0.9rem);
  border-radius: 10px;
  transition: border-color 0.3s, background-color 0.3s;
}
.sd-streak-item:hover {
  border-color: var(--sd-hud-accent);
  background: var(--sd-card-border);
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
  color: var(--sd-text-subtitle);
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
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-section-title {
  margin: 0 0 clamp(0.5rem, 0.8vh, 0.75rem);
  font-size: clamp(0.7rem, 1.2vmin, 0.85rem);
  font-weight: 600;
  color: var(--sd-text-subtitle);
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
  filter: drop-shadow(0 0 10px var(--sd-card-border-hover));
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
  color: var(--sd-text-title);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  line-height: 1;
}
.sd-lang-center-lbl {
  font-size: clamp(0.5rem, 0.8vmin, 0.62rem);
  color: var(--sd-text-subtitle);
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
  color: var(--sd-text-title);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-weight: 500;
}
.sd-lang-pct {
  font-size: clamp(0.55rem, 0.9vmin, 0.68rem);
  color: var(--sd-text-subtitle);
  font-family: var(--font-geist-mono), monospace;
  margin-left: auto;
}
.sd-lang-item-bar-bg {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: var(--sd-cta-bg);
  overflow: hidden;
}
.sd-lang-item-bar {
  height: 100%;
  border-radius: 999px;
}
.sd-lang-skeleton { opacity: 1; }
.sd-lang-track-skeleton {
  width: 100%; height: 7px; border-radius: 999px;
  background: var(--sd-skeleton-bg);
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
  padding: clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 2vw, 1.8rem);
  display: flex; flex-direction: column;
  min-width: 0;
  opacity: 0;
  will-change: opacity, transform;
}
.sd-contrib-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: clamp(0.35rem, 0.6vh, 0.55rem);
}
.sd-contrib-total {
  font-size: clamp(0.6rem, 0.9vmin, 0.75rem);
  color: var(--sd-text-subtitle);
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
  color: var(--sd-text-subtitle);
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
  border-top: 1px dashed var(--sd-card-border);
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
  color: var(--sd-text-subtitle);
  text-transform: uppercase;
  font-family: var(--font-geist-mono), monospace;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.sd-contrib-chart-peak {
  font-size: clamp(0.48rem, 0.8vmin, 0.6rem);
  color: var(--sd-log-system);
  font-family: var(--font-geist-mono), monospace;
  font-weight: 500;
  background: var(--sd-cta-bg);
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

/* ── Child Assembly Transitions ── */
.sd-profile-in,
.sd-stat-card.sd-card-in,
.sd-streak-in,
.sd-lang-in,
.sd-contrib-in {
  animation: sd-assemble-child 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc((var(--delay) + 200) * 1ms);
}

/* ── CTA ── */
.sd-cta {
  position: relative;
  padding: clamp(0.6rem, 1.2vh, 0.95rem) clamp(2rem, 4vw, 3.5rem);
  background: var(--sd-cta-bg);
  border: 1px solid var(--sd-cta-border);
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
  border-color: var(--sd-hud-accent);
  box-shadow: 0 0 30px var(--sd-cta-bg), inset 0 0 20px var(--sd-cta-bg);
}
.sd-cta:active { transform: scale(0.97); }
.sd-cta-pulse {
  position: absolute; inset: -1px;
  border-radius: 11px;
  border: 1px solid var(--sd-cta-border);
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
  color: var(--sd-cta-text);
  font-family: var(--font-geist-mono), monospace;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.3s;
}
.sd-cta:hover .sd-cta-text { color: var(--sd-cta-text-hover); }
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
.sd-corner-tl { top: clamp(10px, 1.8vmin, 20px); left: clamp(10px, 1.8vmin, 20px); border-top: 1.5px solid var(--sd-hud-accent); border-left: 1.5px solid var(--sd-hud-accent); }
.sd-corner-tr { top: clamp(10px, 1.8vmin, 20px); right: clamp(10px, 1.8vmin, 20px); border-top: 1.5px solid var(--sd-hud-accent); border-right: 1.5px solid var(--sd-hud-accent); }
.sd-corner-bl { bottom: clamp(10px, 1.8vmin, 20px); left: clamp(10px, 1.8vmin, 20px); border-bottom: 1.5px solid var(--sd-hud-accent); border-left: 1.5px solid var(--sd-hud-accent); }
.sd-corner-br { bottom: clamp(10px, 1.8vmin, 20px); right: clamp(10px, 1.8vmin, 20px); border-bottom: 1.5px solid var(--sd-hud-accent); border-right: 1.5px solid var(--sd-hud-accent); }
@keyframes sd-corner-fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* ── Compact Viewport Adjustments (Shorter heights) ── */
@media (max-height: 800px) {
  .sd-fullpage {
    padding: clamp(0.6rem, 1.5vh, 1.2rem) clamp(0.8rem, 2vw, 2.2rem);
  }
  .sd-container {
    gap: clamp(0.4rem, 1vh, 0.8rem);
  }
  .sd-profile {
    padding: 0.6rem 1.2rem;
  }
  .sd-avatar {
    width: 48px;
    height: 48px;
  }
  .sd-stat-card {
    padding: 0.6rem 0.8rem;
  }
  .sd-stat-value {
    font-size: clamp(1.4rem, 2.5vmin, 2.2rem);
  }
  .sd-streak-section, .sd-lang-section, .sd-contrib-section {
    padding: 0.8rem 1.2rem;
  }
  .sd-lang-chart-container {
    width: 90px;
    height: 90px;
  }
  .sd-lang-body {
    gap: 1rem;
  }
  .sd-contrib-chart-wrap {
    margin-top: 0.4rem;
    padding-top: 0.4rem;
  }
}

/* ── Side Assembly Keyframes ── */
@keyframes sd-assemble-header {
  0% { opacity: 0; transform: translateY(-30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes sd-assemble-child {
  0% { opacity: 0; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1); }
}

/* ── Welcome Dialog Popup ── */
.sd-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 7, 10, 0.45);
  backdrop-filter: blur(6px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: sd-popup-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
:root:not(.dark) .sd-popup-overlay {
  background: rgba(248, 250, 252, 0.45);
}
@keyframes sd-popup-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.sd-popup-content {
  position: relative;
  width: 90%;
  max-width: 420px;
  background: var(--sd-card-bg);
  border: 1.5px solid var(--sd-hud-accent);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 30px var(--sd-cta-bg), var(--sd-shadow);
  border-radius: 10px;
  padding: 2.2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  transform: translateY(20px) scale(0.95);
  animation: sd-popup-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes sd-popup-slide-up {
  0% { transform: translateY(20px) scale(0.95); }
  100% { transform: translateY(0) scale(1); }
}

.sd-popup-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--sd-hud-corner-accent);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}
.sd-popup-corner.tl { top: 5px; left: 5px; border-top-width: 2px; border-left-width: 2px; }
.sd-popup-corner.tr { top: 5px; right: 5px; border-top-width: 2px; border-right-width: 2px; }
.sd-popup-corner.bl { bottom: 5px; left: 5px; border-bottom-width: 2px; border-left-width: 2px; }
.sd-popup-corner.br { bottom: 5px; right: 5px; border-bottom-width: 2px; border-right-width: 2px; }

.sd-popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px dashed var(--sd-card-border);
  padding-bottom: 0.8rem;
  justify-content: center;
}
.sd-popup-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sd-log-ok);
  box-shadow: 0 0 8px var(--sd-log-ok);
  animation: sd-popup-pulse 1.5s ease-in-out infinite alternate;
}
@keyframes sd-popup-pulse {
  0% { transform: scale(0.9); opacity: 0.6; }
  100% { transform: scale(1.15); opacity: 1; }
}
.sd-popup-title {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--sd-text-subtitle);
  letter-spacing: 0.12em;
}

.sd-popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}
.sd-popup-msg {
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-size: clamp(1.1rem, 2.2vmin, 1.4rem);
  font-weight: 800;
  color: var(--sd-text-title);
  letter-spacing: -0.01em;
  text-align: center;
  line-height: 1.3;
}
`;

