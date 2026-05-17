"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import ExperienceCard from "../components/cards/ExperienceCard"
import Avatar from "../components/ui/Avatar"
import Icon, { type IconName } from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { reviewsRepo } from "../lib/repositories/reviews"

const QUICK_CITIES = ["Seoul", "Busan", "Jeju", "Incheon"] as const

interface WhyFeature {
  icon: IconName
  titleKey: "curatedTitle" | "smallGroupTitle" | "multilingualTitle"
  descKey: "curatedDesc" | "smallGroupDesc" | "multilingualDesc"
}

const WHY_FEATURES: WhyFeature[] = [
  { icon: "sparkles", titleKey: "curatedTitle", descKey: "curatedDesc" },
  { icon: "users", titleKey: "smallGroupTitle", descKey: "smallGroupDesc" },
  {
    icon: "globe",
    titleKey: "multilingualTitle",
    descKey: "multilingualDesc",
  },
]

export default function HomeScreen() {
  const t = useTranslations("home")
  const tNav = useTranslations("nav")
  const navigate = useAppNavigate()
  const [where, setWhere] = useState("")
  const featured = experiencesRepo.featured(3)

  const onSearch = () => navigate("experiences", { initialQuery: where })

  return (
    <main className="fade-in">
      <section className="hero">
        <div className="container">
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h1 className="t-display-xl ink" style={{ marginBottom: 16 }}>
              {t("hero.titleLine1")}
              <br />
              <span style={{ color: "var(--rausch)" }}>
                {t("hero.titleLine2")}
              </span>
            </h1>
            <p
              className="t-body-md muted"
              style={{
                maxWidth: 540,
                margin: "0 auto 36px",
                fontSize: 17,
              }}
            >
              {t("hero.lede")}
            </p>
          </div>

          <div className="search-pill">
            <div className="search-segment">
              <div className="seg-label">{t("search.where")}</div>
              <input
                placeholder={t("search.wherePlaceholder")}
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 14,
                  color: "var(--ink)",
                  padding: 0,
                }}
              />
            </div>
            <div className="search-segment">
              <div className="seg-label">{t("search.when")}</div>
              <div className="seg-value">{t("search.addDates")}</div>
            </div>
            <div className="search-segment">
              <div className="seg-label">{t("search.who")}</div>
              <div className="seg-value">{t("search.addGuests")}</div>
            </div>
            <button
              className="search-orb"
              onClick={onSearch}
              aria-label={tNav("searchAria")}
            >
              <Icon name="search" size={18} stroke="white" sw={2.5} />
            </button>
          </div>

          <div className="search-pill-mobile">
            <Icon name="search" size={18} stroke="var(--muted)" />
            <input
              placeholder={t("search.whereMobilePlaceholder")}
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
            <button
              className="search-orb"
              onClick={onSearch}
              aria-label={tNav("searchAria")}
              style={{ width: 36, height: 36 }}
            >
              <Icon name="arrowRight" size={16} stroke="white" sw={2.5} />
            </button>
          </div>

          <div
            className="row center"
            style={{ gap: 8, flexWrap: "wrap", marginTop: 24 }}
          >
            {QUICK_CITIES.map((c) => (
              <button
                key={c}
                className="chip"
                onClick={() => navigate("experiences", { initialCity: c })}
              >
                <Icon name="pin" size={14} />
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div className="feature-grid">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.titleKey}
                className="card card-pad-lg"
                style={{ border: "none" }}
              >
                <div className="icon-circle icon-circle--lg mb-base">
                  <Icon name={f.icon} size={22} stroke="var(--rausch)" />
                </div>
                <div className="t-display-sm ink mb-sm">
                  {t(`why.${f.titleKey}`)}
                </div>
                <div className="t-body-sm muted">{t(`why.${f.descKey}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2 className="t-display-md ink">{t("featured.heading")}</h2>
            <button
              className="btn-tertiary t-body-sm"
              style={{ textDecoration: "underline" }}
              onClick={() => navigate("experiences")}
            >
              {t("featured.viewAll")}
            </button>
          </div>
          <div className="exp-grid">
            {featured.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} showGuide />
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "64px 0",
          background: "var(--surface-soft)",
          marginTop: 32,
        }}
      >
        <div className="container">
          <div
            className="row"
            style={{ gap: 16, marginBottom: 32, flexWrap: "wrap" }}
          >
            <span className="t-rating ink">{t("loved.rating")}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="t-display-sm ink">{t("loved.heading")}</div>
              <div className="t-body-sm muted">{t("loved.subtitle")}</div>
            </div>
          </div>
          <div className="review-grid">
            {reviewsRepo.listHome().map((r, i) => (
              <div key={i} className="stack-sm">
                <div className="row row-gap-sm">
                  <Avatar size={36} name={r.name} src="" />
                  <div>
                    <div className="t-title-sm ink">{r.name}</div>
                    <div className="t-caption-sm muted">{r.country}</div>
                  </div>
                </div>
                <Stars rating={r.rating} />
                <div className="t-body-sm body">&quot;{r.text}&quot;</div>
                <div className="t-caption-sm muted-soft">
                  {r.date} · {r.guide}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
