---
id: ISSUE-02
title: next/image로 이미지 컴포넌트 전환
status: open
priority: high
effort: M
depends_on: []
labels: ["perf", "image"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-02: next/image로 이미지 컴포넌트 전환

## 목표

모든 `<img>`를 `next/image`로 전환해 자동 최적화(avif/webp, lazy, srcset, blur placeholder)를 적용한다. LCP·CLS 개선이 목표.

## 현재 상태

- 모든 이미지가 `<img src={...}>` 직접 사용
- Unsplash 외부 CDN (`https://images.unsplash.com/`)
- `next/image` 사용 시 `next.config.js`에 `remotePatterns` 등록 필요
- `lib/photo.js:3-4`에서 URL을 `?w=...&h=...&fit=crop` 쿼리로 직접 빌드 중

**현재 `<img>` 사용처 (주요):**
- `components/ui/Avatar.jsx:38-43` — 아바타
- `components/cards/GuideCard.jsx:14` — 가이드 카드
- `components/cards/ExpPhoto.jsx:30` — 체험 카드
- `screens/HomeScreen.jsx` — hero, featured
- `screens/ProfileScreen.jsx:75` — profile hero
- `screens/ExperienceDetailScreen.jsx:128-156` — gallery (5장)
- `screens/PaymentScreen.jsx:419` — summary 썸네일

## 수락 기준

- [ ] `next.config.js` 생성 + `images.remotePatterns`에 `images.unsplash.com` 등록
- [ ] hero/gallery 메인 이미지는 `priority` + `fetchPriority="high"`
- [ ] 그 외 below-the-fold 이미지는 lazy (기본값)
- [ ] 모든 `Image`에 명시적 `width`/`height` 또는 `fill` + 부모 `position:relative`
- [ ] `lib/photo.js`는 Unsplash ID만 반환하도록 단순화 검토 (또는 그대로 두고 src로 전달)
- [ ] `npm run build` 통과 + Lighthouse LCP 개선 확인 (홈/체험 상세)
- [ ] CLS 0.1 미만
- [ ] 시각적 회귀 없음 (스크린샷 비교 권장)

## 구현 메모

```js
// next.config.js (신규)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
}
module.exports = nextConfig
```

```jsx
// 변환 예시 — ExpPhoto.jsx
import Image from "next/image"

<Image
  src={src}
  alt={alt}
  fill                       // 부모가 position: relative
  sizes="(max-width: 768px) 100vw, 33vw"
  style={{ objectFit: "cover" }}
  onError={() => setErr(true)}
/>
```

**중요 — `<img>` → `<Image>` 치환 시:**
- `loading="lazy"` 제거 (기본값)
- inline `style={{ width: '100%' }}` 같은 자동 sizing은 `fill` 또는 명시 width/height로 대체
- onError fallback 패턴은 그대로 유지 (`Avatar`, `ExpPhoto`)

**Avatar는 특수:**
- src가 빈 문자열일 때 fallback 글자 표시. `Image`는 빈 src에서 throw하므로 conditional render 유지

## 위험

- `<Image>`는 부모 컨테이너의 크기에 민감 → 일부 inline style이 깨질 수 있음
- gallery (ExperienceDetailScreen)는 grid + border-radius 조합 → `fill`로 변환 시 stacking context 주의
- onError에서 background를 직접 변경하는 hack (`screens/ExperienceDetailScreen.jsx:131-136`)은 `Image`에서 동작 안 함 → `ExpPhoto`처럼 conditional render로 변경 필요

## 참고

- 관련 파일:
  - `next-app/app/lib/photo.js`
  - `next-app/app/components/ui/Avatar.jsx`
  - `next-app/app/components/cards/{ExpPhoto,GuideCard,ExperienceCard}.jsx`
  - `next-app/app/screens/*.jsx` 전부
- Next.js docs: https://nextjs.org/docs/app/api-reference/components/image
- Unsplash hot-link 정책 (개발용 OK, 상용 시 Unsplash API 권장)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
