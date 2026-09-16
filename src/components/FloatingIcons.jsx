import { useEffect, useRef } from "react";

/* -------- SVG icon set (currentColor → theme-aware) -------- */

function FalconIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M14 22c4-6 12-10 20-10 6 0 11 2 15 6l-6 3 9 2-7 4 6 4-10 4-6 6-5 12-6-14-4-4-6-13z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

function LaptopIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="14" y="14" width="36" height="24" rx="2"
            stroke="currentColor" strokeWidth="2" />
      <path d="M8 42h48l-4 6H12l-4-6z"
            stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 20h20M20 26h14M20 32h18"
            stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function MouseIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="22" y="12" width="20" height="40" rx="10"
            stroke="currentColor" strokeWidth="2" />
      <path d="M32 12v14" stroke="currentColor" strokeWidth="2" />
      <path d="M32 22v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CpuIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="16" width="32" height="32" rx="3"
            stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="24" width="16" height="16" rx="1"
            fill="currentColor" opacity="0.4" />
      {/* Pins */}
      {[20, 28, 36, 44].map((p) => (
        <g key={p}>
          <line x1={p} y1="8"  x2={p} y2="16" stroke="currentColor" strokeWidth="1.5" />
          <line x1={p} y1="48" x2={p} y2="56" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8"  y1={p} x2="16" y2={p} stroke="currentColor" strokeWidth="1.5" />
          <line x1="48" y1={p} x2="56" y2={p} stroke="currentColor" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

function CodeIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M22 20l-10 12 10 12M42 20l10 12-10 12M36 14l-8 36"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TerminalIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="14" width="48" height="36" rx="3"
            stroke="currentColor" strokeWidth="2" />
      <path d="M16 26l6 6-6 6M28 38h16"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WifiIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 26a30 30 0 0 1 44 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 34a20 20 0 0 1 28 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 42a10 10 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="50" r="2.5" fill="currentColor" />
    </svg>
  );
}

function DatabaseIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="16" rx="18" ry="6" stroke="currentColor" strokeWidth="2" />
      <path d="M14 16v32c0 3 8 6 18 6s18-3 18-6V16" stroke="currentColor" strokeWidth="2" />
      <path d="M14 26c0 3 8 6 18 6s18-3 18-6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M14 38c0 3 8 6 18 6s18-3 18-6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

/* -------- Icon layout: where each one floats -------- */
const ICONS = [
  { id: "falcon",   Component: FalconIcon,   x: 8,  y: 12, size: 52, depth: 1.2 },
  { id: "laptop",   Component: LaptopIcon,   x: 90, y: 18, size: 46, depth: 0.8 },
  { id: "mouse",    Component: MouseIcon,    x: 12, y: 78, size: 38, depth: 1.5 },
  { id: "cpu",      Component: CpuIcon,      x: 88, y: 72, size: 44, depth: 1.0 },
  { id: "code",     Component: CodeIcon,     x: 45, y: 8,  size: 34, depth: 0.6 },
  { id: "terminal", Component: TerminalIcon, x: 52, y: 88, size: 36, depth: 1.1 },
  { id: "wifi",     Component: WifiIcon,     x: 70, y: 45, size: 32, depth: 0.7 },
  { id: "database", Component: DatabaseIcon, x: 30, y: 55, size: 36, depth: 1.3 },
];

export default function FloatingIcons() {
  const containerRef = useRef(null);
  const iconRefs = useRef({});
  const mouseRef = useRef({ x: -9999, y: -9999 });

  /* ---- Mouse tracking ---- */
  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ---- Animation loop: float + repel from pointer ---- */
  useEffect(() => {
    let rafId;
    const t0 = performance.now();
    const REPEL_RADIUS = 130;   // px — how close before it pushes
    const REPEL_STRENGTH = 45;  // max px pushed

    const loop = (now) => {
      const t = (now - t0) / 1000;
      const { x: mx, y: my } = mouseRef.current;

      Object.entries(iconRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const cfg = ICONS.find((i) => i.id === id);
        if (!cfg) return;

        const baseX = (cfg.x / 100) * el.parentElement.offsetWidth;
        const baseY = (cfg.y / 100) * el.parentElement.offsetHeight;

        /* Gentle sine/cosine float */
        const floatX = Math.sin(t * 0.6 + cfg.depth * 5) * 8;
        const floatY = Math.cos(t * 0.8 + cfg.depth * 3) * 10;

        /* Repel from cursor */
        let repelX = 0;
        let repelY = 0;
        const dx = baseX + floatX - mx;
        const dy = baseY + floatY - my;
        const dist = Math.hypot(dx, dy);

        if (dist < REPEL_RADIUS && dist > 1) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force;
        }

        el.style.transform = `translate(${floatX + repelX}px, ${floatY + repelY}px)`;
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="floating-icons" ref={containerRef} aria-hidden="true">
      {ICONS.map(({ id, Component, size }) => (
        <span
          key={id}
          className={`floating-icon floating-icon-${id}`}
          style={{ left: `${ICONS.find((i) => i.id === id).x}%`, top: `${ICONS.find((i) => i.id === id).y}%` }}
          ref={(el) => (iconRefs.current[id] = el)}
        >
          <Component size={size} />
        </span>
      ))}
    </div>
  );
}