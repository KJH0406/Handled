"use client"

import { useMemo, useState } from "react"
import Icon from "../components/ui/Icon"
import FilterRow from "../components/ui/FilterRow"
import GuideCard from "../components/cards/GuideCard"
import { guidesRepo } from "../lib/repositories/guides"
import { CITIES, STYLES, LANGUAGES } from "../lib/data/filters"

export default function ListScreen({ navigate, initialCity, initialQuery }) {
  const [city, setCity] = useState(initialCity || "All")
  const [style, setStyle] = useState("All")
  const [lang, setLang] = useState("All")
  const [q, setQ] = useState(initialQuery || "")

  const filtered = useMemo(
    () => guidesRepo.list({ city, style, language: lang, query: q }),
    [city, style, lang, q],
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
            Find a local guide
          </h1>
          <p className="t-body-sm muted" style={{ marginBottom: 24 }}>
            Match with vetted local guides by the hour. From $40 / hour.
          </p>

          {/* Search */}
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
              placeholder="Search by name, city, or style"
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
                aria-label="Clear search"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>

          {/* Filter rows */}
          <FilterRow
            label="City"
            options={CITIES}
            value={city}
            onChange={setCity}
          />
          <FilterRow
            label="Style"
            options={STYLES}
            value={style}
            onChange={setStyle}
          />
          <FilterRow
            label="Languages"
            options={LANGUAGES}
            value={lang}
            onChange={setLang}
          />
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: "32px 0 64px" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <span className="t-body-sm muted">
              {filtered.length} {filtered.length === 1 ? "guide" : "guides"}{" "}
              match
              {city !== "All" ? ` · ${city}` : ""}
            </span>
            {(city !== "All" || style !== "All" || lang !== "All" || q) && (
              <button
                className="btn-tertiary t-body-sm"
                onClick={reset}
                style={{ textDecoration: "underline" }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <Icon name="search" size={40} stroke="var(--muted-soft)" />
              <div className="t-display-sm ink" style={{ marginTop: 16 }}>
                No guides match
              </div>
              <p className="t-body-sm muted" style={{ marginTop: 8 }}>
                Try fewer filters.
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: 24 }}
                onClick={reset}
              >
                <Icon name="refresh" size={16} /> Clear filters
              </button>
            </div>
          ) : (
            <div className="guide-grid">
              {filtered.map((g) => (
                <GuideCard
                  key={g.id}
                  guide={g}
                  onClick={() => navigate("profile", { guideId: g.id })}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
