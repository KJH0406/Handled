"use client"

import { useEffect, useState } from "react"
import Icon from "./Icon"

export interface PlanGeneratingSplashProps {
  title: string
  steps: string[]
  stepIntervalMs?: number
  fullscreen?: boolean
}

export default function PlanGeneratingSplash({
  title,
  steps,
  stepIntervalMs = 700,
  fullscreen = true,
}: PlanGeneratingSplashProps) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (steps.length <= 1) return
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % steps.length)
    }, stepIntervalMs)
    return () => window.clearInterval(id)
  }, [steps.length, stepIntervalMs])

  const containerStyle: React.CSSProperties = fullscreen
    ? {
        position: "fixed",
        inset: 0,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 16px",
      }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={containerStyle}
    >
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div
          aria-hidden="true"
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background:
              "radial-gradient(circle at center, rgba(255,56,92,0.18) 0%, rgba(255,56,92,0) 65%)",
            animation: "planPulseHalo 1.8s ease-in-out infinite",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              animation: "planPulseIcon 1.8s ease-in-out infinite",
            }}
          >
            <Icon
              name="sparkles"
              size={36}
              stroke="var(--rausch)"
              fill="var(--rausch)"
              sw={1.5}
            />
          </span>
        </div>

        <h2
          className="t-display-sm ink"
          style={{ marginBottom: 12, lineHeight: 1.25 }}
        >
          {title}
        </h2>

        <div
          aria-hidden="true"
          style={{
            position: "relative",
            height: 22,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="t-body-sm muted"
              style={{
                position: "absolute",
                inset: 0,
                transition: "opacity 320ms ease, transform 320ms ease",
                opacity: i === idx ? 1 : 0,
                transform:
                  i === idx ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 180,
            height: 3,
            margin: "0 auto",
            borderRadius: 999,
            background: "var(--hairline-soft, #ebebeb)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "40%",
              background: "var(--rausch)",
              borderRadius: 999,
              animation: "planProgressSlide 1.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  )
}
