---
id: ISSUE-06
title: 인라인 스타일 정리 → CSS class 추출
status: open
priority: medium
effort: M
depends_on: []
labels: ["refactor", "style"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-06: 인라인 스타일 정리 → CSS class 추출

## 목표

화면 컴포넌트 내부에 흩어진 `style={{...}}` 인라인 스타일을 의미 있는 CSS 클래스 또는 작은 컴포넌트로 추출. 가독성·재사용·반복 제거.

## 현재 상태

큰 화면 파일에서 반복되는 인라인 스타일 패턴:

- **Breadcrumb row** (ProfileScreen:48, ExperienceDetailScreen:55, PaymentScreen:87):
  ```jsx
  <div className="row row-gap-sm" style={{
    marginBottom: 16, color: "var(--muted)",
    cursor: "pointer", width: "fit-content",
  }} onClick={...}>
    <Icon name="arrowLeft" size={16} />
    <span className="t-body-sm">{label}</span>
  </div>
  ```
  → `<Breadcrumb onBack={...}>{label}</Breadcrumb>` 컴포넌트로 추출 가능

- **Container with vertical padding** 패턴:
  ```jsx
  <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
  ```
  → `.container-screen` 같은 CSS class

- **info-grid-item-icon 안의 작은 원형 배경**:
  ```jsx
  <div style={{
    width: 28, height: 28, borderRadius: "50%",
    background: "#fff0f3", display: "inline-flex", ...
  }}>
  ```
  → `.icon-circle` CSS class (ProfileScreen:155-167, HomeScreen:155-166 등 반복)

- **PaymentScreen** 안에 `style={{...}}` 50개+ — 가장 우선 정리 대상

## 수락 기준

- [ ] 반복 패턴 ≥3 회 등장하는 인라인 스타일 ≥80% CSS class로 추출
- [ ] `Breadcrumb` 컴포넌트 추출 (`components/layout/Breadcrumb.jsx`)
- [ ] `IconCircle` 컴포넌트 또는 `.icon-circle` 유틸 클래스 추출
- [ ] `PaymentScreen` 의 inline style 50% 이상 감소
- [ ] 시각적 회귀 없음 (스크린샷 비교)
- [ ] `npm run build` 통과

## 구현 메모

**Phase 1 — 컴포넌트 추출 (재사용 가능한 패턴):**

```jsx
// components/layout/Breadcrumb.jsx
"use client"
import Icon from "../ui/Icon"

export default function Breadcrumb({ onBack, children }) {
  return (
    <button className="breadcrumb" onClick={onBack}>
      <Icon name="arrowLeft" size={16} />
      <span className="t-body-sm">{children}</span>
    </button>
  )
}
```

```css
/* globals.css 에 추가 */
.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: var(--s-sm);
  margin-bottom: var(--s-base);
  color: var(--muted);
  width: fit-content;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.breadcrumb:hover { color: var(--ink); }
```

**Phase 2 — 유틸 CSS class:**

```css
.icon-circle {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #fff0f3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-circle--lg { width: 48px; height: 48px; border-radius: 14px; }

.screen-pad { padding-top: var(--s-lg); padding-bottom: var(--s-section); }
```

**Phase 3 — 색상/스페이싱은 토큰화:**
- 인라인 `marginBottom: 16` → CSS 토큰 `var(--s-base)` 활용
- `background: "#fff0f3"` 같은 하드코딩 색상은 `--surface-accent-soft` 같은 새 토큰 검토

## 위험

- 시각적 회귀가 발생하기 쉬운 영역. 반드시 시각 비교
- CSS 변수와 inline style 혼용 시 specificity 충돌 가능
- PaymentScreen은 크고 복잡 → 한 번에 다 바꾸지 말고 섹션 단위로

## 참고

- 관련 파일:
  - `next-app/app/screens/PaymentScreen.jsx` (가장 inline 많음)
  - `next-app/app/screens/{Profile,ExperienceDetail}Screen.jsx`
  - `next-app/app/globals.css` (디자인 토큰 이미 정리됨)
- Rules: `~/.claude/rules/web/design-quality.md`

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
