"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import Icon from "../ui/Icon"
import AuthSocials from "./AuthSocials"
import { DEFAULT_CREDITS, useAuth } from "./AuthProvider"

const nameFromEmail = (email: string): string => {
  const handle = email.split("@")[0] || email
  return handle.charAt(0).toUpperCase() + handle.slice(1)
}

type Mode = "signUp" | "signIn"

interface AuthRequiredModalProps {
  open: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export default function AuthRequiredModal({
  open,
  onClose,
  onAuthenticated,
}: AuthRequiredModalProps) {
  const t = useTranslations("auth")
  const tm = useTranslations("auth.modal")
  const { signIn } = useAuth()

  const [mode, setMode] = useState<Mode>("signUp")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const reset = () => {
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setError("")
  }

  const close = () => {
    reset()
    onClose()
  }

  const completeAuth = (input: { email: string; name: string }) => {
    signIn(input)
    reset()
    onAuthenticated()
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError(t("errors.required"))
      return
    }
    completeAuth({ email: email.trim(), name: nameFromEmail(email.trim()) })
  }

  const onSocial = (provider: string) => {
    const handle = provider.toLowerCase()
    completeAuth({ email: `${handle}@handled.demo`, name: provider })
  }

  const titleKey = mode === "signUp" ? "signUpTitle" : "signInTitle"
  const ctaKey = mode === "signUp" ? "signUpCta" : "signInCta"
  const toggleLabelKey =
    mode === "signUp" ? "toggleToSignIn" : "toggleToSignUp"
  const togglePromptKey =
    mode === "signUp" ? "togglePromptHaveAccount" : "togglePromptNoAccount"

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className="modal-card"
        style={{ position: "relative", textAlign: "left", maxWidth: 420 }}
      >
        <button
          type="button"
          aria-label={tm("closeAria")}
          onClick={close}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            padding: 4,
            cursor: "pointer",
            color: "var(--ink)",
            lineHeight: 0,
          }}
        >
          <Icon name="x" size={20} stroke="currentColor" />
        </button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            aria-hidden
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 12px",
              borderRadius: 999,
              background: "var(--rausch)",
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name="sparkles"
              size={22}
              stroke="white"
              fill="white"
              sw={1.5}
            />
          </div>
          <h2
            id="auth-modal-title"
            className="t-title-md ink"
            style={{ marginBottom: 6 }}
          >
            {tm(titleKey)}
          </h2>
          {mode === "signUp" && (
            <p className="t-body-sm muted">
              {tm("creditPromise", { credits: DEFAULT_CREDITS })}
            </p>
          )}
        </div>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div>
            <div className="auth-input-row">
              <span className="auth-input-icon" aria-hidden>
                <Icon name="mail" size={20} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder={t("email")}
                autoComplete="email"
                aria-label={t("email")}
              />
            </div>
          </div>

          <div>
            <div className="auth-input-row">
              <span className="auth-input-icon" aria-hidden>
                <Icon name="lock" size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder={t("password")}
                autoComplete={
                  mode === "signUp" ? "new-password" : "current-password"
                }
                aria-label={t("password")}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? t("hidePassword") : t("showPassword")
                }
              >
                <Icon name={showPassword ? "eye" : "eyeOff"} size={20} />
              </button>
            </div>
            {error && <div className="auth-error">{error}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            style={{ width: "100%" }}
          >
            {tm(ctaKey, { credits: DEFAULT_CREDITS })}
          </button>
        </form>

        <div className="auth-divider">{t("or")}</div>

        <AuthSocials
          onSelect={onSocial}
          recentLabel={t("recentLogin")}
          ariaLabel={(p) => t("continueWith", { provider: p })}
        />

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          {tm(togglePromptKey)}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signUp" ? "signIn" : "signUp")
              setError("")
            }}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              color: "var(--rausch)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tm(toggleLabelKey)}
          </button>
        </div>
      </div>
    </div>
  )
}
