---
id: ISSUE-11
title: PaymentScreen dynamic import로 코드 스플릿
status: open
priority: low
effort: S
depends_on: []
labels: ["perf", "bundle"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-11: PaymentScreen dynamic import로 코드 스플릿

## 목표

가장 큰 스크린(`PaymentScreen.jsx`, 508줄)이 첫 로드 번들에 포함되지 않도록 dynamic import. 홈/탐색 단계의 JS 페이로드 감소.

## 현재 상태

- `HandledApp.jsx:43-49` — `PaymentScreen`이 정적 import
- 모든 라우트 진입 시 PaymentScreen 코드가 함께 로드됨
- 결제 화면은 사용자의 ~5% 만 도달하는 화면

빌드 출력 (현재):

```
Route (app)                     Size     First Load JS
┌ ○ /                          20 kB    107 kB
```

PaymentScreen이 분리되면 `/` First Load JS 감소 예상.

## 수락 기준

- [ ] `next/dynamic` 사용해서 `PaymentScreen`을 lazy load
- [ ] (선택) `ConfirmScreen`도 동일하게 처리
- [ ] 로딩 중 fallback UI 또는 즉시 표시 (`ssr: false` 옵션 + Suspense)
- [ ] `npm run build` 결과에서 `/` First Load JS 감소 확인
- [ ] 결제 흐름 동작 회귀 없음 (수동 테스트)

## 구현 메모

**ISSUE-01 (App Router) 완료 전 — HandledApp.jsx 구조에서:**

```js
// HandledApp.jsx
import dynamic from "next/dynamic"

const PaymentScreen = dynamic(() => import("./screens/PaymentScreen"), {
  loading: () => (
    <div className="container" style={{ padding: 64 }}>
      Loading…
    </div>
  ),
  ssr: false,
})
const ConfirmScreen = dynamic(() => import("./screens/ConfirmScreen"), {
  ssr: false,
})
```

**ISSUE-01 (App Router) 완료 후:**

각 page.js가 이미 자동 코드 스플릿됨. 이 이슈는 자연 해결 → **ISSUE-01 완료 시 이 이슈는 `dropped` 후보**.

→ 단독으로 진행할지 ISSUE-01 후속으로 흡수할지는 작업 시점에 결정.

## 위험

- `ssr: false`로 두면 결제 페이지 SSR이 안 됨 → SEO 무관한 페이지라 OK
- dynamic 컴포넌트는 직접 import한 prop type을 정적 검사할 수 없음 (TS에서 약간 약해짐)

## 참고

- 관련 파일:
  - `next-app/app/HandledApp.jsx:9-10` (PaymentScreen, ConfirmScreen import)
  - `next-app/app/screens/PaymentScreen.jsx` (508 lines, 가장 큼)
- next/dynamic: https://nextjs.org/docs/app/api-reference/functions/dynamic
- 관련 이슈: [[ISSUE-01]] (완료 시 자동 해결 가능)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
