"use client"

import Image from "next/image"
import { useState } from "react"
import { usd } from "../../lib/format"
import type { Guide } from "../../lib/types/domain"
import Heart from "../ui/Heart"
import Icon from "../ui/Icon"
import Stars from "../ui/Stars"

export interface GuideCardProps {
  guide: Guide
  onClick?: () => void
}

export default function GuideCard({ guide, onClick }: GuideCardProps) {
  const [saved, setSaved] = useState(false)
  return (
    <div className="guide-card" onClick={onClick}>
      <div className="guide-card-photo">
        <Image
          src={guide.photo}
          alt={guide.name}
          fill
          sizes="(max-width: 744px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        {guide.superhost && (
          <span className="superhost-badge badge-pill">
            <Icon name="award" size={11} /> Superhost
          </span>
        )}
        <Heart filled={saved} onClick={() => setSaved(!saved)} />
      </div>
      <div className="guide-card-meta">
        <div className="row between" style={{ marginBottom: 4 }}>
          <span className="t-title-md ink">
            {guide.city} · {guide.name}
          </span>
          <Stars rating={guide.rating} />
        </div>
        <div className="t-body-sm muted" style={{ marginBottom: 4 }}>
          {guide.district}
        </div>
        <div
          className="t-body-sm muted"
          style={{ marginBottom: 8, height: 40, overflow: "hidden" }}
        >
          {guide.oneLiner}
        </div>
        <div className="row" style={{ gap: 4 }}>
          <span className="t-body-sm ink" style={{ fontWeight: 600 }}>
            {usd(guide.hourlyRate)}
          </span>
          <span className="t-body-sm muted">/ hour</span>
        </div>
      </div>
    </div>
  )
}
