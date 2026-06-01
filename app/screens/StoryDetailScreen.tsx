"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Link } from "../../i18n/navigation"
import Breadcrumb from "../components/layout/Breadcrumb"
import { categoryColor } from "../lib/data/categoryColors"
import { useAppNavigate } from "../lib/navigation"
import { storiesRepo } from "../lib/repositories/stories"

export interface StoryDetailScreenProps {
  storyId: string
}

export default function StoryDetailScreen({ storyId }: StoryDetailScreenProps) {
  const t = useTranslations("stories")
  const navigate = useAppNavigate()
  const story = useMemo(() => storiesRepo.findById(storyId), [storyId])
  const related = useMemo(
    () => (story ? storiesRepo.related(story, 3) : []),
    [story],
  )

  if (!story) {
    return (
      <main className="fade-in">
        <div className="container empty-state">
          <p className="t-body-md muted">{t("notFound.title")}</p>
          <button
            type="button"
            className="btn btn-secondary mt-base"
            onClick={() => navigate("home")}
          >
            {t("notFound.cta")}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="fade-in">
      <div className="container screen-pad">
        <Breadcrumb onBack={() => navigate("home")}>
          {t("backToStories")}
        </Breadcrumb>

        <article style={{ maxWidth: 760, margin: "0 auto" }}>
          <div
            className="row row-gap-sm"
            style={{ marginBottom: 16, flexWrap: "wrap" }}
          >
            <span
              className="badge-pill badge-pill--accent"
              style={{
                background: categoryColor(story.category).softBg,
                color: categoryColor(story.category).solid,
              }}
            >
              {story.category}
            </span>
            <span className="t-caption muted">{story.date}</span>
            <span className="t-caption muted" aria-hidden>
              ·
            </span>
            <span className="t-caption muted">
              {story.readMinutes} {t("readMore")}
            </span>
          </div>

          <h1 className="t-display-xl ink" style={{ marginBottom: 16 }}>
            {story.title}
          </h1>
          <p
            className="t-body-md muted"
            style={{ marginBottom: 32, fontSize: 18, lineHeight: 1.6 }}
          >
            {story.summary}
          </p>

          <div
            style={{
              height: 360,
              borderRadius: 24,
              background: story.bg,
              marginBottom: 40,
            }}
            aria-hidden
          />

          <div
            className="stack-base"
            style={{ fontSize: 17, lineHeight: 1.75 }}
          >
            {story.body.map((para, i) => (
              <p key={i} style={{ color: "var(--body)" }}>
                {para}
              </p>
            ))}
          </div>

          {story.tags.length > 0 && (
            <div
              style={{
                marginTop: 40,
                paddingTop: 28,
                borderTop: "1px solid var(--hairline-soft)",
              }}
            >
              <div
                className="t-uppercase-tag muted"
                style={{ marginBottom: 12 }}
              >
                {t("topics")}
              </div>
              <div className="row row-gap-sm" style={{ flexWrap: "wrap" }}>
                {story.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/stories?tag=${encodeURIComponent(tag)}`}
                    className="story-tag-chip"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section
            style={{
              marginTop: 80,
              borderTop: "1px solid var(--hairline-soft)",
              paddingTop: 48,
            }}
          >
            <h2 className="t-display-md ink" style={{ marginBottom: 24 }}>
              {t("related")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/stories/${r.id}`}
                  className="story-related-card"
                >
                  <div
                    className="story-related-photo"
                    style={{ background: r.bg }}
                  />
                  <div style={{ padding: 16 }}>
                    <span
                      className="t-caption"
                      style={{
                        color: categoryColor(r.category).solid,
                        fontWeight: 700,
                      }}
                    >
                      {r.category}
                    </span>
                    <div
                      className="t-title-md ink"
                      style={{ marginTop: 8, lineHeight: 1.35 }}
                    >
                      {r.title}
                    </div>
                    <div className="t-caption muted" style={{ marginTop: 8 }}>
                      {r.date} · {r.readMinutes} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .story-related-card {
          display: block;
          background: var(--canvas);
          border: 1px solid var(--hairline-soft);
          border-radius: var(--r-md);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform .2s ease, box-shadow .2s ease, border-color .15s;
        }
        .story-related-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-card);
          border-color: var(--hairline);
        }
        .story-related-photo {
          height: 140px;
        }
        .story-tag-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: var(--r-full);
          border: 1px solid var(--hairline);
          background: var(--surface-soft);
          color: var(--body);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: border-color .15s, background .15s, color .15s;
        }
        .story-tag-chip:hover {
          border-color: var(--ink);
          background: var(--canvas);
          color: var(--ink);
        }
      `}</style>
    </main>
  )
}
