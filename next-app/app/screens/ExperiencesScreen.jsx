"use client"

import { useMemo, useState } from "react"
import Icon from "../components/ui/Icon"
import FilterRow from "../components/ui/FilterRow"
import ExperienceCard from "../components/cards/ExperienceCard"
import { EXP_CATEGORIES } from "../lib/data/experiences"
import { experiencesRepo } from "../lib/repositories/experiences"
import { CITIES } from "../lib/data/filters"

export default function ExperiencesScreen({
  navigate,
  initialCity,
  initialCategory,
  initialQuery,
}) {
  const [city, setCity] = useState(initialCity || "All")
  const [category, setCategory] = useState(initialCategory || "All")
  const [q, setQ] = useState(initialQuery || "")

  const filtered = useMemo(
    () => experiencesRepo.list({ city, category, query: q }),
    [city, category, q],
  )

  const reset = () => {
    setCity("All")
    setCategory("All")
    setQ("")
  }

  return (
    <main className="fade-in">
      {/* header */}
      <section
        style={{
          padding: "32px 0 24px",
          borderBottom: "1px solid var(--hairline-soft)",
        }}
      >
        <div className="container">
          <h1 className="t-display-md ink" style={{ marginBottom: 4 }}>
            All Korean experiences
          </h1>
          <p className="t-body-sm muted" style={{ marginBottom: 24 }}>
            Pick from {experiencesRepo.list().length} experience packages hosted by local
            guides.
          </p>

          {/* search */}
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
              placeholder="Search by experience, category, guide, or city"
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

          {/* filters */}
          <FilterRow
            label="City"
            options={CITIES}
            value={city}
            onChange={setCity}
          />
          <FilterRow
            label="Category"
            options={EXP_CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        </div>
      </section>

      {/* results */}
      <section style={{ padding: "32px 0 64px" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <span className="t-body-sm muted">
              {filtered.length}{" "}
              {filtered.length === 1 ? "experience" : "experiences"} match
              {city !== "All" ? ` · ${city}` : ""}
              {category !== "All" ? ` · ${category}` : ""}
            </span>
            {(city !== "All" || category !== "All" || q) && (
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
                No experiences match
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
            <div className="exp-grid">
              {filtered.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  showGuide
                  onPick={() => navigate("experience", { expId: exp.id })}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
