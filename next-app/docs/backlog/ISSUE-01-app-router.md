---
id: ISSUE-01
title: Next.js App Router 실 라우팅 전환
status: done
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

- [x] 각 화면이 고유 URL을 가진다
  - `/` — Home
  - `/guides` — List (구 ListScreen)
  - `/guides/[guideId]` — Profile
  - `/experiences` — Experiences list
  - `/experiences/[expId]` — Experience detail
  - `/checkout` — Payment
  - `/checkout/confirmed` — Confirmation
- [x] 브라우저 뒤로/앞으로 동작 (Next router 기본)
- [x] 페이지 직접 진입(새 탭, 새로고침) 시에도 동작 — 7 URL 모두 200 OK 확인
- [x] `booking` state는 `Context` + `sessionStorage`로 관리. 새로고침 시 복원, booking 없으면 fallback UI 표시
- [x] `TopNav`의 `isActive` 판정이 `usePathname()` 기반으로 동작
- [x] `npm run build` 통과 + 모든 페이지 정적/동적 생성 성공 (5 static + 2 dynamic)
- [x] 기존 동작/스타일 회귀 없음 (수동 smoke: 7개 URL 모두 정상 렌더)

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

- 2026-05-17 완료. 단일 페이지 client state 라우터를 App Router 7개 URL로 분리.
- 신규 파일:
  - `lib/navigation.js` — `useAppNavigate()` wrapper. 기존 `navigate("name", params)` signature 유지하면서 내부적으로 `router.push()` 호출 + scroll-to-top. 7개 라우트 빌더 매핑 일원화.
  - `components/booking/BookingProvider.jsx` — Context + `sessionStorage` 동기화. 새로고침해도 booking 복원. SSG/prerender 호환을 위해 `useBooking`은 Provider 미존재 시 FALLBACK (`{booking: null, setBooking: noop, hydrated: false}`) 반환 — throw 대신 안전한 디폴트.
  - `components/layout/FooterSlot.jsx` — `usePathname()`으로 `/checkout/confirmed`에서만 Footer 숨김.
  - `app/{,guides,guides/[guideId],experiences,experiences/[expId],checkout,checkout/confirmed}/page.js` — 라우트 진입점.
- 삭제: `app/HandledApp.jsx` (modular 라우팅으로 대체).
- 모든 screen 컴포넌트가 `navigate`/`booking`/`onReserve` 등 prop 의존을 제거하고 hook으로 전환. 외부에서 받는 prop은 라우트 파라미터(`guideId`, `expId`)뿐.
- `useSearchParams()` 사용 페이지(`/guides`, `/experiences`)는 page.js에서 `<Suspense>` 경계로 감쌌다 (Next 14 요구사항).
- `PaymentScreen`/`ConfirmScreen`은 hydration 중 빈 `<main />` 보여주고, 그 후에야 sessionStorage에서 booking 읽어 본문 렌더 — "No booking" 깜빡임 방지.
- SSG 결과: `/`, `/checkout`, `/checkout/confirmed`, `/experiences`, `/guides` 5개 static, `/experiences/[expId]`, `/guides/[guideId]` 2개 dynamic. First Load JS 87~107 kB (이전 단일 HandledApp 113 kB보다 분할됨).
