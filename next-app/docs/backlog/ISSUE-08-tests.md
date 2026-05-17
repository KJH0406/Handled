---
id: ISSUE-08
title: E2E + 유닛 테스트 도입
status: open
priority: medium
effort: M
depends_on: []
labels: ["test"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-08: E2E + 유닛 테스트 도입

## 목표

회귀 방지를 위한 최소 안전망 구축. Golden path E2E 1개 + 순수 함수 유닛 테스트.

## 현재 상태

- 테스트 0개
- `package.json`에 test script 없음
- 리팩토링 시 회귀 여부를 수동 확인에 의존

## 수락 기준

- [ ] **Playwright** 설치 + 설정
- [ ] E2E 시나리오 최소 3개:
  1. **Golden path**: Home → Experiences 클릭 → 카드 클릭 → 날짜 선택 → Reserve → 결제 입력 → Pay → Confirm 화면 도달
  2. **Search & filter**: Home에서 "Seoul" 검색 → Experiences 화면에서 결과 노출
  3. **Profile flow**: Home → "View all" → Guide 카드 클릭 → Profile 화면 표시
- [ ] **Vitest** 설치 + 설정
- [ ] 유닛 테스트:
  - `lib/format.test.js` — `usd`, `formatDate`, `shortDate`
  - `lib/data/experiences.test.js` — `expGallery`, `meetingPlace`
  - (ISSUE-04 완료 시) `lib/repositories/*.test.js` — 필터링 로직
- [ ] `package.json`:
  - `"test": "vitest run"`
  - `"test:e2e": "playwright test"`
  - `"test:watch": "vitest"`
- [ ] CI 적합한 출력 (JUnit/JSON reporter)
- [ ] README 또는 docs에 실행 방법 명시

## 구현 메모

```bash
# Playwright
npm install -D @playwright/test
npx playwright install --with-deps chromium

# Vitest
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

```js
// playwright.config.js
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

```js
// e2e/golden-path.spec.js
import { test, expect } from "@playwright/test"

test("user can book an experience end-to-end", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

  await page
    .getByRole("button", { name: /experiences/i })
    .first()
    .click()
  await page.getByRole("button", { name: /Real Seoul Food Crawl/i }).click()

  // pick first available date
  await page.getByText("Select date").click()
  await page.locator(".cal-day:not(:disabled)").first().click()

  await page.getByRole("button", { name: /Reserve this experience/i }).click()

  // fill payment
  await page.getByLabel(/Cardholder name/i).fill("HONG GILDONG")
  await page.getByLabel(/Card number/i).fill("4242424242424242")
  await page.getByLabel(/Expiry/i).fill("1230")
  await page.getByLabel(/CVC/i).fill("123")
  await page.getByLabel(/ZIP/i).fill("10001")

  await page.getByRole("button", { name: /^Pay /i }).click()

  await expect(page.getByText(/Booking confirmed/i)).toBeVisible({
    timeout: 5000,
  })
})
```

```js
// lib/format.test.js
import { describe, it, expect } from "vitest"
import { usd, formatDate, shortDate } from "./format"

describe("usd", () => {
  it("formats numbers with $ and comma", () => {
    expect(usd(1000)).toBe("$1,000")
    expect(usd(0)).toBe("$0")
    expect(usd(1234.5)).toBe("$1,235") // rounded
  })
})

describe("formatDate", () => {
  it("returns long form date", () => {
    const d = new Date(2026, 4, 17) // May 17, 2026 (Sunday)
    expect(formatDate(d)).toBe("Sun, May 17, 2026")
  })
  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("")
  })
})
```

## 위험

- Playwright 첫 설치 시 브라우저 다운로드로 시간 소요
- E2E는 dev server 의존 → 느림. CI에서는 production build + start 권장
- 결제 화면의 setTimeout(1500) 때문에 E2E timeout 여유 필요

## 참고

- 관련 파일: 전체 (테스트 추가)
- Rules: `~/.claude/rules/web/testing.md`, `~/.claude/rules/common/testing.md`
- Playwright: https://playwright.dev/
- Vitest: https://vitest.dev/
- 관련 이슈: [[ISSUE-04]] (repository 추출 후 테스트가 훨씬 깔끔), [[ISSUE-13]] (결제 mock 분리 후 테스트 결정성↑)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
