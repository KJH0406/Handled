"use client"

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import ExperienceCard from "../components/cards/ExperienceCard"
import FilterRow from "../components/ui/FilterRow"
import Icon from "../components/ui/Icon"
import { EXP_CATEGORIES } from "../lib/data/experiences"
import { CITIES } from "../lib/data/filters"
import { useDebounce } from "../lib/hooks/useDebounce"
import { experiencesRepo } from "../lib/repositories/experiences"

export default function ExperiencesScreen() {
  const t = useTranslations("experiences")
  const searchParams = useSearchParams()
  const initialCity = searchParams.get("city") ?? undefined
  const initialCategory = searchParams.get("category") ?? undefined
  const initialQuery = searchParams.get("q") ?? undefined
  const [city, setCity] = useState<string>(initialCity ?? "All")
  const [category, setCategory] = useState<string>(initialCategory ?? "All")
  const [q, setQ] = useState<string>(initialQuery ?? "")
  const debouncedQ = useDebounce(q, 200)

  const filtered = useMemo(
    () => experiencesRepo.list({ city, category, query: debouncedQ }),
    [city, category, debouncedQ],
  )

  const reset = () => {
    setCity("All")
    setCategory("All")
    setQ("")
  }

  const totalCount = experiencesRepo.list().length

  const resultText = () => {
    if (city !== "All" && category !== "All") {
      return t("resultsInCityAndCategory", {
        count: filtered.length,
        city,
        category,
      })
    }
    if (city !== "All") {
      return t("resultsInCity", { count: filtered.length, city })
    }
    if (category !== "All") {
      return t("resultsInCategory", { count: filtered.length, category })
    }
    return t("results", { count: filtered.length })
  }

  return (
    <main className="fade-in">
      <section className="page-intro">
        <div className="container">
          <div className="page-intro-kicker">
            <Icon name="map" size={14} stroke="var(--on-primary)" sw={1.5} />
            {t("kicker")}
          </div>
          <h1
            className="t-display-xl ink"
            style={{ marginBottom: 12, maxWidth: 720 }}
          >
            {t("title")}
          </h1>
          <p
            className="t-body-md muted"
            style={{ maxWidth: 560, marginBottom: 0 }}
          >
            {t("lede", { count: totalCount })}
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 0 64px" }}>
        <div className="container">
          <div className="listing-toolbar">
            <div className="listing-toolbar-search">
              <Icon name="search" size={16} stroke="var(--muted)" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="icon-btn"
                  aria-label={t("clearSearchAria")}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
            <div className="listing-toolbar-filters">
              <FilterRow
                label={t("filters.city")}
                options={CITIES}
                value={city}
                onChange={setCity}
              />
              <FilterRow
                label={t("filters.category")}
                options={EXP_CATEGORIES}
                value={category}
                onChange={setCategory}
              />
            </div>
          </div>

          <div
            className="section-header"
            style={{ marginTop: 32, marginBottom: 24 }}
          >
            <span className="t-body-sm muted">{resultText()}</span>
            {(city !== "All" || category !== "All" || q) && (
              <button
                className="btn-tertiary t-body-sm"
                onClick={reset}
                style={{ textDecoration: "underline" }}
              >
                {t("clearFilters")}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <Icon name="search" size={40} stroke="var(--muted-soft)" />
              <div className="t-display-sm ink" style={{ marginTop: 16 }}>
                {t("empty.title")}
              </div>
              <p className="t-body-sm muted" style={{ marginTop: 8 }}>
                {t("empty.subtitle")}
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: 24 }}
                onClick={reset}
              >
                <Icon name="refresh" size={16} /> {t("empty.cta")}
              </button>
            </div>
          ) : (
            <div className="exp-grid">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} showGuide />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
