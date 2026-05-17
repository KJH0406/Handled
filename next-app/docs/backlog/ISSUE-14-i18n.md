---
id: ISSUE-14
title: i18n 준비 (next-intl)
status: open
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

- (작업 시작 후 채워짐)
