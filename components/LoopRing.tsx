import { LOOP_NODES } from "@/components/loop";

const CENTER = 260;
const RADIUS = 178;

function nodePos(i: number) {
  const angle = (-90 + i * 60) * (Math.PI / 180);
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

/**
 * The closed loop, drawn as six nodes on a ring that returns to the start.
 * - No `activeIndex`: autoplay a highlight traveling the ring (landing).
 * - `activeIndex` set: light that node, and mark earlier nodes complete (demo).
 */
export function LoopRing({
  activeIndex,
  size = 520,
}: {
  activeIndex?: number;
  size?: number;
}) {
  const autoplay = activeIndex === undefined;
  const circlePath = `M ${CENTER} ${CENTER - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER - 0.1} ${CENTER - RADIUS}`;

  return (
    <svg viewBox="0 0 520 520" width={size} height={size} className="max-w-full">
      <defs>
        <radialGradient id="hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-glow)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Ring */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
      {/* Faint animated highlight arc that travels the ring on the landing page */}
      {autoplay && (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="90 1030"
          style={{ animation: "ringDash 6s linear infinite", strokeDashoffset: 1120 }}
        />
      )}

      {/* Center hub */}
      <circle cx={CENTER} cy={CENTER} r="86" fill="url(#hub)" />
      <text x={CENTER} y={CENTER - 6} textAnchor="middle" className="fill-fg font-mono" fontSize="12" letterSpacing="2">
        CLOSED
      </text>
      <text x={CENTER} y={CENTER + 12} textAnchor="middle" className="fill-fg font-mono" fontSize="12" letterSpacing="2">
        LOOP
      </text>
      <text x={CENTER} y={CENTER + 30} textAnchor="middle" fill="var(--fg-dim)" className="font-mono" fontSize="9" letterSpacing="1.5">
        COMPOUNDING
      </text>

      {/* Traveling packet (autoplay only) */}
      {autoplay && (
        <circle r="5" fill="var(--accent)">
          <animateMotion dur="6s" repeatCount="indefinite" path={circlePath} />
        </circle>
      )}

      {/* Nodes */}
      {LOOP_NODES.map((node, i) => {
        const { x, y } = nodePos(i);
        const isActive = activeIndex === i;
        const isDone = activeIndex !== undefined && i < activeIndex;
        const ring = isActive ? "var(--accent)" : isDone ? "var(--good)" : "var(--border-strong)";
        const fill = isActive ? "var(--bg-elevated)" : "var(--bg-card)";
        return (
          <g key={node.id}>
            <circle
              cx={x}
              cy={y}
              r="30"
              fill={fill}
              stroke={ring}
              strokeWidth={isActive ? 2.5 : 1.5}
              style={isActive ? { filter: "drop-shadow(0 0 10px var(--accent-glow))" } : undefined}
            />
            <text x={x} y={y - 3} textAnchor="middle" fill={isActive ? "var(--accent-soft)" : "var(--fg-muted)"} className="font-mono" fontSize="12">
              {node.n}
            </text>
            <text x={x} y={y + 46} textAnchor="middle" className="fill-fg" fontSize="12.5" fontWeight="500">
              {node.name}
            </text>
            <text x={x} y={y + 61} textAnchor="middle" fill="var(--fg-dim)" className="font-mono" fontSize="8.5">
              {node.io}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
