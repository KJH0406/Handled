"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Link } from "../../i18n/navigation"
import AuthSocials from "../components/auth/AuthSocials"
import { useAuth } from "../components/auth/AuthProvider"
import Icon from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"

const nameFromEmail = (email: string): string => {
  const handle = email.split("@")[0] || email
  return handle.charAt(0).toUpperCase() + handle.slice(1)
}

export default function SignInScreen() {
  const t = useTranslations("auth")
  const navigate = useAppNavigate()
  const { user, signIn, hydrated } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (hydrated && user) navigate("home")
  }, [hydrated, user, navigate])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prototype: accept any non-empty email + password
    if (!email.trim() || !password) {
      setError(t("errors.required"))
      return
    }
    signIn({ email: email.trim(), name: nameFromEmail(email.trim()) })
    navigate("home")
  }

  const onSocial = (provider: string) => {
    const handle = provider.toLowerCase()
    signIn({ email: `${handle}@handled.demo`, name: provider })
    navigate("home")
  }

  return (
    <main className="auth-page fade-in">
      <div className="auth-card">
        <Link href="/" className="auth-logo" aria-label={t("logoAria")}>
          Handled
        </Link>
        <span className="auth-tagline">{t("tagline")}</span>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="auth-email">{t("email")}</label>
            <div className="input-affix" data-invalid={error ? "true" : undefined}>
              <span className="affix-icon" aria-hidden>
                <Icon name="mail" size={20} />
              </span>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="auth-password">{t("password")}</label>
            <div className="input-affix" data-invalid={error ? "true" : undefined}>
              <span className="affix-icon" aria-hidden>
                <Icon name="lock" size={20} />
              </span>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                autoComplete="current-password"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "auth-error" : undefined}
              />
              <button
                type="button"
                className="affix-action"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                aria-pressed={showPassword}
              >
                <Icon name={showPassword ? "eye" : "eyeOff"} size={20} />
              </button>
            </div>
          </div>

          {error && (
            <div id="auth-error" className="auth-error" role="alert">
              {error}
            </div>
          )}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary auth-btn">
              {t("logIn")}
            </button>
            <Link
              href="/sign-up"
              className="btn btn-secondary auth-btn auth-btn--outline"
            >
              {t("signUp")}
            </Link>
          </div>
        </form>

        <a href="#" className="auth-forgot">
          {t("forgotPassword")}
        </a>

        <div className="auth-divider">{t("or")}</div>

        <AuthSocials
          onSelect={onSocial}
          recentLabel={t("recentLogin")}
          ariaLabel={(p) => t("continueWith", { provider: p })}
        />
      </div>
    </main>
  )
}
