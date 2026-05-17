---
id: ISSUE-05
title: TypeScript 도입 (점진적 마이그레이션)
status: done
priority: medium
effort: L
depends_on: []
labels: ["dx", "type-safety"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-05: TypeScript 도입 (점진적 마이그레이션)

## 목표

`.jsx` 파일을 `.tsx`로 점진적 마이그레이션하며 도메인 타입(Guide, Experience, Review, Booking)을 명시한다. 컴파일 타임에 prop/필드 누락을 잡아 안전성 확보.

## 현재 상태

- 전 파일 `.js`/`.jsx`
- `jsconfig.json`만 존재 (`@/*` path alias)
- `package.json`에 TypeScript 미포함
- 도메인 객체(Guide, Experience, Booking) 형상이 데이터 파일에만 암묵적으로 존재

## 수락 기준

- [ ] `typescript`, `@types/react`, `@types/react-dom`, `@types/node` devDependency 추가
- [ ] `tsconfig.json` 생성 (`allowJs: true`, `strict: true`, Next.js 권장 기본값)
- [ ] `lib/types/` 디렉토리에 도메인 타입 정의:
  - `Guide`, `Experience`, `Review`, `Booking`, `BookingMode`
- [ ] 다음 우선순위로 마이그레이션 (1개씩 별도 PR/커밋 권장):
  1. `lib/format.ts`, `lib/photo.ts` (순수 유틸)
  2. `lib/data/*.ts` (타입 캐스팅 + `as const` 활용)
  3. `components/ui/*.tsx` (props 타입)
  4. `components/cards/*.tsx`, `components/layout/*.tsx`
  5. `components/booking/*.tsx`
  6. `screens/*.tsx`
  7. `HandledApp.tsx`, `page.tsx`, `layout.tsx`
- [ ] `npm run build` 통과 (Next.js 자동 타입 체크)
- [ ] `any` 사용 0건 (불가피한 곳은 `unknown` + narrowing)
- [ ] React 컴포넌트는 `React.FC` 미사용 (rules/typescript 준수)

## 구현 메모

```json
// tsconfig.json (Next.js 14 권장)
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```ts
// lib/types/domain.ts
export type City = "Seoul" | "Busan" | "Jeju" | "Incheon"
export type Language = "Korean" | "English" | "Japanese" | "Mandarin" | "French"

export interface Guide {
  id: string
  name: string
  photo: string
  gallery: string[]
  city: City
  district: string
  rating: number
  reviews: number
  hourlyRate: number
  yearsHosting: number
  superhost: boolean
  languages: Language[]
  styles: string[]
  oneLiner: string
  bio: string
  intro: string
  highlights: string[]
  cities: City[]
}

export type ExperienceCategory =
  | "Food"
  | "Shopping"
  | "Culture"
  | "Architecture"
  | "Art"
  | "Nightlife"
  | "Photo"
  | "Beach"
  | "Nature"
  | "Traditional"
  | "Urban"

export interface Experience {
  id: string
  guideId: Guide["id"]
  title: string
  photo: string
  duration: number
  price: number
  maxGuests: number
  category: ExperienceCategory
  summary: string
  includes: string[]
}

export type BookingMode = "custom" | "experience"

export interface Booking {
  mode: BookingMode
  experience: Experience | null
  guide: Guide
  hours: number
  date: Date
  time: string
  guests: number
  interests: string[]
  requests: string
  subtotal: number
  fee: number
  total: number
  // 결제 완료 후 추가됨
  payerName?: string
  cardLast4?: string
  bookingId?: string
}
```

## 위험

- LARGE refactor. 한 번에 다 하면 회귀 위험 큼 → **반드시 단계별로 진행**
- Next.js가 `.jsx` + `.tsx` 혼재를 허용하지만, layout/page는 한 디렉토리에 하나만 가능
- `strict: true`에서 기존 코드의 implicit any가 다수 발견될 가능성 → 우선 `strict: false`로 시작하고 단계적으로 strict 적용도 옵션

## 참고

- 관련 파일: 전체
- Rules: `~/.claude/rules/typescript/coding-style.md`
- 관련 이슈: [[ISSUE-04]] (repository 인터페이스를 TS로 명시하면 시너지)

## 작업 로그 / 발견 사항

- 한 번에 전체 마이그레이션 진행 (strict: true 적용, allowJs는 켜둠).
- `lib/types/domain.ts` 신설: `Guide`, `Experience`, `Review`, `HomeReview`, `Booking`, `BookingMode`, `City`, `Language`, `ExperienceCategory`, `CategoryFallback`, `ScheduleItem`.
- 필터 enum(`CITIES`/`STYLES`/`LANGUAGES`/`TIMES`/`INTEREST_TAGS`)은 `as const` + `(typeof X)[number]` 패턴으로 narrow.
- `FilterRow`는 제네릭 제약을 풀고 `value: string`/`options: readonly string[]`로 단순화 (호출부와의 마찰 최소화).
- `BookingProvider`에서 `sessionStorage` 하이드레이션 시 `date` 필드가 string으로 부활하는 회귀 버그 발견 → `reviveBooking()`으로 `Date` 객체로 복원 (타입 정합성 + payment/confirm 화면 새로고침 시 `formatDate` 호출 안전).
- `Avatar.alt`는 optional로 두고 `name`을 fallback alt로 사용 (기존 JS 호출부 시그니처 유지).
- `app/lib/navigation.ts`: route name별 params 타입을 `RouteParamsByName` 맵으로 명시, `useAppNavigate`에 conditional tuple로 정확한 호출 시그니처 부여.
- `next-env.d.ts`는 next가 자동 생성. 추가로 `globals.d.ts`에 `declare module "*.css"` 한 줄 필요.
- `jsconfig.json` 삭제, `tsconfig.json`으로 대체 (path alias `@/*` 유지).
- `any` 사용 0건, `React.FC` 미사용. `unknown` + narrowing 1곳(`reviveBooking`).
- 빌드 통과: 9개 라우트 (`/`, `/checkout`, `/checkout/confirmed`, `/experiences`, `/experiences/[expId]`, `/guides`, `/guides/[guideId]`, `/_not-found`).
