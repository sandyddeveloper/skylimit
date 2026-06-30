"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SectionContainer } from "../layout/section-container";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Shield, RefreshCw } from "lucide-react";

// Local SVG bug icon for target drops
function BugIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v2M5 7.2l1.4 1.4M19 7.2l-1.4 1.4M4 12h2M18 12h2M5 16.8l1.4-1.4M19 16.8l-1.4-1.4" />
      <rect x="8" y="6" width="8" height="12" rx="4" />
      <path d="M12 18v2M9 6c0-1.7 1.3-3 3-3s3 1.3 3 3" />
    </svg>
  );
}

export function AboutSection() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [currentTech, setCurrentTech] = useState("FastAPI");

  // Track the snake game state without causing component re-renders
  const gameStateRef = useRef({
    snake: [
      { x: 10, y: 6 },
      { x: 10, y: 7 },
      { x: 10, y: 8 },
    ],
    direction: "UP",
    target: { x: 5, y: 4, label: "FastAPI" },
    bug: { x: -1, y: -1 },
    score: 0,
    libraries: [
      "FastAPI",
      "Django",
      "Python",
      "PostgreSQL",
      "Docker",
      "PyTorch",
      "Redis",
      "Numpy",
      "Pandas",
      "Flask",
      "Celery",
      "SQLAlchemy",
    ],
    cols: 20,
    rows: 15,
  });

  // Handle click on canvas to drop a bug
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellWidth = canvas.width / gameStateRef.current.cols;
    const cellHeight = canvas.height / gameStateRef.current.rows;

    const clickX = Math.floor(x / cellWidth);
    const clickY = Math.floor(y / cellHeight);

    // Don't drop bug on top of snake body
    const hitsBody = gameStateRef.current.snake.some(
      (segment) => segment.x === clickX && segment.y === clickY
    );

    if (!hitsBody) {
      gameStateRef.current.bug = { x: clickX, y: clickY };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high-DPI scaling for sharp drawings
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = "400px";
    canvas.style.height = "300px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let lastTime = 0;
    const tickRate = 130; // Snake updates every 130ms

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > tickRate) {
        updateGame();
        lastTime = timestamp;
      }

      drawGame(ctx);
      animationId = requestAnimationFrame(gameLoop);
    };

    const updateGame = () => {
      const state = gameStateRef.current;
      const head = state.snake[0];
      
      // Determine goal: prioritize bug over target
      const goal = state.bug.x !== -1 && state.bug.y !== -1 ? state.bug : state.target;

      const hx = head.x;
      const hy = head.y;

      const candidates = [
        { dir: "UP", x: hx, y: hy - 1 },
        { dir: "DOWN", x: hx, y: hy + 1 },
        { dir: "LEFT", x: hx - 1, y: hy },
        { dir: "RIGHT", x: hx + 1, y: hy },
      ];

      // Filter options within grid boundary and avoiding self-collision
      const valid = candidates.filter((c) => {
        if (c.x < 0 || c.x >= state.cols || c.y < 0 || c.y >= state.rows) return false;
        
        // Exclude tail segment from check since it moves forward in this tick
        const bodyCollisionGroup = state.snake.slice(0, -1);
        return !bodyCollisionGroup.some((segment) => segment.x === c.x && segment.y === c.y);
      });

      if (valid.length === 0) {
        // Trapped: Reset snake position
        state.snake = [
          { x: Math.floor(state.cols / 2), y: Math.floor(state.rows / 2) },
          { x: Math.floor(state.cols / 2), y: Math.floor(state.rows / 2) + 1 },
          { x: Math.floor(state.cols / 2), y: Math.floor(state.rows / 2) + 2 },
        ];
        state.direction = "UP";
        state.bug = { x: -1, y: -1 };
        return;
      }

      // Sort candidate paths by Manhattan distance to the current goal
      valid.sort((a, b) => {
        const distA = Math.abs(a.x - goal.x) + Math.abs(a.y - goal.y);
        const distB = Math.abs(b.x - goal.x) + Math.abs(b.y - goal.y);
        return distA - distB;
      });

      const nextMove = valid[0];
      state.direction = nextMove.dir;

      const newHead = { x: nextMove.x, y: nextMove.y };
      state.snake.unshift(newHead);

      // Check if target eaten
      if (newHead.x === state.target.x && newHead.y === state.target.y) {
        state.score += 1;
        setScore(state.score);

        // Fetch next technology target
        const currentIdx = state.libraries.indexOf(state.target.label);
        let nextIdx = Math.floor(Math.random() * state.libraries.length);
        if (nextIdx === currentIdx) nextIdx = (nextIdx + 1) % state.libraries.length;
        
        const nextLabel = state.libraries[nextIdx];
        setCurrentTech(nextLabel);

        // Spawn target in a random unoccupied cell
        let tx = Math.floor(Math.random() * state.cols);
        let ty = Math.floor(Math.random() * state.rows);
        while (state.snake.some((s) => s.x === tx && s.y === ty)) {
          tx = Math.floor(Math.random() * state.cols);
          ty = Math.floor(Math.random() * state.rows);
        }

        state.target = { x: tx, y: ty, label: nextLabel };
      } 
      // Check if user bug eaten
      else if (newHead.x === state.bug.x && newHead.y === state.bug.y) {
        state.score += 1;
        setScore(state.score);
        state.bug = { x: -1, y: -1 };
      } 
      // Normal slither: discard tail
      else {
        state.snake.pop();
      }
    };

    const drawGame = (c: CanvasRenderingContext2D) => {
      const state = gameStateRef.current;
      const isDark = theme === "dark";
      const w = 400;
      const h = 300;

      const cellW = w / state.cols;
      const cellH = h / state.rows;

      // 1. Draw Canvas Background
      c.fillStyle = isDark ? "#022c22" : "#f0fdf4";
      c.fillRect(0, 0, w, h);

      // 2. Draw Forest Grid Dots
      c.fillStyle = isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.15)";
      for (let col = 0; col < state.cols; col++) {
        for (let row = 0; row < state.rows; row++) {
          c.beginPath();
          c.arc(col * cellW + cellW / 2, row * cellH + cellH / 2, 1.5, 0, Math.PI * 2);
          c.fill();
        }
      }

      // 3. Draw Active User Bug (if placed)
      if (state.bug.x !== -1) {
        const bx = state.bug.x * cellW + cellW / 2;
        const by = state.bug.y * cellH + cellH / 2;

        // Draw pulsing highlight glow
        const pulse = 1 + Math.sin(Date.now() / 100) * 0.15;
        c.fillStyle = "rgba(239, 68, 68, 0.2)";
        c.beginPath();
        c.arc(bx, by, cellW * 0.7 * pulse, 0, Math.PI * 2);
        c.fill();

        // Draw Bug Circle Body
        c.fillStyle = "#ef4444";
        c.beginPath();
        c.arc(bx, by, 4, 0, Math.PI * 2);
        c.fill();
      }

      // 4. Draw Library Target
      const tx = state.target.x * cellW + cellW / 2;
      const ty = state.target.y * cellH + cellH / 2;

      c.font = "bold 9px monospace";
      const textPadding = 4;
      const textMetrics = c.measureText(state.target.label);
      const badgeW = textMetrics.width + textPadding * 2;
      const badgeH = 14;

      // Draw Badge Container
      c.fillStyle = isDark ? "#10b981" : "#047857";
      c.beginPath();
      c.roundRect(tx - badgeW / 2, ty - badgeH / 2, badgeW, badgeH, 4);
      c.fill();

      // Draw Badge Text
      c.fillStyle = "#ffffff";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(state.target.label, tx, ty);

      // 5. Draw Python Snake (Gold/Green textured circles)
      state.snake.forEach((segment, index) => {
        const sx = segment.x * cellW + cellW / 2;
        const sy = segment.y * cellH + cellH / 2;

        if (index === 0) {
          // Draw Snake Head
          c.fillStyle = isDark ? "#34d399" : "#10b981";
          c.beginPath();
          c.arc(sx, sy, cellW * 0.48, 0, Math.PI * 2);
          c.fill();

          // Draw Head Eyes (facing direction)
          c.fillStyle = "#ffffff";
          let eyeX1 = 0, eyeY1 = 0, eyeX2 = 0, eyeY2 = 0;
          const eyeOffset = 2.5;

          if (state.direction === "UP" || state.direction === "DOWN") {
            eyeX1 = sx - eyeOffset;
            eyeX2 = sx + eyeOffset;
            eyeY1 = sy - (state.direction === "UP" ? 2 : -2);
            eyeY2 = eyeY1;
          } else {
            eyeY1 = sy - eyeOffset;
            eyeY2 = sy + eyeOffset;
            eyeX1 = sx - (state.direction === "LEFT" ? 2 : -2);
            eyeX2 = eyeX1;
          }

          c.beginPath();
          c.arc(eyeX1, eyeY1, 1.5, 0, Math.PI * 2);
          c.arc(eyeX2, eyeY2, 1.5, 0, Math.PI * 2);
          c.fill();

          // Black Pupils
          c.fillStyle = "#000000";
          c.beginPath();
          c.arc(eyeX1, eyeY1, 0.6, 0, Math.PI * 2);
          c.arc(eyeX2, eyeY2, 0.6, 0, Math.PI * 2);
          c.fill();
        } else {
          // Alternate body colors for python camouflage
          c.fillStyle = index % 2 === 0 
            ? (isDark ? "#059669" : "#047857") 
            : (isDark ? "#fbbf24" : "#d97706");
          c.beginPath();
          c.arc(sx, sy, cellW * 0.42, 0, Math.PI * 2);
          c.fill();
        }
      });
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  // Restart snake to original size
  const handleRestart = () => {
    const state = gameStateRef.current;
    state.snake = [
      { x: 10, y: 6 },
      { x: 10, y: 7 },
      { x: 10, y: 8 },
    ];
    state.direction = "UP";
    state.bug = { x: -1, y: -1 };
    state.score = 0;
    setScore(0);
    
    // Reset target label
    const initialLabel = state.libraries[0];
    setCurrentTech(initialLabel);
    state.target = { x: 5, y: 4, label: initialLabel };
  };

  return (
    <SectionContainer id="about" className="relative overflow-hidden">
      
      {/* Dynamic Forest Theme Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-emerald-50/20 via-green-50/10 to-transparent dark:from-emerald-950/5 dark:via-emerald-900/5 dark:to-transparent" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Column 1: Bio Details (Roots & Leaves Layout) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              About Me
            </h2>
            <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
          </div>
          
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            I am a full stack software engineer with deep roots in backend API design and frontend interactive visual designs. I enjoy turning complex database structures and design requirements into clean, optimized production-grade systems.
          </p>

          {/* Roots and Leaves Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            
            {/* Roots Card */}
            <div className="p-5 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/5 dark:bg-emerald-950/20 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Backend Roots
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  FastAPI, Django, PostgreSQL, Redis, and scalable REST API development.
                </p>
              </div>
            </div>

            {/* Leaves Card */}
            <div className="p-5 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/5 dark:bg-emerald-950/20 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Frontend Leaves
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Next.js, Tailwind CSS, TypeScript, and smooth visual animations.
                </p>
              </div>
            </div>

            {/* Shield Card */}
            <div className="p-5 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/5 dark:bg-emerald-950/20 flex gap-4 sm:col-span-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Architectural Roots
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Clean architecture patterns, Docker deployment containers, and automated workflows.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Python Playground (Snake Game Widget) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[400px] flex flex-col gap-4 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/15 p-5 shadow-lg backdrop-blur-sm select-none">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Python Playground
                </h3>
                <p className="text-2xs text-slate-500 dark:text-slate-400">
                  Target chasing simulation
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Score badge */}
                <div className="flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold font-mono">
                  <span>Eaten:</span>
                  <span>{score}</span>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center h-7 w-7 rounded-full border border-emerald-500/30 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-all cursor-pointer active:scale-90"
                  aria-label="Reset simulation"
                  title="Reset score"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Playground Canvas Grid */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 dark:border-emerald-500/10 shadow-inner group">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="block cursor-crosshair max-w-full"
              />
            </div>

            {/* Tutorial text */}
            <div className="flex items-start gap-2.5 px-1 py-0.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                <BugIcon className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click anywhere on the green forest canvas to drop a <span className="text-red-500 font-semibold font-mono">bug (🐞)</span>! The Python snake will slither and seek it out. Otherwise, it tracks the current package: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentTech}</span>.
              </p>
            </div>

          </div>
        </div>

      </div>
    </SectionContainer>
  );
}
