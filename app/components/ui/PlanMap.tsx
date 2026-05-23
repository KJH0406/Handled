"use client"

import type { PlanSlot } from "../../lib/planner/types"

export interface PlanMapProps {
  slots: PlanSlot[]
  dayLabel?: string
  ariaLabel: string
  pointsOverride?: Point[]
}

export interface Point {
  x: number
  y: number
}

const WIDTH = 880
const HEIGHT = 320
const PADDING_X = 80
const PADDING_Y = 60

const hashString = (s: string): number => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h >>> 0
}

const layoutPoints = (slots: PlanSlot[]): Point[] => {
  const n = slots.length
  if (n === 0) return []

  const innerW = WIDTH - PADDING_X * 2
  const innerH = HEIGHT - PADDING_Y * 2

  return slots.map((slot, i) => {
    const seed = hashString(slot.id)
    const tx = n === 1 ? 0.5 : i / (n - 1)
    const baseX = PADDING_X + tx * innerW

    const jitterX = (((seed >> 4) & 0xff) / 255 - 0.5) * (innerW / Math.max(n, 3)) * 0.6
    const jitterY = (((seed >> 12) & 0xff) / 255 - 0.5) * innerH * 0.7
    const midY = PADDING_Y + innerH / 2

    return {
      x: Math.max(PADDING_X, Math.min(WIDTH - PADDING_X, baseX + jitterX)),
      y: Math.max(PADDING_Y, Math.min(HEIGHT - PADDING_Y, midY + jitterY)),
    }
  })
}

export default function PlanMap({
  slots,
  dayLabel,
  ariaLabel,
  pointsOverride,
}: PlanMapProps) {
  const points = pointsOverride ?? layoutPoints(slots)

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--hairline-soft)",
        background: "#eef3f7",
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto" }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="plan-map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="#dde6ee"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="plan-map-water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cfe4f3" />
            <stop offset="100%" stopColor="#b6d4ea" />
          </linearGradient>
          <linearGradient id="plan-map-park" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dbeed3" />
            <stop offset="100%" stopColor="#c5e3b8" />
          </linearGradient>
        </defs>

        <rect width={WIDTH} height={HEIGHT} fill="#eef3f7" />
        <rect width={WIDTH} height={HEIGHT} fill="url(#plan-map-grid)" />

        <path
          d={`M0,${HEIGHT * 0.72} C${WIDTH * 0.2},${HEIGHT * 0.55} ${WIDTH * 0.45},${HEIGHT * 0.95} ${WIDTH * 0.7},${HEIGHT * 0.78} S${WIDTH},${HEIGHT * 0.7} ${WIDTH},${HEIGHT * 0.85} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`}
          fill="url(#plan-map-water)"
          opacity="0.85"
        />

        <ellipse
          cx={WIDTH * 0.18}
          cy={HEIGHT * 0.3}
          rx={WIDTH * 0.12}
          ry={HEIGHT * 0.18}
          fill="url(#plan-map-park)"
          opacity="0.85"
        />
        <ellipse
          cx={WIDTH * 0.78}
          cy={HEIGHT * 0.25}
          rx={WIDTH * 0.1}
          ry={HEIGHT * 0.15}
          fill="url(#plan-map-park)"
          opacity="0.7"
        />

        <path
          d={`M0,${HEIGHT * 0.45} Q${WIDTH * 0.35},${HEIGHT * 0.4} ${WIDTH * 0.55},${HEIGHT * 0.5} T${WIDTH},${HEIGHT * 0.48}`}
          fill="none"
          stroke="#c8d3dd"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M${WIDTH * 0.3},0 Q${WIDTH * 0.32},${HEIGHT * 0.4} ${WIDTH * 0.4},${HEIGHT * 0.7} T${WIDTH * 0.55},${HEIGHT}`}
          fill="none"
          stroke="#c8d3dd"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {points.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--rausch)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.85"
            style={{ transition: "d 320ms ease" }}
          />
        )}

        {points.map((p, i) => (
          <g
            key={i}
            className="plan-map-pin"
            style={{
              transform: `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`,
            }}
          >
            <circle cx="0" cy="14" r="6" fill="#000" opacity="0.12" />
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="var(--rausch)"
              stroke="#fff"
              strokeWidth="3"
            />
            <text
              x="0"
              y="5"
              fill="#fff"
              fontSize="14"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      {dayLabel && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(4px)",
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid var(--hairline-soft)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: 0.2,
          }}
        >
          {dayLabel}
        </div>
      )}
    </div>
  )
}
