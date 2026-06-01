"use client"

import { categoryColor } from "../../lib/data/categoryColors"
import PlanMap, { type Point } from "../ui/PlanMap"

/**
 * Decorative hero visual: a polished, hero-only miniature of the trip-planner
 * RESULT screen (not the real PlanCanvasScreen). It mirrors the real output —
 * a stylized map + a day's itinerary with real Seoul venues, transit and cost —
 * so the homepage immediately shows the product's payoff. Purely presentational
 * and aria-hidden; content is intentionally hardcoded English (venue names are
 * content, same as Stories).
 */

// Curated route points (PlanMap viewBox is 880×320) — hand-placed for a clean
// zigzag that keeps all 4 pins inside the visible band, away from the river.
const ROUTE: Point[] = [
  { x: 140, y: 118 },
  { x: 352, y: 202 },
  { x: 566, y: 110 },
  { x: 738, y: 192 },
]

const DAY_TABS = ["Day 1", "Day 2", "Day 3", "Day 4"] as const

interface MockSlot {
  time: string
  category: Parameters<typeof categoryColor>[0]
  title: string
  area: string
  cost: string
  free?: boolean
}

const SLOTS: MockSlot[] = [
  {
    time: "09:30",
    category: "Culture",
    title: "Gyeongbokgung Palace",
    area: "Jongno",
    cost: "₩8,000",
  },
  {
    time: "13:00",
    category: "Food",
    title: "Gwangjang Market",
    area: "Jongno",
    cost: "₩18,000",
  },
  {
    time: "15:30",
    category: "Architecture",
    title: "Bukchon Hanok Village",
    area: "Jongno",
    cost: "Free",
    free: true,
  },
]

export default function HeroPlanPreview() {
  return (
    <div className="hpp" aria-hidden="true">
      <div className="hpp-card">
        <div className="hpp-head">
          <div className="hpp-kicker">AI itinerary</div>
          <div className="hpp-title">Seoul · 4 days</div>
        </div>
        <div className="hpp-tabs">
          {DAY_TABS.map((d, i) => (
            <span key={d} className={`hpp-tab${i === 0 ? " active" : ""}`}>
              {d}
            </span>
          ))}
        </div>

        <div className="hpp-map">
          <PlanMap
            slots={[]}
            pointsOverride={ROUTE}
            dayLabel="Day 1"
            ariaLabel="Seoul day 1 route map"
          />
        </div>

        <div className="hpp-list">
          {SLOTS.map((s, i) => {
            const c = categoryColor(s.category)
            return (
              <div key={s.title}>
                {i === 1 && (
                  <div className="hpp-transit">
                    <span className="hpp-transit-icon" aria-hidden>
                      🚇
                    </span>
                    <span className="hpp-transit-text">
                      Gyeongbokgung → Jongno 5-ga
                    </span>
                    <span className="hpp-line">Line 1</span>
                    <span className="hpp-transit-meta">18 min · ₩1,500</span>
                  </div>
                )}
                <div className="hpp-slot">
                  <div className="hpp-time">{s.time}</div>
                  <div>
                    <div className="hpp-badges">
                      <span
                        className="hpp-cat"
                        style={{ background: c.softBg, color: c.solid }}
                      >
                        {s.category}
                      </span>
                      <span
                        className={`hpp-cost${s.free ? " free" : ""}`}
                      >
                        {s.cost}
                      </span>
                    </div>
                    <div className="hpp-venue">{s.title}</div>
                    <div className="hpp-area">📍 {s.area}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hpp-total">
          <span className="hpp-total-label">Day 1 total</span>
          <span className="hpp-total-value">₩29,000</span>
          <span className="hpp-total-sub">4-day ₩179,000</span>
        </div>
      </div>

      <style>{`
        .hpp {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .hpp-card {
          width: 100%;
          max-width: 360px;
          background: var(--canvas);
          border: 1px solid var(--hairline-soft);
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.05);
          padding: 14px 16px 12px;
        }
        .hpp-head {
          margin-bottom: 8px;
        }
        .hpp-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .4px;
          text-transform: uppercase;
          color: var(--primary);
        }
        .hpp-title {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -.3px;
          color: var(--ink);
          margin-top: 2px;
          white-space: nowrap;
        }
        .hpp-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .hpp-tab {
          flex: 1;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 0;
          border-radius: 8px;
          color: var(--muted);
          background: var(--surface-soft);
          white-space: nowrap;
        }
        .hpp-tab.active {
          color: var(--on-primary);
          background: var(--primary);
        }
        .hpp-map {
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .hpp-list { display: flex; flex-direction: column; }
        .hpp-slot {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 10px;
          padding: 7px 0;
        }
        .hpp-time {
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
        }
        .hpp-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
        }
        .hpp-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .2px;
          padding: 3px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .hpp-cost {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--primary-light);
          color: var(--primary);
        }
        .hpp-cost.free {
          background: #e6f4ec;
          color: #136c34;
        }
        .hpp-venue {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.3;
        }
        .hpp-area {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }
        .hpp-transit {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 0 54px;
          padding: 3px 0;
        }
        .hpp-transit-icon { font-size: 14px; }
        .hpp-transit-text {
          flex: 1;
          min-width: 0;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hpp-line {
          flex-shrink: 0;
          font-size: 9.5px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--primary-light);
          color: var(--primary);
        }
        .hpp-transit-meta {
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          white-space: nowrap;
        }
        .hpp-total {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 6px;
          padding: 10px 14px;
          border-radius: 12px;
          background: var(--primary-light);
        }
        .hpp-total-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .3px;
          color: var(--primary);
        }
        .hpp-total-value {
          font-size: 18px;
          font-weight: 800;
          color: var(--primary);
          margin-left: auto;
        }
        .hpp-total-sub {
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
        }
      `}</style>
    </div>
  )
}
