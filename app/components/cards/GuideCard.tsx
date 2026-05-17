"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usd } from "../../lib/format"
import type { Guide } from "../../lib/types/domain"
import Heart from "../ui/Heart"
import Icon from "../ui/Icon"
import Stars from "../ui/Stars"

export interface GuideCardProps {
  guide: Guide
}

export default function GuideCard({ guide }: GuideCardProps) {
  const t = useTranslations("cards.guide")
  const [saved, setSaved] = useState(false)
  return (
    <article className="guide-card">
      <div className="guide-card-photo">
        <Image
          src={guide.photo}
          alt=""
          fill
          sizes="(max-width: 744px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        {guide.superhost && (
          <span className="superhost-badge badge-pill">
            <Icon name="award" size={11} /> {t("superhost")}
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
          <span className="t-body-sm muted">{t("perHour")}</span>
        </div>
      </div>
      <Link
        href={`/guides/${guide.id}`}
        className="card-stretched-link"
        aria-label={t("aria", { name: guide.name, city: guide.city })}
      />
    </article>
  )
}
