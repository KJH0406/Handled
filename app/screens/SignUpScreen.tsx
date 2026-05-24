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
          <div className="auth-input-row">
            <span className="auth-input-icon" aria-hidden>
              <Icon name="user" size={20} />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              placeholder={t("name")}
              autoComplete="name"
              aria-label={t("name")}
            />
          </div>

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
              autoComplete="new-password"
              aria-label={t("password")}
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              <Icon name={showPassword ? "eye" : "eyeOff"} size={20} />
            </button>
          </div>

          <div>
            <div className="auth-input-row">
              <span className="auth-input-icon" aria-hidden>
                <Icon name="lock" size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setError("")
                }}
                placeholder={t("confirmPassword")}
                autoComplete="new-password"
                aria-label={t("confirmPassword")}
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
          </div>

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
