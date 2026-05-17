"use client"

import Link from "next/link"
import { usd } from "../../lib/format"
import { guidesRepo } from "../../lib/repositories/guides"
import type { Experience } from "../../lib/types/domain"
import Avatar from "../ui/Avatar"
import Icon from "../ui/Icon"
import ExpPhoto from "./ExpPhoto"

export interface ExperienceCardProps {
  exp: Experience
  showGuide?: boolean
}

export default function ExperienceCard({
  exp,
  showGuide = false,
}: ExperienceCardProps) {
  const guide = showGuide ? guidesRepo.findById(exp.guideId) : null
  return (
    <Link href={`/experiences/${exp.id}`} className="exp-card">
      <div className="exp-card-photo">
        <ExpPhoto src={exp.photo} alt={exp.title} category={exp.category} />
        <span className="exp-card-cat badge-pill">{exp.category}</span>
      </div>
      <div className="exp-card-body">
        <div className="t-title-md ink" style={{ minHeight: 40 }}>
          {exp.title}
        </div>
        <div className="exp-card-meta t-caption-sm">
          <Icon name="clock" size={13} stroke="var(--muted)" />
          <span>{exp.duration} hours</span>
          <span>·</span>
          <Icon name="users" size={13} stroke="var(--muted)" />
          <span>Up to {exp.maxGuests}</span>
        </div>
        <p
          className="t-body-sm muted"
          style={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: 40,
          }}
        >
          {exp.summary}
        </p>
        {guide && (
          <div className="row row-gap-xs" style={{ marginTop: 4 }}>
            <Avatar
              src={guide.photo}
              alt={guide.name}
              name={guide.name}
              size={20}
            />
            <span className="t-caption-sm muted">
              {guide.city} · Hosted by {guide.name}
            </span>
          </div>
        )}
        <div
          className="row between"
          style={{
            marginTop: 8,
            paddingTop: 12,
            borderTop: "1px solid var(--hairline-soft)",
          }}
        >
          <div>
            <div className="t-title-md ink">{usd(exp.price)}</div>
            <div className="t-caption-sm muted">Per person</div>
          </div>
          <span
            className="t-caption"
            style={{ color: "var(--rausch)", fontWeight: 600 }}
          >
            Learn more →
          </span>
        </div>
      </div>
    </Link>
  )
}
