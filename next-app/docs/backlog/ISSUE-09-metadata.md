---
id: ISSUE-09
title: 화면별 metadata 분리 (SEO/OG)
status: open
priority: medium
effort: S
depends_on: ["ISSUE-01"]
labels: ["seo"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-09: 화면별 metadata 분리 (SEO/OG)

## 목표

각 라우트에 동적 metadata를 부여해 검색 노출, OG 카드 (카카오톡/슬랙 미리보기), 브라우저 탭 제목을 화면별로 적절하게 설정.

## 현재 상태

- `next-app/app/layout.js:3-6` — 전체 사이트가 단일 metadata 사용:
  ```js
  export const metadata = {
    title: "Handled — Korean local experiences",
    description: "Discover authentic Korean local experiences hosted by people you trust.",
  }
  ```
- OG 이미지 없음
- 화면별 제목 변경 없음 (브라우저 탭이 항상 동일)

## 수락 기준

- [ ] **선행 조건: ISSUE-01 (App Router) 완료** — 라우트별 page.js가 존재해야 metadata 분리 가능
- [ ] 각 page.js에 `export const metadata` 또는 `generateMetadata` 추가:
  - `/` — Home
  - `/guides` — "Find a local guide — Handled"
  - `/guides/[guideId]` — `"{guide.name} · {guide.city} guide — Handled"` (동적)
  - `/experiences` — "All Korean experiences — Handled"
  - `/experiences/[expId]` — `"{exp.title} — {guide.name} · Handled"` (동적)
  - `/checkout`, `/checkout/confirmed` — `noindex` (재방문성 없음)
- [ ] OpenGraph 이미지 추가 (`app/opengraph-image.png` + 라우트별 동적 OG는 선택)
- [ ] Twitter Card metadata
- [ ] `robots.txt` 또는 `app/robots.js`
- [ ] `sitemap.xml` 또는 `app/sitemap.js`
- [ ] `npm run build` 통과
- [ ] Lighthouse SEO 점수 90+

## 구현 메모

```js
// app/guides/[guideId]/page.js
import { guidesRepo } from "@/lib/repositories/guides"

export async function generateMetadata({ params }) {
  const guide = guidesRepo.findById(params.guideId)
  if (!guide) return { title: "Guide not found — Handled" }

  return {
    title: `${guide.name} · ${guide.city} guide — Handled`,
    description: guide.oneLiner,
    openGraph: {
      title: `Tour ${guide.city} with ${guide.name}`,
      description: guide.oneLiner,
      images: [{ url: guide.photo, width: 800, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.name} · ${guide.city} guide — Handled`,
      description: guide.oneLiner,
      images: [guide.photo],
    },
  }
}
```

```js
// app/checkout/layout.js
export const metadata = {
  robots: { index: false, follow: false },
}
```

```js
// app/sitemap.js
import { guidesRepo } from "@/lib/repositories/guides"
import { experiencesRepo } from "@/lib/repositories/experiences"

export default function sitemap() {
  const base = "https://handled.example"
  const guides = guidesRepo.list().map((g) => ({
    url: `${base}/guides/${g.id}`,
    lastModified: new Date(),
  }))
  const experiences = experiencesRepo.list().map((e) => ({
    url: `${base}/experiences/${e.id}`,
    lastModified: new Date(),
  }))
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/guides`, lastModified: new Date() },
    { url: `${base}/experiences`, lastModified: new Date() },
    ...guides,
    ...experiences,
  ]
}
```

## 위험

- 도메인 미정 (`handled.example`은 placeholder) → sitemap.js 작성 전 실제 도메인 결정 필요. 우선은 env var로 빼기
- OG 이미지가 hot-linked Unsplash라면 캐싱·rate-limit 문제 → 자체 호스팅 고려

## 참고

- 관련 파일:
  - `next-app/app/layout.js` (기존 metadata)
  - ISSUE-01 이후 생성될 모든 `app/**/page.js`
- Next.js metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- 관련 이슈: [[ISSUE-01]] (필수 선행), [[ISSUE-04]] (repository로 데이터 조회)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
