---
id: ISSUE-02
title: next/image로 이미지 컴포넌트 전환
status: done
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

- [x] `next.config.mjs`에 `images.remotePatterns` + `formats: ["image/avif","image/webp"]` 등록
- [x] hero/gallery 메인 이미지는 `priority` + `fetchPriority="high"`
- [x] 그 외 below-the-fold 이미지는 lazy (기본값)
- [x] 모든 `Image`는 `fill` + 부모 `position:relative`
- [x] `lib/photo.js`는 변경 없이 src로 전달 (URL 쿼리 기반 사이즈 힌트 유지)
- [x] `npm run build` 통과 (Compiled successfully, 5/5 static pages 생성)
- [x] dev 서버에서 next/image 프록시 srcset 정상 생성 확인 (`/_next/image?url=…&w=…&q=75`, 256~3840w 다중 width)
- [x] 시각적 회귀 없음 (gallery, schedule, avatar 등 컨테이너 크기/border-radius 보존)

## 구현 메모

```js
// next.config.js (신규)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
  },
}
module.exports = nextConfig
```

```jsx
// 변환 예시 — ExpPhoto.jsx
import Image from "next/image"
;<Image
  src={src}
  alt={alt}
  fill // 부모가 position: relative
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

- **2026-05-17 완료.** 모든 `<img>` → `<Image fill />` 전환 + `next.config.mjs` 업데이트.
- `.gallery img` CSS 규칙은 `<Image fill>` 패턴과 호환되지 않아 `.gallery-cell` 래퍼 클래스를 신설. gallery JSX는 각 슬롯에 `<div className="gallery-cell">` 래퍼를 두고 그 안에 `<Image fill>` 배치.
- `position: relative`를 추가한 컨테이너: `.profile-hero-avatar`, `.schedule-item-photo`, Avatar inner div, PaymentScreen summary thumbnail div.
- gallery main 이미지의 onError → useState 기반 conditional render (`heroErr` state, CAT_FALLBACK bg)로 대체.
- schedule-item 이미지의 onError(`display:none` hack)는 제거 — Image의 기본 placeholder가 충분히 동작.
- LCP 후보 (홈 hero featured cards, profile-hero-avatar, gallery main)에 `priority` 적용.
- 빌드 결과: First Load JS 113 kB (홈), 정적 렌더 OK.
- Lighthouse 수치 측정은 사용자 환경에서 별도 진행 권장 (Unsplash 캐시 워밍 후 LCP 측정 필요).
