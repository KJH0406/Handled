"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useBooking } from "../components/booking/BookingProvider"
import ExpBookingPanel from "../components/booking/ExpBookingPanel"
import Breadcrumb from "../components/layout/Breadcrumb"
import Avatar from "../components/ui/Avatar"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { CAT_FALLBACK } from "../lib/data/categories"
import { expGallery, meetingPlace } from "../lib/data/experiences"
import { SCHEDULE_BY_CATEGORY } from "../lib/data/schedules"
import { useAppNavigate } from "../lib/navigation"
import { experiencesRepo } from "../lib/repositories/experiences"
import { guidesRepo } from "../lib/repositories/guides"
import { reviewsRepo } from "../lib/repositories/reviews"
import type { Booking } from "../lib/types/domain"

export interface ExperienceDetailScreenProps {
  expId: string
}

export default function ExperienceDetailScreen({
  expId,
}: ExperienceDetailScreenProps) {
  const t = useTranslations("experienceDetail")
  const navigate = useAppNavigate()
  const { setBooking } = useBooking()
  const onReserve = (b: Booking) => {
    setBooking(b)
    navigate("payment")
  }
  const exp = useMemo(() => experiencesRepo.findById(expId), [expId])
  const guide = useMemo(
    () => (exp ? guidesRepo.findById(exp.guideId) : null),
    [exp],
  )
  const [heroErr, setHeroErr] = useState(false)

  if (!exp || !guide) {
    return (
      <main className="fade-in">
        <div className="container empty-state">
          <p className="t-body-md muted">{t("empty.title")}</p>
          <button
            className="btn btn-secondary mt-base"
            onClick={() => navigate("home")}
          >
            {t("empty.cta")}
          </button>
        </div>
      </main>
    )
  }

  const gallery = expGallery(exp, guide)
  const schedule = SCHEDULE_BY_CATEGORY[exp.category] ?? []
  const reviews = reviewsRepo.listByGuideId(guide.id)

  return (
    <main className="fade-in">
      <div className="container screen-pad">
        <Breadcrumb onBack={() => navigate("experiences")}>
          {t("backToExperiences")}
        </Breadcrumb>

        <div style={{ marginBottom: 16 }}>
          <div
            className="row row-gap-sm"
            style={{ marginBottom: 8, flexWrap: "wrap" }}
          >
            <span className="badge-pill badge-pill--accent">
              {exp.category}
            </span>
            <span className="t-caption muted">
              {t("packageHeader", {
                duration: exp.duration,
                maxGuests: exp.maxGuests,
              })}
            </span>
          </div>
          <h1 className="t-display-lg ink mb-sm">{exp.title}</h1>
          <div className="row row-gap-sm" style={{ flexWrap: "wrap" }}>
            <Stars rating={guide.rating} />
            <span className="t-body-sm body">
              {t("reviewCount", { count: guide.reviews })}
            </span>
            <span className="t-body-sm body">·</span>
            <Link
              href={`/guides/${guide.id}`}
              className="row row-gap-xs t-body-sm body host-inline-link"
            >
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={20}
              />
              <span>{t("hostedBy", { name: guide.name })}</span>
            </Link>
          </div>
        </div>

        <div className="gallery mb-xl">
          <div
            className="gallery-cell gallery-main"
            style={{ borderRadius: "14px 0 0 14px" }}
          >
            {heroErr ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    CAT_FALLBACK[exp.category]?.bg ??
                    "linear-gradient(135deg, #ff385c, #ffa07a)",
                }}
                aria-label={exp.title}
              />
            ) : (
              <Image
                src={gallery[0]}
                alt={exp.title}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 744px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                onError={() => setHeroErr(true)}
              />
            )}
          </div>
          <div className="gallery-side">
            <div className="gallery-cell">
              <Image
                src={gallery[1] ?? gallery[0]}
                alt=""
                fill
                sizes="(max-width: 744px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="gallery-cell">
              <Image
                src={gallery[3] ?? gallery[0]}
                alt=""
                fill
                sizes="(max-width: 744px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="gallery-side">
            <div
              className="gallery-cell"
              style={{ borderRadius: "0 14px 0 0" }}
            >
              <Image
                src={gallery[2] ?? gallery[0]}
                alt=""
                fill
                sizes="(max-width: 744px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="gallery-cell"
              style={{ borderRadius: "0 0 14px 0" }}
            >
              <Image
                src={gallery[4] ?? gallery[0]}
                alt=""
                fill
                sizes="(max-width: 744px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <div>
            <h2 className="t-display-sm ink mb-md">{t("whatYouWillDo")}</h2>
            <p className="t-body-md body mb-lg">{exp.summary}</p>
            <div className="stack-md mb-xl">
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

            <h2 className="t-display-sm ink mb-base">{t("itinerary")}</h2>
            <p className="t-body-sm muted mb-base">
              {t("itineraryTotal", { duration: exp.duration })}
            </p>
            <div className="schedule-list mb-xl">
              {schedule.map((s, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-item-photo">
                    <Image
                      src={gallery[(i + 1) % gallery.length]}
                      alt=""
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="row row-gap-sm" style={{ marginBottom: 4 }}>
                      <span className="schedule-step-num">{i + 1}</span>
                      <span className="t-title-md ink">{s.title}</span>
                    </div>
                    <p className="t-body-sm body">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <h2 className="t-display-sm ink mb-base">{t("aboutHost")}</h2>
            <div className="host-mini-card mb-base">
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={56}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row row-gap-xs" style={{ marginBottom: 2 }}>
                  <span className="t-title-md ink">{guide.name}</span>
                  {guide.superhost && (
                    <span
                      className="t-caption"
                      style={{ color: "var(--rausch)", fontWeight: 600 }}
                    >
                      {t("superhost")}
                    </span>
                  )}
                </div>
                <div className="t-caption-sm muted">
                  {t("hostStats", {
                    years: guide.yearsHosting,
                    reviews: guide.reviews,
                    rating: guide.rating.toFixed(2),
                  })}
                </div>
              </div>
              <Link
                href={`/guides/${guide.id}`}
                className="host-mini-card-link hide-mobile"
              >
                {t("viewProfile")}
              </Link>
            </div>
            <p className="t-body-sm body mb-xl">{guide.bio}</p>

            <div className="divider" />

            <h2 className="t-display-sm ink mb-base">{t("meetingPlace")}</h2>
            <div className="meet-map mb-md">
              <div className="meet-pin">
                <Icon name="pin" size={16} stroke="var(--rausch)" />
                <span className="t-body-sm ink value-strong">
                  {guide.district}
                </span>
              </div>
            </div>
            <p className="t-body-sm muted mb-xl">{meetingPlace(exp, guide)}</p>

            <div className="divider" />

            <h2 className="t-display-sm ink mb-base">{t("goodToKnow")}</h2>
            <div className="info-grid mb-xl">
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="users" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    {t("groupSize")}
                  </div>
                  <div className="t-body-sm muted">
                    {t("groupSizeValue", { max: exp.maxGuests })}
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="clock" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    {t("duration")}
                  </div>
                  <div className="t-body-sm muted">
                    {t("durationValue", { hours: exp.duration })}
                  </div>
                </div>
              </div>
              <div className="info-grid-item">
                <div className="info-grid-item-icon">
                  <Icon name="globe" size={18} />
                </div>
                <div>
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    {t("language")}
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
                  <div className="t-title-sm ink" style={{ marginBottom: 4 }}>
                    {t("cancellation")}
                  </div>
                  <div className="t-body-sm muted">
                    {t("cancellationValue")}
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
              {t("reviewsHeading", {
                rating: guide.rating.toFixed(2),
                count: guide.reviews,
              })}
            </h2>
            <p className="t-caption-sm muted mb-lg">
              {t("reviewsSubtitle", { name: guide.name })}
            </p>
            <div className="review-grid">
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
          </div>

          <ExpBookingPanel exp={exp} guide={guide} onReserve={onReserve} />
        </div>
      </div>
    </main>
  )
}
