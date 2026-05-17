---
id: ISSUE-07
title: 접근성 — 클릭 가능 div를 button으로 변경
status: open
priority: medium
effort: S
depends_on: []
labels: ["a11y"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-07: 접근성 — 클릭 가능 div를 button으로 변경

## 목표

`onClick`이 붙은 `<div>`를 `<button>` 또는 적절한 ARIA 속성을 가진 요소로 교체. 키보드 네비게이션과 스크린리더 지원.

## 현재 상태

`onClick`이 `<div>`/`<span>`에 직접 붙은 케이스:

- **TopNav 로고** (`components/layout/TopNav.jsx:34`) — 클릭으로 home 이동
- **TopNav 탭** (`components/layout/TopNav.jsx:58`) — `<div className="nav-tab">`
- **GuideCard 전체** (`components/cards/GuideCard.jsx:11`) — `<div className="guide-card">`
- **Breadcrumb row** (ProfileScreen, ExperienceDetailScreen, PaymentScreen 각각) — `<div>` 에 `onClick + cursor: pointer`
- **Profile 페이지 host link** (ExperienceDetailScreen:108) — `<span>` 에 `onClick + textDecoration: underline`

`ExperienceCard`는 `role="button" tabIndex={0}`은 있지만 `onKeyDown` 없음 → Enter/Space로 활성화 불가.

## 수락 기준

- [ ] 모든 클릭 가능 `<div>`/`<span>`이 `<button>` 또는 `<a>`로 교체
- [ ] 또는 `role="button" tabIndex={0}` + `onKeyDown` (Enter/Space) 처리 추가
- [ ] `<button>`은 기본 스타일 무효화 (`appearance: none`, `background: none`, `border: 0`, `padding: 0`, `font: inherit`) — 이미 `globals.css:86`에서 처리됨
- [ ] 키보드만으로 모든 라우팅 가능 (Tab → Enter)
- [ ] focus-visible outline이 명확하게 보임
- [ ] 스크린리더로 각 인터랙티브 요소의 의미가 전달됨 (aria-label 필요한 곳)
- [ ] axe-core 또는 Lighthouse a11y 점수 95+ (기존 점수 확인 후 개선)

## 구현 메모

**Pattern 1 — div → button:**

```jsx
// Before
<div className="nav-tab" onClick={() => navigate(t.target)}>
  <Icon name={t.icon} size={20} />
  <span>{t.label}</span>
</div>

// After
<button
  type="button"
  className="nav-tab"
  onClick={() => navigate(t.target)}
  aria-current={isActive ? "page" : undefined}
>
  <Icon name={t.icon} size={20} />
  <span>{t.label}</span>
</button>
```

**Pattern 2 — 큰 클릭 영역 (Card)는 link wrapper:**

```jsx
// GuideCard — ISSUE-01 (App Router) 완료 후
<Link href={`/guides/${guide.id}`} className="guide-card">
  ...
</Link>
```

ISSUE-01 전이라면 `<article role="link" tabIndex={0} onKeyDown={...}>`.

**Pattern 3 — keyboard handler 추가:**

```jsx
const handleKey = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    onClick()
  }
}

<div role="button" tabIndex={0} onClick={onClick} onKeyDown={handleKey}>
```

**Focus styles 점검:**
- `globals.css`에 `:focus-visible` 정의 있는지 확인. 없다면 추가:
  ```css
  *:focus-visible {
    outline: 2px solid var(--rausch);
    outline-offset: 2px;
    border-radius: 4px;
  }
  ```

## 위험

- 카드 전체를 button으로 만들면 내부 자식 (Heart 같은 nested button)이 nested interactive로 HTML invalid
  - 해결: 카드를 `<article>` 두고 **타이틀에만 link** 또는 **stretched-link** 패턴
- 기존 cursor:pointer 스타일이 `<button>`에서는 자동. 중복 제거

## 참고

- 관련 파일:
  - `next-app/app/components/layout/TopNav.jsx`
  - `next-app/app/components/cards/GuideCard.jsx`
  - `next-app/app/components/cards/ExperienceCard.jsx`
  - `next-app/app/screens/{Profile,ExperienceDetail,Payment}Screen.jsx` (breadcrumb)
- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
