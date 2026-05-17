"use client"

import { useState } from "react"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import Avatar from "../components/ui/Avatar"
import ExperienceCard from "../components/cards/ExperienceCard"
import { EXPERIENCES } from "../lib/data/experiences"
import { HOME_REVIEWS } from "../lib/data/reviews"

const QUICK_CITIES = ["Seoul", "Busan", "Jeju", "Incheon"]

const WHY_FEATURES = [
  {
    icon: "sparkles",
    title: "Curated experiences",
    desc: "Every package is designed and tested by a vetted local — no generic tour-bus stops.",
  },
  {
    icon: "users",
    title: "Small groups",
    desc: "Up to 4–8 guests so you actually get to ask questions and stop where you want.",
  },
  {
    icon: "globe",
    title: "Multilingual hosts",
    desc: "English, Japanese, Mandarin, French. Book in the language you are most comfortable in.",
  },
]

export default function HomeScreen({ navigate }) {
  const [where, setWhere] = useState("")
  const featured = EXPERIENCES.slice(0, 3)

  const onSearch = () => navigate("experiences", { initialQuery: where })

  return (
    <main className="fade-in">
      {/* Hero */}
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
              Korea, made local —
              <br />
              <span style={{ color: "var(--rausch)" }}>
                experiences hosted by people you trust.
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
              Discover handpicked Korean experiences, hosted by vetted locals.
            </p>
          </div>

          {/* Search pill — desktop */}
          <div className="search-pill">
            <div className="search-segment">
              <div className="seg-label">Where</div>
              <input
                placeholder="Anywhere in Korea?"
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
              <div className="seg-label">When</div>
              <div className="seg-value">Add dates</div>
            </div>
            <div className="search-segment">
              <div className="seg-label">Who</div>
              <div className="seg-value">Add guests</div>
            </div>
            <button
              className="search-orb"
              onClick={onSearch}
              aria-label="Search"
            >
              <Icon name="search" size={18} stroke="white" sw={2.5} />
            </button>
          </div>

          {/* Search pill — mobile */}
          <div className="search-pill-mobile">
            <Icon name="search" size={18} stroke="var(--muted)" />
            <input
              placeholder="Where in Korea?"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
            <button
              className="search-orb"
              onClick={onSearch}
              aria-label="Search"
              style={{ width: 36, height: 36 }}
            >
              <Icon name="arrowRight" size={16} stroke="white" sw={2.5} />
            </button>
          </div>

          {/* Quick city chips */}
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

      {/* Why Handled */}
      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div className="feature-grid">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="card card-pad-lg"
                style={{ border: "none" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "#fff0f3",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon name={f.icon} size={22} stroke="var(--rausch)" />
                </div>
                <div
                  className="t-display-sm ink"
                  style={{ marginBottom: 8 }}
                >
                  {f.title}
                </div>
                <div className="t-body-sm muted">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured experiences */}
      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2 className="t-display-md ink">Top experiences this week</h2>
            <button
              className="btn-tertiary t-body-sm"
              style={{ textDecoration: "underline" }}
              onClick={() => navigate("experiences")}
            >
              View all experiences
            </button>
          </div>
          <div className="exp-grid">
            {featured.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                showGuide
                onPick={() => navigate("experience", { expId: exp.id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
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
            <span className="t-rating ink">4.96</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="t-display-sm ink">Loved by travelers</div>
              <div className="t-body-sm muted">
                Rated by 500+ travelers who explored Korea with Handled
              </div>
            </div>
          </div>
          <div className="review-grid">
            {HOME_REVIEWS.map((r, i) => (
              <div key={i} className="stack-sm">
                <div className="row row-gap-sm">
                  <Avatar size={36} name={r.name} src="" />
                  <div>
                    <div className="t-title-sm ink">{r.name}</div>
                    <div className="t-caption-sm muted">{r.country}</div>
                  </div>
                </div>
                <Stars rating={r.rating} />
                <div className="t-body-sm body">"{r.text}"</div>
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
