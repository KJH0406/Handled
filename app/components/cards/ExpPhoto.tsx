"use client"

import Image from "next/image"
import { useState } from "react"
import { CAT_FALLBACK } from "../../lib/data/categories"
import type {
  CategoryFallback,
  ExperienceCategory,
} from "../../lib/types/domain"

const DEFAULT_FALLBACK: CategoryFallback = {
  emoji: "✨",
  bg: "linear-gradient(135deg, #0f4c81, #ea6863)",
}

export interface ExpPhotoProps {
  src: string
  alt: string
  category: ExperienceCategory
}

export default function ExpPhoto({ src, alt, category }: ExpPhotoProps) {
  const [err, setErr] = useState(false)
  const fb: CategoryFallback = CAT_FALLBACK[category] ?? DEFAULT_FALLBACK
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
