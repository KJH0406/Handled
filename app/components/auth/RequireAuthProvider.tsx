"use client"

import { useTranslations } from "next-intl"
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { useAppNavigate } from "../../lib/navigation"
import Icon from "../ui/Icon"
import { useAuth } from "./AuthProvider"

interface RequireAuthContextValue {
  /**
   * Runs `action` when the user is signed in. Otherwise shows the
   * "login required" modal that routes to the sign-in screen on confirm.
   */
  requireAuth: (action: () => void) => void
}

const RequireAuthContext = createContext<RequireAuthContextValue | null>(null)

export function RequireAuthProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("auth.loginRequired")
  const { user, hydrated } = useAuth()
  const navigate = useAppNavigate()
  const [open, setOpen] = useState(false)

  const requireAuth = useCallback(
    (action: () => void) => {
      if (hydrated && !user) {
        setOpen(true)
        return
      }
      action()
    },
    [hydrated, user],
  )

  const confirm = () => {
    setOpen(false)
    navigate("signIn", { next: "planNew" })
  }

  return (
    <RequireAuthContext.Provider value={{ requireAuth }}>
      {children}
      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="modal-card" style={{ position: "relative" }}>
            <button
              type="button"
              aria-label={t("confirm")}
              onClick={() => setOpen(false)}
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
            <div
              aria-hidden="true"
              style={{
                width: 48,
                height: 48,
                margin: "8px auto 16px",
                color: "var(--muted)",
              }}
            >
              <Icon name="alertCircle" size={48} stroke="currentColor" sw={1.5} />
            </div>
            <h2
              id="login-required-title"
              className="t-title-md ink"
              style={{ marginBottom: 24 }}
            >
              {t("title")}
            </h2>
            <button
              className="btn btn-primary"
              onClick={confirm}
              style={{ width: "100%" }}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      )}
    </RequireAuthContext.Provider>
  )
}

export function useRequireAuth(): RequireAuthContextValue {
  const ctx = useContext(RequireAuthContext)
  return ctx ?? { requireAuth: (action) => action() }
}
