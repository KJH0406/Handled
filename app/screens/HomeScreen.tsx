"use client"

import { useTranslations } from "next-intl"
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
        <div className="container">
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255, 56, 92, 0.1)",
                color: "var(--rausch)",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <Icon
                name="sparkles"
                size={14}
                fill="currentColor"
                stroke="currentColor"
                sw={1.5}
              />
              {t("hero.kicker")}
            </div>
            <h1 className="t-display-xl ink" style={{ marginBottom: 20 }}>
              {t("hero.titleLine1")}
              <br />
              <span style={{ color: "var(--rausch)" }}>
                {t("hero.titleLine2")}
              </span>
            </h1>
            <p
              className="t-body-md muted"
              style={{
                maxWidth: 560,
                margin: "0 auto 40px",
                fontSize: 17,
              }}
            >
              {t("hero.lede")}
            </p>
            <button
              className="btn btn-primary"
              onClick={onPlan}
              style={{
                height: 60,
                padding: "0 36px",
                fontSize: 17,
                borderRadius: 999,
                minWidth: 280,
              }}
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
