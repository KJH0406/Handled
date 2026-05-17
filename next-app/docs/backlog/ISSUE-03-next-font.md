---
id: ISSUE-03
title: Pretendard 셀프 호스팅 (next/font/local)
status: done
priority: high
effort: S
depends_on: []
labels: ["perf", "infra"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-03: Pretendard 셀프 호스팅 (next/font/local)

## 목표

외부 CDN(jsdelivr)에서 Pretendard 로드하는 현재 방식을 `next/font`로 전환하여 FOIT/CLS 제거, CSP/privacy 강화, 빌드 타임 자동 최적화 확보.

## 현재 상태

- `next-app/app/layout.js:11-16` — `<link rel="preconnect">` + `<link rel="stylesheet" href="https://cdn.jsdelivr.net/...">`
- 외부 CDN 의존 → 네트워크 차단된 환경에서 fallback 폰트로 떨어짐
- FOIT (Flash of Invisible Text) 가능성
- 폰트 다운로드가 critical path에 있음

## 수락 기준

- [ ] `next/font/local` 또는 `@fontsource/pretendard` 사용
- [ ] `layout.js`에서 jsdelivr `<link>` 제거
- [ ] `globals.css`의 `--font` 변수는 그대로 사용 (font-family 체인 보존)
- [ ] `font-display: swap` 적용
- [ ] `npm run build` 통과 + 폰트 파일이 `.next/static/media/`에 번들됨
- [ ] 시각적 회귀 없음 (typography weight 동일)
- [ ] Lighthouse "Eliminate render-blocking resources" 항목 개선

## 구현 메모

**옵션 A — `next/font/local` (권장, 폰트 파일 직접 보관):**

1. Pretendard variable woff2 다운로드:

   ```bash
   curl -L -o next-app/app/fonts/PretendardVariable.woff2 \
     https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2
   ```

2. `layout.js`:

   ```js
   import localFont from "next/font/local"

   const pretendard = localFont({
     src: "./fonts/PretendardVariable.woff2",
     display: "swap",
     weight: "45 920",
     variable: "--font-pretendard",
   })

   export default function RootLayout({ children }) {
     return (
       <html lang="en" className={pretendard.variable}>
         <body>...</body>
       </html>
     )
   }
   ```

3. `globals.css`의 `--font` 정의를 `var(--font-pretendard)` 또는 그대로 두고 자연 폴백

**옵션 B — `@fontsource/pretendard`:**

```bash
npm install @fontsource-variable/pretendard
```

```js
// layout.js
import "@fontsource-variable/pretendard"
```

옵션 A를 추천. 빌드 타임 inline preload + critical CSS 인라인 자동 처리.

## 위험

- 폰트 파일 누락 시 빌드 실패 (경로 오타 주의)
- variable font의 `weight: "45 920"` range가 Pretendard 스펙과 일치하는지 확인
- `font-feature-settings: "ss06" on, "ss07" on, "ss10" on` (globals.css:75) 가 variable font에서도 동작하는지 확인

## 참고

- 관련 파일:
  - `next-app/app/layout.js`
  - `next-app/app/globals.css:50-52`
  - `next-app/app/fonts/` (이미 존재하는 빈 디렉토리)
- Pretendard: https://github.com/orioncactus/pretendard
- next/font/local: https://nextjs.org/docs/app/api-reference/components/font#local-fonts

## 작업 로그 / 발견 사항

- 이미 `next-app/app/fonts/` 디렉토리가 존재함 (additional working directory에 포함됨) — 여기에 woff2를 두면 됨
- **2026-05-17 완료** (옵션 A 채택):
  - `next-app/app/fonts/PretendardVariable.woff2` 다운로드 (2.0 MB, GitHub orioncactus/pretendard v1.3.9 계열 main 브랜치)
  - `layout.js`: `localFont({ src, display: "swap", weight: "45 920", variable: "--font-pretendard" })`, `<html className={pretendard.variable}>`. jsdelivr `<link>` 2개 제거.
  - `globals.css`: `--font` 체인 맨 앞에 `var(--font-pretendard)` 추가, 기존 `"Pretendard Variable", Pretendard, ...` 폴백은 보존
  - `npm run build` 통과. `.next/static/media/ff840cfebfb63b0c-s.p.woff2`로 번들됨 (`.p` suffix는 Next가 preload로 마킹했다는 뜻)
  - 빌드 산출물에서 `cdn.jsdelivr` 잔존 참조 0건 확인
- 회귀 리스크: 시각적 비교는 사용자 수동 확인 필요. 동일 variable font + 동일 weight range + `font-feature-settings: ss06/ss07/ss10`은 globals.css에 그대로 남아있어 자형 차이는 없을 것으로 예상.
