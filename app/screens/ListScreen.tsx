"use client"

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import GuideCard from "../components/cards/GuideCard"
import FilterRow from "../components/ui/FilterRow"
import Icon from "../components/ui/Icon"
import { CITIES, LANGUAGES, STYLES } from "../lib/data/filters"
import { useDebounce } from "../lib/hooks/useDebounce"
import { guidesRepo } from "../lib/repositories/guides"

export default function ListScreen() {
  const t = useTranslations("list")
  const searchParams = useSearchParams()
  const initialCity = searchParams.get("city") ?? undefined
  const initialQuery = searchParams.get("q") ?? undefined
  const [city, setCity] = useState<string>(initialCity ?? "All")
  const [style, setStyle] = useState<string>("All")
  const [lang, setLang] = useState<string>("All")
  const [q, setQ] = useState<string>(initialQuery ?? "")
  const debouncedQ = useDebounce(q, 200)

  const filtered = useMemo(
    () => guidesRepo.list({ city, style, language: lang, query: debouncedQ }),
    [city, style, lang, debouncedQ],
  )

  const reset = () => {
    setCity("All")
    setStyle("All")
    setLang("All")
    setQ("")
  }

  return (
    <main className="fade-in">
      <section
        style={{
          padding: "32px 0 24px",
          borderBottom: "1px solid var(--hairline-soft)",
        }}
      >
        <div className="container">
          <h1 className="t-display-md ink" style={{ marginBottom: 4 }}>
            {t("title")}
          </h1>
          <p className="t-body-sm muted" style={{ marginBottom: 24 }}>
            {t("lede")}
          </p>

          <div
            className="row row-gap-sm"
            style={{
              background: "var(--canvas)",
              border: "1px solid var(--hairline)",
              borderRadius: 999,
              padding: "8px 8px 8px 20px",
              maxWidth: 560,
            }}
          >
            <Icon name="search" size={16} stroke="var(--muted)" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 14,
              }}
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

          <FilterRow
            label={t("filters.city")}
            options={CITIES}
            value={city}
            onChange={setCity}
          />
          <FilterRow
            label={t("filters.style")}
            options={STYLES}
            value={style}
            onChange={setStyle}
          />
          <FilterRow
            label={t("filters.languages")}
            options={LANGUAGES}
            value={lang}
            onChange={setLang}
          />
        </div>
      </section>

      <section style={{ padding: "32px 0 64px" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <span className="t-body-sm muted">
              {city !== "All"
                ? t("resultsInCity", { count: filtered.length, city })
                : t("results", { count: filtered.length })}
            </span>
            {(city !== "All" || style !== "All" || lang !== "All" || q) && (
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
            <div className="guide-grid">
              {filtered.map((g) => (
                <GuideCard key={g.id} guide={g} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
