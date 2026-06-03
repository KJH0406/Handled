"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Link } from "../../i18n/navigation"
import ExperienceCard from "../components/cards/ExperienceCard"
import Breadcrumb from "../components/layout/Breadcrumb"
import { categoryColor } from "../lib/data/categoryColors"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { storiesRepo } from "../lib/repositories/stories"

export interface StoryDetailScreenProps {
  storyId: string
}

export default function StoryDetailScreen({ storyId }: StoryDetailScreenProps) {
  const t = useTranslations("stories")
  const navigate = useAppNavigate()
  const story = useMemo(() => storiesRepo.findById(storyId), [storyId])
  // 프로토타입: 글-경험 매칭 알고리즘은 추후 정의(PRD 05 섹션4.2 참고).
  // 지금은 글마다 다른 경험이 보이도록 임의로 3개를 고른다.
  const relatedExperiences = useMemo(() => {
    if (!story) return []
    const all = experiencesRepo.list()
    if (all.length === 0) return []
    const seed = [...story.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
    const start = seed % all.length
    return Array.from(
      { length: Math.min(3, all.length) },
      (_, i) => all[(start + i) % all.length],
    )
  }, [story])

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

        {relatedExperiences.length > 0 && (
          <section
            style={{
              marginTop: 80,
              borderTop: "1px solid var(--hairline-soft)",
              paddingTop: 48,
            }}
          >
            <h2 className="t-display-md ink" style={{ marginBottom: 8 }}>
              {t("relatedExperiences.title")}
            </h2>
            <p className="t-body-md muted" style={{ marginBottom: 24 }}>
              {t("relatedExperiences.subtitle")}
            </p>
            <div className="exp-grid">
              {relatedExperiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} showGuide />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
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
