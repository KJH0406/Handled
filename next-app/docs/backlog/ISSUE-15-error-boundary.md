---
id: ISSUE-15
title: app/error.js, app/not-found.js 추가
status: open
priority: low
effort: S
depends_on: []
labels: ["ux", "infra"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-15: app/error.js, app/not-found.js 추가

## 목표

런타임 에러나 잘못된 URL 진입 시 보이는 fallback UI 추가. 사용자 경험 보호 + 디자인 시스템 일관성 유지.

## 현재 상태

- `app/error.js` 미정의 → 에러 발생 시 Next.js 기본 화면 (개발 모드는 stack trace, 프로덕션은 일반 메시지)
- `app/not-found.js` 미정의 → 잘못된 URL 진입 시 `_not-found` 페이지가 보이지만 디자인 미적용
- 화면 내부 fallback은 있음:
  - `ProfileScreen.jsx:25-42` — 가이드 못 찾을 때
  - `ExperienceDetailScreen.jsx:26-44` — 체험 못 찾을 때
  - `PaymentScreen.jsx:31-49` — booking 없을 때
- 이들은 in-app fallback이지 404가 아님

## 수락 기준

- [ ] `app/error.js` 생성 — 글로벌 runtime error fallback
  - 에러 메시지(개발 모드만), "Try again" 버튼, "Back to home" 링크
  - 디자인 시스템 토큰 사용 (디자인 일관성)
- [ ] `app/not-found.js` 생성 — 404 페이지
  - "Page not found" + "Back to home"
- [ ] (선택) `app/loading.js` — 글로벌 loading skeleton
- [ ] 두 페이지 모두 TopNav + Footer 포함 또는 일관된 스타일
- [ ] ISSUE-01 (App Router) 완료 후 라우트별 error/not-found도 추가 가능:
  - `app/guides/[guideId]/not-found.js` 등
- [ ] `npm run build` 통과
- [ ] 강제 에러 발생 시키는 디버그 라우트로 동작 확인

## 구현 메모

```jsx
// app/error.js
"use client"
import { useEffect } from "react"
import Icon from "./components/ui/Icon"

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <main className="fade-in">
      <div
        className="container"
        style={{
          paddingTop: 96,
          paddingBottom: 96,
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#fff0f3",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Icon name="x" size={32} stroke="var(--rausch)" sw={2.5} />
        </div>
        <h1 className="t-display-md ink" style={{ marginBottom: 12 }}>
          Something went wrong
        </h1>
        <p className="t-body-md muted" style={{ marginBottom: 32 }}>
          We hit an unexpected error. Please try again.
        </p>
        <div className="row center" style={{ gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <a className="btn btn-secondary" href="/">
            Back to home
          </a>
        </div>
      </div>
    </main>
  )
}
```

```jsx
// app/not-found.js
import Icon from "./components/ui/Icon"

export default function NotFound() {
  return (
    <main className="fade-in">
      <div
        className="container"
        style={{
          paddingTop: 96,
          paddingBottom: 96,
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <Icon
          name="search"
          size={48}
          stroke="var(--muted-soft)"
          style={{ display: "inline-block", marginBottom: 24 }}
        />
        <h1 className="t-display-md ink" style={{ marginBottom: 12 }}>
          Page not found
        </h1>
        <p className="t-body-md muted" style={{ marginBottom: 32 }}>
          The page you are looking for does not exist.
        </p>
        <a className="btn btn-primary" href="/">
          Back to home
        </a>
      </div>
    </main>
  )
}
```

## 위험

- `app/error.js`는 `"use client"` 필수
- `error.js`는 자식 segment 에러만 잡음 → root 에러는 `app/global-error.js` 필요
- TopNav/Footer를 layout에서 렌더링하면 error/not-found 페이지에도 자동 포함됨

## 참고

- Next.js: https://nextjs.org/docs/app/building-your-application/routing/error-handling
- 관련 파일:
  - 화면 내부 fallback: `screens/ProfileScreen.jsx`, `screens/ExperienceDetailScreen.jsx`, `screens/PaymentScreen.jsx`
- 관련 이슈: [[ISSUE-01]] (라우트별 not-found 가능)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
