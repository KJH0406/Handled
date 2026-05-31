"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { categoryColor } from "../../lib/data/categoryColors"
import { usd } from "../../lib/format"
import { guidesRepo } from "../../lib/repositories/guides"
import type { Experience } from "../../lib/types/domain"
import Avatar from "../ui/Avatar"
import Icon from "../ui/Icon"
import ExpPhoto from "./ExpPhoto"

export interface ExperienceCardProps {
  exp: Experience
  showGuide?: boolean
  comingSoon?: boolean
}

export default function ExperienceCard({
  exp,
  showGuide = false,
  comingSoon = false,
}: ExperienceCardProps) {
  const t = useTranslations("cards.experience")
  const tHome = useTranslations("home.featured")
  const guide = showGuide ? guidesRepo.findById(exp.guideId) : null
  return (
    <Link
      href={`/experiences/${exp.id}`}
      className={`exp-card${comingSoon ? " exp-card--coming-soon" : ""}`}
    >
      <div className="exp-card-photo">
        <ExpPhoto src={exp.photo} alt={exp.title} category={exp.category} />
        <span
          className="exp-card-cat badge-pill"
          style={{
            background: categoryColor(exp.category).solid,
            color: "var(--on-primary)",
          }}
        >
          {exp.category}
        </span>
        {comingSoon && (
          <span className="exp-card-coming-badge">
            {tHome("comingSoonBadge")}
          </span>
        )}
      </div>
      <div className="exp-card-body">
        <div className="t-title-md ink" style={{ minHeight: 40 }}>
          {exp.title}
        </div>
        <div className="exp-card-meta t-caption-sm">
          <Icon name="clock" size={13} stroke="var(--muted)" />
          <span>{t("duration", { hours: exp.duration })}</span>
          <span>·</span>
          <Icon name="users" size={13} stroke="var(--muted)" />
          <span>{t("upTo", { max: exp.maxGuests })}</span>
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
              {t("hostedBy", { city: guide.city, name: guide.name })}
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
            <div className="t-caption-sm muted">{t("perPerson")}</div>
          </div>
          <span
            className="t-caption"
            style={{ color: "var(--primary)", fontWeight: 600 }}
          >
            {t("learnMore")}
          </span>
        </div>
      </div>
    </Link>
  )
}
