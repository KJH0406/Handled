"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import mapImg from "@/img/guides/map.png"
import { Link } from "../../i18n/navigation"
import ExperienceCard from "../components/cards/ExperienceCard"
import Icon, { type IconName } from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { storiesRepo } from "../lib/repositories/stories"

/** Deterministic pseudo view-count per story, formatted like "8K+" / "2.2M+". */
const formatViews = (id: string): string => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  const n = 40_000 + (h % 2_600_000)
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M+`
    : `${Math.round(n / 1000)}K+`
}

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

const STATS_KEYS = [
  "travelersHosted",
  "licensedGuides",
  "avgRating",
  "koreanCities",
] as const

const PLANNER_STEPS = ["one", "two", "three"] as const

interface ValueProp {
  key: "licensed" | "themed" | "stories"
  icon: IconName
  accentClass: string
}

const VALUE_PROPS: ValueProp[] = [
  { key: "licensed", icon: "shield", accentClass: "value-prop-card--accent-1" },
  { key: "themed", icon: "map", accentClass: "value-prop-card--accent-2" },
  {
    key: "stories",
    icon: "sparkles",
    accentClass: "value-prop-card--accent-3",
  },
]

const VALUE_PROP_ICON_COLORS: Record<ValueProp["accentClass"], string> = {
  "value-prop-card--accent-1": "var(--primary)",
  "value-prop-card--accent-2": "var(--coral)",
  "value-prop-card--accent-3": "var(--gold)",
}

export default function HomeScreen() {
  const t = useTranslations("home")
  const navigate = useAppNavigate()
  const featured = experiencesRepo.featured(3)
  const stories = storiesRepo.list()

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
              <span style={{ color: "var(--primary)" }}>
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
                <Icon
                  name="heart"
                  size={22}
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  sw={1.5}
                />
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
                <Icon name="map" size={22} stroke="var(--primary)" />
              </div>
              <div className="t-display-sm ink hero-mock-plan-title">
                {t("hero.mock.planTitlePrefix")}
                <span style={{ color: "var(--primary)" }}>
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

      <section className="home-stats" aria-label={t("featured.heading")}>
        <div className="container home-stats-row">
          {STATS_KEYS.map((k) => (
            <div key={k} className="home-stats-item">
              <div className="home-stats-value">{t(`stats.${k}.value`)}</div>
              <div className="home-stats-label">{t(`stats.${k}.label`)}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "68px 0" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <h2 className="t-display-md ink">{t("featured.heading")}</h2>
              <p className="t-body-sm muted" style={{ marginTop: 6 }}>
                {t("featured.subtitle")}
              </p>
            </div>
            <div className="section-header-actions">
              <span className="badge-launching">
                {t("featured.launchingSoon")}
              </span>
              <button
                className="btn-tertiary t-body-sm"
                style={{ textDecoration: "underline" }}
                onClick={() => navigate("experiences")}
              >
                {t("featured.viewAll")}
              </button>
            </div>
          </div>
          <div className="exp-grid">
            {featured.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                showGuide
                comingSoon
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-stories">
        <div className="container">
          <div className="home-stories-head">
            <h2 className="home-stories-heading">{t("stories.heading")}</h2>
          </div>
          <div className="home-stories-grid">
            {stories.map((s) => (
              <Link
                key={s.id}
                href={`/stories/${s.id}`}
                className="home-story-card"
              >
                <div
                  className="home-story-thumb"
                  style={{ background: s.bg }}
                  aria-hidden
                />
                <div className="home-story-meta">
                  <span className="home-story-cat">{s.category}</span>
                  <span className="home-story-views">
                    <Icon name="eye" size={13} /> {formatViews(s.id)}
                  </span>
                </div>
                <h3 className="home-story-title">{s.title}</h3>
                <p className="home-story-summary">{s.summary}</p>
              </Link>
            ))}
          </div>
          <div className="home-stories-foot">
            <Link href="/stories" className="home-stories-all">
              {t("stories.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      <section className="planner-cta">
        <div className="container planner-cta-grid">
          <div>
            <span className="planner-cta-eyebrow">
              {t("plannerCta.eyebrow")}
            </span>
            <h2 className="planner-cta-title">
              {t("plannerCta.titleLine1")}
              <br />
              {t("plannerCta.titleLine2")}
            </h2>
            <p className="planner-cta-lede">{t("plannerCta.lede")}</p>
            <button className="btn btn-primary" onClick={onPlan}>
              {t("plannerCta.cta")}
            </button>
          </div>
          <div className="planner-cta-card">
            {PLANNER_STEPS.map((s) => (
              <div key={s} className="planner-step-row">
                <div className="planner-step-num">
                  {t(`plannerCta.steps.${s}.n`)}
                </div>
                <div>
                  <div className="planner-step-title">
                    {t(`plannerCta.steps.${s}.title`)}
                  </div>
                  <div className="planner-step-desc">
                    {t(`plannerCta.steps.${s}.desc`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="real-korea">
        <div className="container">
          <div className="real-korea-head">
            <h2 className="real-korea-heading">{t("realKorea.heading")}</h2>
            <p className="real-korea-sub">{t("realKorea.subheading")}</p>
          </div>
          <div className="real-korea-grid">
            {VALUE_PROPS.map((vp) => (
              <div
                key={vp.key}
                className={`value-prop-card ${vp.accentClass}`}
              >
                <div className="value-prop-icon">
                  <Icon
                    name={vp.icon}
                    size={22}
                    stroke={VALUE_PROP_ICON_COLORS[vp.accentClass]}
                  />
                </div>
                <div className="value-prop-title">
                  {t(`realKorea.items.${vp.key}.title`)}
                </div>
                <div className="value-prop-desc">
                  {t(`realKorea.items.${vp.key}.desc`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
