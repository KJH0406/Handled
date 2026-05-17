---
id: ISSUE-14
title: i18n 준비 (next-intl)
status: done
priority: low
effort: L
depends_on: ["ISSUE-01"]
labels: ["i18n", "ux"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-14: i18n 준비 (next-intl)

## 목표

영어 하드코딩된 UI 텍스트를 다국어 키로 추출, 향후 한국어/일본어/중국어/프랑스어 지원 인프라 마련.

## 현재 상태

- 모든 UI 문구가 JSX 안에 영어 하드코딩 (수십 곳)
- 가이드 데이터(`bio`, `intro`, `oneLiner`, `summary`)도 영어 하드코딩
- 대상 페르소나 — **"한국 방문 외국인 여행객"** → 영어 1차, 추가 언어는 가이드 모집/마케팅 단계에서 결정

## 수락 기준

- [ ] `next-intl` 설치 + locale 라우팅 활성화 (`/en/...`, `/ja/...`, `/zh/...`, `/fr/...`)
- [ ] `messages/en.json`, `messages/ja.json` 등 메시지 카탈로그 생성
- [ ] UI 문구 100% → 메시지 키로 추출 (가이드 데이터는 별도)
- [ ] 언어 전환 UI (TopNav에 globe 아이콘 클릭 시)
- [ ] 가이드 데이터 다국어화 전략 결정:
  - 옵션 A: 각 필드를 `{ en: "...", ja: "..." }` 객체로
  - 옵션 B: 별도 i18n CMS (Strapi, Sanity) 도입
  - 우선 옵션 A로 시작 권장 (점진적)
- [ ] 기본 locale은 `en`
- [ ] 날짜/통화 포맷도 locale-aware (`formatDate`에서 toLocaleDateString 활용)
- [ ] `npm run build` 통과

## 구현 메모

```bash
npm install next-intl
```

```js
// next.config.js
const withNextIntl = require("next-intl/plugin")("./i18n.js")
module.exports = withNextIntl({
  /* ... */
})
```

```js
// i18n.js
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
```

```json
// messages/en.json
{
  "home": {
    "hero": {
      "title": "Korea, made local —",
      "subtitle": "experiences hosted by people you trust.",
      "lede": "Discover handpicked Korean experiences, hosted by vetted locals."
    },
    "search": {
      "where": "Where",
      "when": "When",
      "who": "Who",
      "placeholder": "Anywhere in Korea?"
    }
  },
  "nav": {
    "home": "Home",
    "experiences": "Experiences",
    "becomeHost": "Become a host"
  }
}
```

**디렉토리 구조 변경 (next-intl + App Router):**

```
app/
└── [locale]/
    ├── layout.js
    ├── page.js                 # HomeScreen
    ├── guides/
    ├── experiences/
    └── checkout/
```

## 위험

- **선행 조건: ISSUE-01 (App Router)** — 그렇지 않으면 locale routing 불가
- LARGE refactor. 가이드 데이터 다국어화는 별도 sub-issue로 분리 권장
- 가이드 데이터의 인명/지명(고유명사)이 locale에 따라 다를지(예: "Soyeon" vs "소연") 비즈니스 결정 필요
- 외부 페르소나가 영어권 위주라면 현재 상태로 충분할 수도 → **사용자 확인 필요**

## 참고

- 관련 파일: 전체 (UI 문구)
- next-intl: https://next-intl-docs.vercel.app/
- 관련 이슈: [[ISSUE-01]] (필수 선행)

## 작업 로그 / 발견 사항

### 결정: "인프라만 먼저 (en-only)"
- 페르소나 = 한국 방문 외국인 여행객 → 영어 1차로 충분
- next-intl 인프라만 정착시키고 ja/zh/fr 등은 JSON 추가로 점진적 확장
- 가이드 데이터(bio, intro, oneLiner, summary, highlights)는 별도 sub-issue로 분리 (UI 문구만 추출)

### Phase 1 — 인프라
- `next-intl@^4.12` 설치
- 디렉토리 구조: `app/[locale]/...` 로 라우트 이동, 비라우트(`screens/`, `components/`, `lib/`)는 유지
- `i18n/routing.ts` — `defineRouting({ locales: ["en"], defaultLocale: "en", localePrefix: "as-needed" })`
  - **as-needed**: 기본 locale(en)은 URL prefix 없음(`/experiences`), 비기본은 `/ja/experiences`. 현 URL 호환성 유지 + 미래 확장 가능
- `i18n/request.ts`, `i18n/navigation.ts` (Link/usePathname/useRouter wrapper) 추가
- `middleware.ts` — locale 감지/리다이렉트
- `next.config.mjs` — `createNextIntlPlugin("./i18n/request.ts")` 적용
- `app/[locale]/layout.tsx` — `<html lang>` 동적, `NextIntlClientProvider`, `setRequestLocale`, `generateStaticParams`
- 글로벌(`robots.ts`, `sitemap.ts`)은 `app/` 루트에 유지 (locale-independent)
- npm 캐시 권한 이슈로 `--cache /tmp/npm-cache-handled` 옵션으로 설치 (시스템 캐시 root 소유 문제)

### Phase 2 — UI 문자열 추출
- `messages/en.json` 작성 (~250 키, namespace 14개: site/common/nav/footer/home/list/experiences/experienceDetail/profile/payment/confirm/booking/calendar/error/notFound/cards/metadata)
- 클라이언트: `useTranslations("namespace")`, 서버: `getTranslations({ locale, namespace })`
- ICU plural 활용 (`{count, plural, one {# guide} other {# guides}}`)
- `t.rich("terms", { terms: chunks, privacy: chunks })` 로 인라인 태그 처리 (Payment 약관 링크)
- 업데이트된 파일 (16개):
  - 레이아웃: TopNav, Footer, FooterSlot, Breadcrumb는 prop 통과(변경 없음)
  - 화면: HomeScreen, ListScreen, ExperiencesScreen, ExperienceDetailScreen, ProfileScreen, PaymentScreen, ConfirmScreen
  - 예약 패널: Calendar, CustomQuotePanel, ExpBookingPanel
  - 카드: ExperienceCard, GuideCard
  - 유틸: FilterRow ("All" 만 translate)
  - 페이지 metadata: 6개 page.tsx + checkout/layout.tsx → `generateMetadata` async
  - 에러: error.tsx, not-found.tsx
- `validateCard(input, messages?)` 시그니처 확장 — i18n 메시지 주입 가능, 기본 메시지 fallback 유지

### Phase 3 — 스위처 + locale-aware 포맷
- `LocaleSwitcher` 컴포넌트 (TopNav globe 위치) — `<select>` 기반, routing.locales 순회. en만 있을 땐 single option, ja/zh 추가 시 자동 활성화
- `.locale-switcher` CSS 추가
- `lib/format.ts` — `usd`, `formatDate`, `shortDate` 가 optional `locale` 파라미터 수용 (`Intl.DateTimeFormat` / `Intl.NumberFormat`). 기본 "en-US" → 기존 출력 유지

### 알려진 한계 / 후속 과제
- `formatDate`/`usd` 콜러는 아직 `useLocale()` 결과를 넘기지 않음 (en-only라 영향 없음). ja/zh 추가 시 콜러에서 locale 전달 필요
- 가이드/체험 데이터(`bio`, `intro`, `oneLiner`, `summary`, `highlights`, schedule items)는 영어 하드코딩 유지 — 별도 sub-issue 대상
- 필터 값(city/style/category/language/interest 이름) 미번역 — 데이터 키로 사용 중 + 다국어 정책 결정 필요
- TopNav `usePathname`을 next-intl 버전으로 교체 (FooterSlot, TopNav `isActive`도 동일) — locale strip된 path 사용으로 locale 추가 시 일관 동작
- `global-error.tsx`, `loading.tsx` 미추가 (ISSUE-15 범위 정리와 동일 기준)

### 검증
- `npm run build` 통과 (11/11 정적 페이지 생성, 미들웨어 37.9 kB)
- 로컬 dev 스모크: `/` `/experiences` `/guides` → 200, `/en/` → 308 (as-needed redirect), `/nonexistent` → 404 (not-found.tsx 렌더)
- title metadata 정상 (`<title>Handled — Korean local experiences</title>`)
- First Load JS: 87.3 kB 공유 (+ ~12 kB next-intl runtime per route)
