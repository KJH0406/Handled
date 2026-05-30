"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Link } from "../../i18n/navigation"
import AuthSocials from "../components/auth/AuthSocials"
import { useAuth } from "../components/auth/AuthProvider"
import Icon from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"

export default function SignUpScreen() {
  const t = useTranslations("auth")
  const navigate = useAppNavigate()
  const { user, signIn, hydrated } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (hydrated && user) navigate("home")
  }, [hydrated, user, navigate])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prototype: accept any input as long as fields are filled and passwords match
    if (!name.trim() || !email.trim() || !password) {
      setError(t("errors.required"))
      return
    }
    if (password !== confirm) {
      setError(t("errors.passwordMismatch"))
      return
    }
    signIn({ email: email.trim(), name: name.trim() })
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

        <h1 className="auth-heading">{t("createAccount")}</h1>

        <form className="auth-form auth-form--signup" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="auth-name">{t("name")}</label>
            <div className="input-affix" data-invalid={error ? "true" : undefined}>
              <span className="affix-icon" aria-hidden>
                <Icon name="user" size={20} />
              </span>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                placeholder={t("namePlaceholder")}
                autoComplete="name"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>
          </div>

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
                autoComplete="new-password"
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

          <div className="field">
            <label htmlFor="auth-confirm">{t("confirmPassword")}</label>
            <div className="input-affix" data-invalid={error ? "true" : undefined}>
              <span className="affix-icon" aria-hidden>
                <Icon name="lock" size={20} />
              </span>
              <input
                id="auth-confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setError("")
                }}
                autoComplete="new-password"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>
          </div>

          {error && (
            <div id="auth-error" className="auth-error" role="alert">
              {error}
            </div>
          )}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary auth-btn">
              {t("signUp")}
            </button>
          </div>
        </form>

        <p className="auth-alt">
          {t("haveAccount")}{" "}
          <Link href="/sign-in" className="auth-alt-link">
            {t("logIn")}
          </Link>
        </p>

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
