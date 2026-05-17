---
id: ISSUE-01
title: Next.js App Router 실 라우팅 전환
status: open
priority: high
effort: L
depends_on: []
labels: ["refactor", "routing"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-01: Next.js App Router 실 라우팅 전환

## 목표

현재 client state 기반 라우터(`useState({name})`)를 Next.js App Router URL 라우팅으로 전환하여 딥링크/공유/SEO/prefetch를 활성화한다.

## 현재 상태

- `next-app/app/HandledApp.jsx:62-88` — 모든 라우팅이 `setRoute({name, ...params})` 로 처리됨. URL은 항상 `/`
- 7개 화면이 단일 페이지 안에서 조건 렌더링 (`renderScreen` switch)
- `booking` 객체가 `payment` → `confirm` 화면을 가로지르는 cross-screen state (`HandledApp.jsx:74-78`)
- 브라우저 뒤로가기/북마크/공유 불가능
- SEO 0점 (모든 콘텐츠 단일 URL)

## 수락 기준

- [ ] 각 화면이 고유 URL을 가진다
  - `/` — Home
  - `/guides` — List (구 ListScreen)
  - `/guides/[guideId]` — Profile
  - `/experiences` — Experiences list
  - `/experiences/[expId]` — Experience detail
  - `/checkout` — Payment
  - `/checkout/confirmed` — Confirmation
- [ ] 브라우저 뒤로/앞으로 동작
- [ ] 페이지 직접 진입(새 탭, 새로고침) 시에도 동작
- [ ] `booking` state는 `Context` 또는 `sessionStorage`로 관리. `/checkout` 직접 진입 시 booking 없으면 `/` 또는 직전 페이지로 fallback
- [ ] `TopNav`의 `isActive` 판정이 `usePathname()` 기반으로 동작
- [ ] `npm run build` 통과 + 모든 페이지 정적/동적 생성 성공
- [ ] 기존 동작/스타일 회귀 없음 (golden path E2E 통과)

## 구현 메모

```
app/
├── layout.js                              # TopNav + Footer 공통
├── page.js                                # HomeScreen
├── guides/
│   ├── page.js                            # ListScreen
│   └── [guideId]/page.js                  # ProfileScreen
├── experiences/
│   ├── page.js                            # ExperiencesScreen
│   └── [expId]/page.js                    # ExperienceDetailScreen
├── checkout/
│   ├── layout.js                          # BookingProvider wrap
│   ├── page.js                            # PaymentScreen
│   └── confirmed/page.js                  # ConfirmScreen
└── components/
    └── booking/
        └── BookingProvider.jsx            # createContext + useBooking()
```

**라우팅 헬퍼 마이그레이션:**
- 현재 `navigate("experience", { expId: ... })` 호출부를 `useRouter().push("/experiences/" + expId)`로 치환
- 또는 wrapper hook: `useAppNavigate()` 안에서 매핑 보존

**Cross-screen state:**
- `BookingProvider`를 `app/checkout/layout.js`에 두고 sessionStorage 동기화
- 또는 결제 시작 시 booking을 server action / API에 임시 저장하고 `/checkout?session=xxx`로 reference만 전달

**Initial query 파라미터:**
- `ListScreen`/`ExperiencesScreen`의 `initialCity`/`initialQuery`는 search params로
  - `/experiences?city=Seoul&q=food`
  - `useSearchParams()` 로 읽기

## 위험

- **HIGH RISK 작업.** 7개 화면 모두 영향
- `navigate()` 콜이 50+ 곳에 흩어져 있어 일괄 치환 필요
- `BookingContext` 잘못 설계 시 `/checkout` 새로고침에서 booking 유실
- `useSearchParams()`는 Suspense boundary 필요 (Next.js 14)

## 참고

- 관련 파일:
  - `next-app/app/HandledApp.jsx` (전체)
  - `next-app/app/components/layout/TopNav.jsx:16-26` (isActive 로직)
  - 모든 `screens/*.jsx`의 `navigate()` 호출부
- Next.js docs: https://nextjs.org/docs/app/building-your-application/routing
- 관련 이슈: [[ISSUE-09]] (metadata는 라우팅 전환 후 가능)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
