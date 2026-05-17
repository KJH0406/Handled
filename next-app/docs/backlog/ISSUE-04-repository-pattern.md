---
id: ISSUE-04
title: 데이터 레이어 추상화 (Repository pattern)
status: done
priority: high
effort: M
depends_on: []
labels: ["refactor", "architecture"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-04: 데이터 레이어 추상화 (Repository pattern)

## 목표

화면 컴포넌트가 `GUIDES`/`EXPERIENCES` 모듈 상수를 직접 import해서 `.find`/`.filter`로 조작하는 현 구조를 repository 계층으로 감싸, 추후 API/Supabase/CMS 교체 시 화면 코드 무수정으로 데이터 소스를 갈아끼울 수 있게 한다.

## 현재 상태

- 화면이 데이터 모듈을 직접 import:
  - `screens/ProfileScreen.jsx:12,16` — `GUIDES.find()`, `EXPERIENCES.filter()`
  - `screens/ExperienceDetailScreen.jsx:21,23` — 동일
  - `screens/ListScreen.jsx:19` — `GUIDES.filter()`
  - `screens/ExperiencesScreen.jsx:22-23` — `EXPERIENCES.filter()` + `GUIDES.find()`
  - `screens/HomeScreen.jsx:23` — `EXPERIENCES.slice(0, 3)`
  - `components/cards/ExperienceCard.jsx:10` — `GUIDES.find()`
- 필터 로직(city/style/lang/query)이 화면 컴포넌트 내부에 흩어져 있음
- 데이터 소스 교체 시 7개+ 파일 수정 필요

## 수락 기준

- [x] `lib/repositories/guides.js`, `lib/repositories/experiences.js`, `lib/repositories/reviews.js` 생성
- [x] 각 repository는 다음 표준 인터페이스 제공:
  - `findById(id)` → 단건
  - `list(filters?)` → 다건 (필터링 포함)
  - `listByGuideId(guideId)` (experiences/reviews 전용)
- [x] 필터 로직(city/style/lang/query 매칭)이 repository 내부로 이동
- [x] 화면 컴포넌트는 직접 `GUIDES`/`EXPERIENCES`를 import하지 않음
- [x] 모든 함수가 동기 (현재는 in-memory). 단, 추후 async로 전환 가능하도록 signature는 Promise 친화적으로 유지 가능 (선택)
- [x] `npm run build` 통과
- [x] 기존 필터링 결과/순서 동일 (회귀 없음)

## 구현 메모

```js
// lib/repositories/guides.js
import { GUIDES } from "../data/guides"

export const guidesRepo = {
  findById: (id) => GUIDES.find((g) => g.id === id) ?? null,

  list: (filters = {}) => {
    const { city, style, language, query } = filters
    return GUIDES.filter((g) => {
      if (city && city !== "All" && g.city !== city) return false
      if (style && style !== "All" && !g.styles.includes(style)) return false
      if (language && language !== "All" && !g.languages.includes(language)) return false
      if (query) {
        const q = query.toLowerCase()
        const haystack = [
          g.name, g.city, g.district, g.oneLiner,
          ...g.styles,
        ].join(" ").toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  },
}
```

```js
// lib/repositories/experiences.js
import { EXPERIENCES } from "../data/experiences"
import { guidesRepo } from "./guides"

export const experiencesRepo = {
  findById: (id) => EXPERIENCES.find((e) => e.id === id) ?? null,

  listByGuideId: (guideId) =>
    EXPERIENCES.filter((e) => e.guideId === guideId),

  list: (filters = {}) => {
    const { city, category, query } = filters
    return EXPERIENCES.filter((e) => {
      const guide = guidesRepo.findById(e.guideId)
      if (!guide) return false
      if (city && city !== "All" && guide.city !== city) return false
      if (category && category !== "All" && e.category !== category) return false
      if (query) {
        const q = query.toLowerCase()
        const haystack = [
          e.title, e.summary, e.category,
          guide.name, guide.city,
        ].join(" ").toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  },

  featured: (limit = 3) => EXPERIENCES.slice(0, limit),
}
```

**화면 변경 예시:**
```jsx
// Before
const filtered = useMemo(
  () => GUIDES.filter((g) => { /* 인라인 필터 */ }),
  [city, style, lang, q],
)

// After
const filtered = useMemo(
  () => guidesRepo.list({ city, style, language: lang, query: q }),
  [city, style, lang, q],
)
```

## 위험

- 검색 매칭 로직 변경 시 결과가 미묘하게 달라질 수 있음 (현재 `.includes(q)`는 case-sensitive). 위 예시는 `toLowerCase()` 추가했는데, **현재 동작 보존**이 우선 → 일단 동일 로직으로 옮기고, case-insensitive는 별도 이슈로 분리
- `guidesRepo.list()`에서 다른 repository를 호출하는 순환 import 위험. 필요 시 service 레이어 추가

## 참고

- 관련 파일:
  - `next-app/app/lib/data/{guides,experiences,reviews}.js`
  - `next-app/app/screens/*.jsx` 전부
  - `next-app/app/components/cards/ExperienceCard.jsx`
- 관련 이슈: [[ISSUE-05]] (TS 도입 시 repository 인터페이스를 타입으로 명시)
- Patterns: `~/.claude/rules/common/patterns.md` Repository Pattern

## 작업 로그 / 발견 사항

- 2026-05-17 완료. 신규 파일 3개 (`lib/repositories/{guides,experiences,reviews}.js`), 소비자 6개 파일(`ProfileScreen`, `ExperienceDetailScreen`, `ListScreen`, `ExperiencesScreen`, `HomeScreen`, `ExperienceCard`) 마이그레이션.
- 검색 매칭은 기존 동작 보존을 우선해 case-sensitive `String.prototype.includes`로 유지. case-insensitive 전환은 별도 이슈로 분리 권장.
- `expGallery`, `meetingPlace` (pure 데이터 변환 헬퍼)와 `EXP_CATEGORIES` (파생 상수)는 `lib/data/experiences.js`에 그대로 둠 — repository 책임이 아니라 데이터 모듈의 정적 파생물이라 판단.
- `experiencesRepo.list()` 가 `guidesRepo.findById()`를 호출하지만 모듈 의존 방향이 단방향(experiences → guides)이라 순환 없음. 향후 review/booking이 양방향 의존을 요구하면 service 레이어 도입 검토.
- `npm run build` 통과 (Next 14.2.35, 5 페이지 정적 생성).
