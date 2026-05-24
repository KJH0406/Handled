"use client"

interface AuthSocialsProps {
  onSelect: (provider: string) => void
  recentLabel: string
  ariaLabel: (provider: string) => string
}

const PROVIDERS = ["Google", "Facebook", "LINE", "Apple"] as const

export default function AuthSocials({
  onSelect,
  recentLabel,
  ariaLabel,
}: AuthSocialsProps) {
  return (
    <div className="auth-socials">
      {PROVIDERS.map((p) => (
        <div key={p} className="auth-social-wrap">
          <button
            type="button"
            className={`auth-social auth-social--${p.toLowerCase()}`}
            onClick={() => onSelect(p)}
            aria-label={ariaLabel(p)}
          >
            {ICONS[p]}
          </button>
          {p === "Google" && (
            <span className="auth-social-recent">{recentLabel}</span>
          )}
        </div>
      ))}
    </div>
  )
}

const ICONS: Record<(typeof PROVIDERS)[number], React.ReactNode> = {
  Google: (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  ),
  Facebook: (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M13.5 21v-8h2.6l.4-3h-3V8.1c0-.86.24-1.45 1.48-1.45H17V3.97c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10H8.3v3h2.62v8h2.58z"
      />
    </svg>
  ),
  LINE: (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M12 4c-4.97 0-9 3.2-9 7.15 0 3.54 3.2 6.5 7.52 7.06.29.06.69.19.79.44.09.22.06.57.03.79l-.13.77c-.04.23-.18.9.79.49.97-.41 5.23-3.08 7.13-5.27 1.31-1.44 1.94-2.9 1.94-4.54C21 7.2 16.97 4 12 4z"
      />
    </svg>
  ),
  Apple: (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M16.36 12.78c.02 2.4 2.1 3.2 2.13 3.21-.02.06-.33 1.14-1.1 2.26-.66.97-1.35 1.93-2.43 1.95-1.06.02-1.4-.63-2.62-.63-1.21 0-1.59.61-2.6.65-1.04.04-1.84-1.05-2.51-2.01-1.36-1.97-2.4-5.57-1-8 .69-1.21 1.93-1.97 3.27-1.99 1.02-.02 1.99.69 2.62.69.62 0 1.8-.85 3.03-.73.52.02 1.97.21 2.9 1.58-.07.05-1.74 1.02-1.72 3.04zM14.4 6.4c.56-.68.94-1.62.83-2.56-.81.03-1.79.54-2.37 1.21-.52.6-.97 1.56-.85 2.48.9.07 1.83-.46 2.39-1.13z"
      />
    </svg>
  ),
}
