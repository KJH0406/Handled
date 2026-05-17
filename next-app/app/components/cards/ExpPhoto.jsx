"use client"

import { useState } from "react"
import Image from "next/image"
import { CAT_FALLBACK } from "../../lib/data/categories"

const DEFAULT_FALLBACK = {
  emoji: "✨",
  bg: "linear-gradient(135deg, #ff385c, #ffa07a)",
}

export default function ExpPhoto({ src, alt, category }) {
  const [err, setErr] = useState(false)
  const fb = CAT_FALLBACK[category] || DEFAULT_FALLBACK
  return err ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: fb.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
      }}
      aria-label={alt}
    >
      {fb.emoji}
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 744px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: "cover" }}
      onError={() => setErr(true)}
    />
  )
}
