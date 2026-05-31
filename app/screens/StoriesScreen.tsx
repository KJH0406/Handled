"use client"

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Link } from "../../i18n/navigation"
import Icon from "../components/ui/Icon"
import { categoryColor } from "../lib/data/categoryColors"
import { STORY_CATEGORIES } from "../lib/data/stories"
import { storiesRepo } from "../lib/repositories/stories"
import type { Story } from "../lib/types/domain"

export default function StoriesScreen() {
  const t = useTranslations("stories")
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? "All"
  const [category, setCategory] = useState<string>(initialCategory)

  const featured = useMemo(() => storiesRepo.featured(), [])
  const latest = useMemo(() => storiesRepo.latest(3, featured?.id), [featured])
  const grid = useMemo(
    () =>
      storiesRepo
        .list({ category })
        .filter((s) => !(featured && s.id === featured.id)),
    [category, featured],
  )

  return (
    <main className="fade-in">
      <section className="page-intro">
        <div className="container">
          <div className="page-intro-kicker">
            <Icon
              name="sparkles"
              size={14}
              stroke="var(--on-primary)"
              fill="var(--on-primary)"
              sw={1.5}
            />
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
            {t("lede")}
          </p>
        </div>
      </section>

      {featured && (
        <section style={{ padding: "40px 0" }}>
          <div className="container">
            <div className="stories-featured-grid">
              <FeaturedCard story={featured} readLabel={t("readMore")} />
              <aside className="stack-base">
                <div
                  className="t-uppercase-tag muted"
                  style={{ marginBottom: 4 }}
                >
                  {t("latest")}
                </div>
                {latest.map((s) => (
                  <LatestRow key={s.id} story={s} />
                ))}
              </aside>
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "8px 0 64px" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            {STORY_CATEGORIES.map((c) => {
              const active = category === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`chip${active ? " active" : ""}`}
                >
                  {c === "All" ? t("filters.all") : c}
                </button>
              )
            })}
          </div>

          {grid.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <Icon name="search" size={36} stroke="var(--muted-soft)" />
              <div className="t-display-sm ink" style={{ marginTop: 16 }}>
                {t("empty.title")}
              </div>
              <p className="t-body-sm muted" style={{ marginTop: 8 }}>
                {t("empty.subtitle")}
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: 20 }}
                onClick={() => setCategory("All")}
              >
                {t("empty.cta")}
              </button>
            </div>
          ) : (
            <div className="stories-grid">
              {grid.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background: "var(--surface-soft)",
              borderRadius: 24,
            }}
          >
            <h3 className="t-display-md ink" style={{ marginBottom: 12 }}>
              {t("subscribe.title")}
            </h3>
            <p
              className="t-body-md muted"
              style={{ marginBottom: 24, maxWidth: 520, margin: "0 auto 24px" }}
            >
              {t("subscribe.body")}
            </p>
            <button type="button" className="btn btn-primary">
              {t("subscribe.cta")}
            </button>
          </div>
        </div>
      </section>

      <StoriesStyles />
    </main>
  )
}

function FeaturedCard({
  story,
  readLabel,
}: {
  story: Story
  readLabel: string
}) {
  return (
    <Link href={`/stories/${story.id}`} className="stories-featured">
      <div className="stories-featured-bg" style={{ background: story.bg }} />
      <div className="stories-featured-overlay" />
      <div className="stories-featured-body">
        <span
          className="stories-featured-tag"
          style={{ background: categoryColor(story.category).solid }}
        >
          {story.category}
        </span>
        <h2 className="stories-featured-title">{story.title}</h2>
        <p className="stories-featured-summary">{story.summary}</p>
        <div className="stories-featured-meta">
          <span>{story.date}</span>
          <span aria-hidden>·</span>
          <span>
            {story.readMinutes} {readLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

function LatestRow({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.id}`} className="stories-latest-row">
      <div
        className="stories-latest-thumb"
        style={{ background: story.bg }}
        aria-hidden
      />
      <div style={{ minWidth: 0 }}>
        <span
          className="tag"
          style={{
            marginBottom: 6,
            background: categoryColor(story.category).softBg,
            color: categoryColor(story.category).solid,
          }}
        >
          {story.category}
        </span>
        <div className="t-title-sm ink stories-latest-title">{story.title}</div>
        <div className="t-caption muted" style={{ marginTop: 4 }}>
          {story.date}
        </div>
      </div>
    </Link>
  )
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.id}`} className="story-card">
      <div className="story-card-photo" style={{ background: story.bg }}>
        <span
          className="story-card-cat"
          style={{
            background: categoryColor(story.category).solid,
            color: "var(--on-primary)",
          }}
        >
          {story.category}
        </span>
      </div>
      <div className="story-card-body">
        <h3 className="t-title-md ink story-card-title">{story.title}</h3>
        <p className="t-body-sm muted story-card-summary">{story.summary}</p>
        <div className="row row-gap-xs t-caption muted">
          <span>{story.date}</span>
          <span aria-hidden>·</span>
          <span>{story.readMinutes} min read</span>
        </div>
      </div>
    </Link>
  )
}

function StoriesStyles() {
  return (
    <style>{`
      .stories-featured-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 32px;
      }
      @media (max-width: 900px) {
        .stories-featured-grid { grid-template-columns: 1fr; }
      }
      .stories-featured {
        position: relative;
        display: block;
        min-height: 380px;
        border-radius: var(--r-md);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: transform .25s ease, box-shadow .25s ease;
      }
      .stories-featured:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-card);
      }
      .stories-featured-bg {
        position: absolute; inset: 0;
        transition: transform .4s ease;
      }
      .stories-featured:hover .stories-featured-bg { transform: scale(1.03); }
      .stories-featured-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 55%, rgba(0,0,0,0) 100%);
      }
      .stories-featured-body {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 32px;
        color: #fff;
      }
      .stories-featured-tag {
        display: inline-flex;
        align-items: center;
        align-self: flex-start;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: var(--r-full);
        margin-bottom: 14px;
        letter-spacing: .2px;
      }
      .stories-featured-title {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -.6px;
        margin-bottom: 10px;
        max-width: 520px;
      }
      .stories-featured-summary {
        font-size: 15px;
        line-height: 1.6;
        color: rgba(255,255,255,.85);
        max-width: 520px;
        margin-bottom: 18px;
      }
      .stories-featured-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: rgba(255,255,255,.7);
      }

      .stories-latest-row {
        display: flex;
        gap: 14px;
        padding: 12px;
        border-radius: var(--r-md);
        border: 1px solid var(--hairline-soft);
        background: var(--canvas);
        text-decoration: none;
        color: inherit;
        transition: border-color .15s, background .15s;
      }
      .stories-latest-row:hover {
        border-color: var(--hairline);
        background: var(--surface-soft);
      }
      .stories-latest-thumb {
        width: 72px;
        height: 72px;
        border-radius: 10px;
        flex-shrink: 0;
      }
      .stories-latest-title {
        margin-top: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .stories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }
      .story-card {
        display: flex;
        flex-direction: column;
        background: var(--canvas);
        border: 1px solid var(--hairline-soft);
        border-radius: var(--r-md);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: transform .2s ease, box-shadow .2s ease, border-color .15s;
      }
      .story-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-card);
        border-color: var(--hairline);
      }
      .story-card-photo {
        height: 180px;
        position: relative;
      }
      .story-card-cat {
        position: absolute;
        top: 14px;
        left: 14px;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: var(--r-full);
        box-shadow: var(--shadow-card);
      }
      .story-card-body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .story-card-title {
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .story-card-summary {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }
    `}</style>
  )
}
