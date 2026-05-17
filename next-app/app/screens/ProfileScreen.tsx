"use client"

import Image from "next/image"
import { useMemo } from "react"
import { useBooking } from "../components/booking/BookingProvider"
import CustomQuotePanel from "../components/booking/CustomQuotePanel"
import ExperienceCard from "../components/cards/ExperienceCard"
import Breadcrumb from "../components/layout/Breadcrumb"
import Avatar from "../components/ui/Avatar"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { guidesRepo } from "../lib/repositories/guides"
import { reviewsRepo } from "../lib/repositories/reviews"
import type { Booking } from "../lib/types/domain"

export interface ProfileScreenProps {
  guideId: string
}

export default function ProfileScreen({ guideId }: ProfileScreenProps) {
  const navigate = useAppNavigate()
  const { setBooking } = useBooking()
  const onReserve = (b: Booking) => {
    setBooking(b)
    navigate("payment")
  }
  const guide = useMemo(() => guidesRepo.findById(guideId), [guideId])
  const experiences = useMemo(
    () => experiencesRepo.listByGuideId(guideId),
    [guideId],
  )

  if (!guide) {
    return (
      <main className="fade-in">
        <div className="container empty-state">
          <p className="t-body-md muted">Guide not found.</p>
          <button
            className="btn btn-secondary mt-base"
            onClick={() => navigate("list")}
          >
            Back to list
          </button>
        </div>
      </main>
    )
  }
  const reviews = reviewsRepo.listByGuideId(guide.id)

  return (
    <main className="fade-in">
      <div className="container screen-pad">
        <Breadcrumb onBack={() => navigate("list")}>Back to guides</Breadcrumb>

        <div className="profile-hero">
          <div className="profile-hero-avatar">
            <Image
              src={guide.photo}
              alt={guide.name}
              fill
              priority
              sizes="128px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="row row-gap-sm"
              style={{ marginBottom: 6, flexWrap: "wrap" }}
            >
              {guide.superhost && (
                <span
                  className="badge-pill"
                  style={{ background: "var(--canvas)" }}
                >
                  <Icon name="award" size={12} /> Superhost
                </span>
              )}
              <span className="t-caption muted">
                {guide.district}, {guide.city}
              </span>
            </div>
            <h1 className="t-display-lg ink mb-sm">{guide.name}</h1>
            <p className="t-body-sm body mb-base" style={{ maxWidth: 560 }}>
              {guide.oneLiner}
            </p>
            <div className="profile-stats">
              <div className="profile-hero-stat">
                <span className="t-display-sm ink">
                  {guide.rating.toFixed(2)}
                </span>
                <span className="t-caption muted">Rating</span>
              </div>
              <div className="profile-hero-stat">
                <span className="t-display-sm ink">{guide.reviews}</span>
                <span className="t-caption muted">Reviews</span>
              </div>
              <div className="profile-hero-stat">
                <span className="t-display-sm ink">{guide.yearsHosting}y</span>
                <span className="t-caption muted">Hosting</span>
              </div>
              <div className="profile-hero-stat">
                <span className="t-display-sm ink">{experiences.length}</span>
                <span className="t-caption muted">Packages</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <div>
            <h2 className="t-display-sm ink mb-md">About {guide.name}</h2>
            <p className="t-body-md body mb-base">{guide.bio}</p>
            <p className="t-body-md body mb-xl" style={{ fontStyle: "italic" }}>
              &quot;{guide.intro}&quot;
            </p>

            <h2 className="t-display-sm ink mb-base">
              What {guide.name} offers
            </h2>
            <div className="stack-md mb-xl">
              {guide.highlights.map((h, i) => (
                <div key={i} className="row row-gap-md">
                  <div className="icon-circle">
                    <Icon name="sparkles" size={14} stroke="var(--rausch)" />
                  </div>
                  <span className="t-body-md ink">{h}</span>
                </div>
              ))}
            </div>

            <h2 className="t-display-sm ink mb-base">Good to know</h2>
            <div className="info-grid mb-xl">
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="globe" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    Languages
                  </div>
                  <div className="t-body-sm muted">
                    {guide.languages.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="pin" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    Cities
                  </div>
                  <div className="t-body-sm muted">
                    {guide.cities.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="building" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    Specialty
                  </div>
                  <div className="t-body-sm muted">
                    {guide.styles.join(" · ")}
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            <h2 className="t-display-sm ink mb-sm">
              <Icon
                name="star"
                size={18}
                fill="var(--ink)"
                stroke="var(--ink)"
                style={{ display: "inline-block", verticalAlign: "-3px" }}
              />{" "}
              {guide.rating.toFixed(2)} · {guide.reviews} reviews
            </h2>
            <div className="review-grid mt-lg">
              {reviews.slice(0, 4).map((r, i) => (
                <div key={i} className="review-cell">
                  <div className="row row-gap-sm review-cell-head">
                    <Avatar size={36} name={r.name} src="" />
                    <div>
                      <div className="t-title-sm ink">{r.name}</div>
                      <div className="t-caption-sm muted">{r.country}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="t-body-sm body review-cell-text">
                    &quot;{r.text}&quot;
                  </p>
                  <div className="t-caption-sm muted-soft review-cell-date">
                    {r.date}
                  </div>
                </div>
              ))}
            </div>
            {reviews.length > 4 && (
              <button className="btn btn-secondary mt-lg">
                See all {reviews.length} reviews
              </button>
            )}
          </div>

          <CustomQuotePanel guide={guide} onReserve={onReserve} />
        </div>

        {experiences.length > 0 && (
          <section className="section-divided">
            <div className="section-header mb-sm">
              <h2 className="t-display-md ink">
                Experiences hosted by {guide.name}
              </h2>
              <span className="t-body-sm muted">
                {experiences.length} packages
              </span>
            </div>
            <p className="t-body-sm muted mb-lg" style={{ maxWidth: 640 }}>
              Click an experience card to see schedule and photos. Or build a
              custom plan in the side panel.
            </p>
            <div className="exp-grid">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
