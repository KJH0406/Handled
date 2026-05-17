"use client"

import { useState } from "react"

const COLORS = [
  "#ff385c",
  "#0891B2",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EC4899",
]

export default function Avatar({ src, alt, size = 48, name = "?" }) {
  const [err, setErr] = useState(false)
  const initial = (name || "?").slice(0, 1).toUpperCase()
  const colorIdx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    COLORS.length
  const showFallback = err || !src
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "var(--surface-strong)",
        flexShrink: 0,
      }}
    >
      {showFallback ? (
        <div
          className="avatar-fallback"
          style={{ background: COLORS[colorIdx], fontSize: size * 0.42 }}
        >
          {initial}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setErr(true)}
        />
      )}
    </div>
  )
}
