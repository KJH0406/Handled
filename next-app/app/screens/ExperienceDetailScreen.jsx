"use client"

import { useMemo } from "react"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import Avatar from "../components/ui/Avatar"
import ExpBookingPanel from "../components/booking/ExpBookingPanel"
import { EXPERIENCES, expGallery, meetingPlace } from "../lib/data/experiences"
import { GUIDES } from "../lib/data/guides"
import { REVIEWS_BY_GUIDE } from "../lib/data/reviews"
import { SCHEDULE_BY_CATEGORY } from "../lib/data/schedules"
import { CAT_FALLBACK } from "../lib/data/categories"

export default function ExperienceDetailScreen({
  navigate,
  expId,
  onReserve,
}) {
  const exp = useMemo(() => EXPERIENCES.find((e) => e.id === expId), [expId])
  const guide = useMemo(
    () => (exp ? GUIDES.find((g) => g.id === exp.guideId) : null),
    [exp],
  )

  if (!exp || !guide) {
    return (
      <main className="fade-in">
        <div
          className="container"
          style={{ paddingTop: 64, paddingBottom: 64 }}
        >
          <p className="t-body-md muted">Experience not found.</p>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 16 }}
            onClick={() => navigate("home")}
          >
            Home
          </button>
        </div>
      </main>
    )
  }

  const gallery = expGallery(exp, guide)
  const schedule = SCHEDULE_BY_CATEGORY[exp.category] || []
  const reviews = REVIEWS_BY_GUIDE[guide.id] || []

  return (
    <main className="fade-in">
      <div
        className="container"
        style={{ paddingTop: 24, paddingBottom: 64 }}
      >
        {/* breadcrumb */}
        <div
          className="row row-gap-sm"
          style={{
            marginBottom: 16,
            color: "var(--muted)",
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={() => navigate("profile", { guideId: guide.id })}
        >
          <Icon name="arrowLeft" size={16} />
          <span className="t-body-sm">Back to {guide.name}</span>
        </div>

        {/* hero title */}
        <div style={{ marginBottom: 16 }}>
          <div
            className="row row-gap-sm"
            style={{ marginBottom: 8, flexWrap: "wrap" }}
          >
            <span
              className="badge-pill"
              style={{
                background: "#fff0f3",
                color: "var(--rausch)",
                boxShadow: "none",
              }}
            >
              {exp.category}
            </span>
            <span className="t-caption muted">
              {exp.duration}h package · Up to {exp.maxGuests}
            </span>
          </div>
          <h1 className="t-display-lg ink" style={{ marginBottom: 8 }}>
            {exp.title}
          </h1>
          <div className="row row-gap-sm" style={{ flexWrap: "wrap" }}>
            <Stars rating={guide.rating} />
            <span className="t-body-sm body">· {guide.reviews} reviews</span>
            <span className="t-body-sm body">·</span>
            <span
              className="row row-gap-xs t-body-sm body"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("profile", { guideId: guide.id })}
            >
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={20}
              />
              <span>Hosted by {guide.name}</span>
            </span>
          </div>
        </div>

        {/* gallery */}
        <div className="gallery" style={{ marginBottom: 32 }}>
          <img
            className="gallery-main"
            src={gallery[0]}
            alt={exp.title}
            style={{ borderRadius: "14px 0 0 14px" }}
            onError={(e) => {
              e.currentTarget.style.background =
                CAT_FALLBACK[exp.category]?.bg ||
                "linear-gradient(135deg, #ff385c, #ffa07a)"
              e.currentTarget.style.objectFit = "none"
              e.currentTarget.removeAttribute("src")
            }}
          />
          <div className="gallery-side">
            <img src={gallery[1] || gallery[0]} alt="" />
            <img src={gallery[3] || gallery[0]} alt="" />
          </div>
          <div className="gallery-side">
            <img
              src={gallery[2] || gallery[0]}
              alt=""
              style={{ borderRadius: "0 14px 0 0" }}
            />
            <img
              src={gallery[4] || gallery[0]}
              alt=""
              style={{ borderRadius: "0 0 14px 0" }}
            />
          </div>
        </div>

        <div className="profile-grid">
          {/* LEFT */}
          <div>
            {/* summary */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 12 }}>
              What you will do
            </h2>
            <p className="t-body-md body" style={{ marginBottom: 20 }}>
              {exp.summary}
            </p>
            <div className="stack-md" style={{ marginBottom: 32 }}>
              {exp.includes.map((item, i) => (
                <div key={i} className="row row-gap-md">
                  <Icon
                    name="check"
                    size={18}
                    stroke="var(--rausch)"
                    sw={2.5}
                  />
                  <span className="t-body-md ink">{item}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* schedule */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 16 }}>
              Itinerary
            </h2>
            <p className="t-body-sm muted" style={{ marginBottom: 16 }}>
              Total {exp.duration} hours
            </p>
            <div className="schedule-list" style={{ marginBottom: 32 }}>
              {schedule.map((s, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-item-photo">
                    <img
                      src={gallery[(i + 1) % gallery.length]}
                      alt=""
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="row row-gap-sm"
                      style={{ marginBottom: 4 }}
                    >
                      <span className="schedule-step-num">{i + 1}</span>
                      <span className="t-title-md ink">{s.title}</span>
                    </div>
                    <p className="t-body-sm body">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* host mini-card */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 16 }}>
              About your host
            </h2>
            <div className="host-mini-card" style={{ marginBottom: 16 }}>
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={56}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="row row-gap-xs"
                  style={{ marginBottom: 2 }}
                >
                  <span className="t-title-md ink">{guide.name}</span>
                  {guide.superhost && (
                    <span
                      className="t-caption"
                      style={{ color: "var(--rausch)", fontWeight: 600 }}
                    >
                      · Superhost
                    </span>
                  )}
                </div>
                <div className="t-caption-sm muted">
                  {guide.yearsHosting}y hosting · {guide.reviews} reviews · ★
                  {guide.rating.toFixed(2)}
                </div>
              </div>
              <button
                className="host-mini-card-link hide-mobile"
                onClick={() => navigate("profile", { guideId: guide.id })}
              >
                View profile
              </button>
            </div>
            <p className="t-body-sm body" style={{ marginBottom: 32 }}>
              {guide.bio}
            </p>

            <div className="divider" />

            {/* meeting place */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 16 }}>
              Meeting place
            </h2>
            <div className="meet-map" style={{ marginBottom: 12 }}>
              <div className="meet-pin">
                <Icon name="pin" size={16} stroke="var(--rausch)" />
                <span
                  className="t-body-sm ink"
                  style={{ fontWeight: 500 }}
                >
                  {guide.district}
                </span>
              </div>
            </div>
            <p className="t-body-sm muted" style={{ marginBottom: 32 }}>
              {meetingPlace(exp, guide)}
            </p>

            <div className="divider" />

            {/* know before you go */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 16 }}>
              Good to know
            </h2>
            <div className="info-grid" style={{ marginBottom: 32 }}>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="users" size={18} />
                </div>
                <div>
                  <div
                    className="t-title-sm ink"
                    style={{ marginBottom: 4 }}
                  >
                    Group size
                  </div>
                  <div className="t-body-sm muted">
                    Up to {exp.maxGuests} (small group)
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="clock" size={18} />
                </div>
                <div>
                  <div
                    className="t-title-sm ink"
                    style={{ marginBottom: 4 }}
                  >
                    Duration
                  </div>
                  <div className="t-body-sm muted">
                    {exp.duration} hours
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="globe" size={18} />
                </div>
                <div>
                  <div
                    className="t-title-sm ink"
                    style={{ marginBottom: 4 }}
                  >
                    Language
                  </div>
                  <div className="t-body-sm muted">
                    {guide.languages.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="shield" size={18} />
                </div>
                <div>
                  <div
                    className="t-title-sm ink"
                    style={{ marginBottom: 4 }}
                  >
                    Cancellation
                  </div>
                  <div className="t-body-sm muted">
                    Free cancellation up to 24h before
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* reviews */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 8 }}>
              <Icon
                name="star"
                size={18}
                fill="var(--ink)"
                stroke="var(--ink)"
                style={{ display: "inline-block", verticalAlign: "-3px" }}
              />{" "}
              {guide.rating.toFixed(2)} · {guide.reviews} reviews
            </h2>
            <p
              className="t-caption-sm muted"
              style={{ marginBottom: 24 }}
            >
              Reviews for all experiences hosted by {guide.name}
            </p>
            <div className="review-grid">
              {reviews.slice(0, 4).map((r, i) => (
                <div key={i}>
                  <div
                    className="row row-gap-sm"
                    style={{ marginBottom: 8 }}
                  >
                    <Avatar size={36} name={r.name} src="" />
                    <div>
                      <div className="t-title-sm ink">{r.name}</div>
                      <div className="t-caption-sm muted">{r.country}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="t-body-sm body" style={{ marginTop: 8 }}>
                    "{r.text}"
                  </p>
                  <div
                    className="t-caption-sm muted-soft"
                    style={{ marginTop: 6 }}
                  >
                    {r.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Experience booking panel */}
          <ExpBookingPanel exp={exp} guide={guide} onReserve={onReserve} />
        </div>
      </div>
    </main>
  )
}
