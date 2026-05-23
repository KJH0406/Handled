"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import mapImg from "@/img/guides/map.png"
import ExperienceCard from "../components/cards/ExperienceCard"
import Avatar from "../components/ui/Avatar"
import Icon, { type IconName } from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { reviewsRepo } from "../lib/repositories/reviews"

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

interface HeroChip {
  label: string
  active: boolean
}

const HERO_INTEREST_CHIPS: HeroChip[] = [
  { label: "Food", active: true },
  { label: "Culture", active: true },
  { label: "Photo", active: true },
  { label: "Nature", active: false },
  { label: "Art", active: false },
  { label: "Urban", active: false },
  { label: "Beach", active: false },
  { label: "Nightlife", active: false },
]

export default function HomeScreen() {
  const t = useTranslations("home")
  const navigate = useAppNavigate()
  const featured = experiencesRepo.featured(3)

  const onPlan = () => {
    navigate("planNew")
  }

  return (
    <main className="fade-in">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">
              <Icon
                name="sparkles"
                size={14}
                fill="currentColor"
                stroke="currentColor"
                sw={1.5}
              />
              {t("hero.kicker")}
            </div>
            <h1 className="t-display-xl ink hero-title">
              {t("hero.titleLine1")}
              <br />
              <span style={{ color: "var(--rausch)" }}>
                {t("hero.titleLine2")}
              </span>
            </h1>
            <p className="t-body-md muted hero-lede">{t("hero.lede")}</p>
            <button
              className="btn btn-primary hero-cta"
              onClick={onPlan}
            >
              <Icon
                name="sparkles"
                size={18}
                stroke="white"
                fill="white"
                sw={1.5}
              />
              {t("hero.planCta")}
            </button>
          </div>

          <div className="hero-mock" aria-hidden="true">
            <div className="hero-mock-card hero-mock-card--interests">
              <div className="hero-mock-icon">
                <Icon name="sparkles" size={22} stroke="var(--rausch)" />
              </div>
              <div className="t-display-sm ink hero-mock-title">
                {t("hero.mock.interestsTitle")}
              </div>
              <div className="t-caption-sm muted hero-mock-hint">
                {t("hero.mock.interestsHint")}
              </div>
              <div className="hero-mock-chips">
                {HERO_INTEREST_CHIPS.map((c) => (
                  <span
                    key={c.label}
                    className={`chip ${c.active ? "active" : ""}`}
                  >
                    {c.active && <Icon name="check" size={12} />}
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-mock-card hero-mock-card--plan">
              <div className="hero-mock-icon">
                <Icon name="map" size={22} stroke="var(--rausch)" />
              </div>
              <div className="t-display-sm ink hero-mock-plan-title">
                {t("hero.mock.planTitlePrefix")}
                <span style={{ color: "var(--rausch)" }}>
                  {t("hero.mock.planTitleHighlight")}
                </span>
                {t("hero.mock.planTitleSuffix")}
              </div>
              <div className="t-caption-sm muted hero-mock-plan-hint">
                {t("hero.mock.planHint")}
              </div>
              <div className="hero-mock-plan-map">
                <Image
                  src={mapImg}
                  alt=""
                  sizes="308px"
                  placeholder="blur"
                />
              </div>
            </div>

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
