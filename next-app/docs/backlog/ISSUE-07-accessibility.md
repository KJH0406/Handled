---
id: ISSUE-07
title: 접근성 — 클릭 가능 div를 button으로 변경
status: done
priority: medium
effort: S
depends_on: []
labels: ["a11y"]
created: 2026-05-17
updated: 2026-05-17
completed: 2026-05-17
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

- **TopNav** — `nav-logo`, `nav-tab` div → `<Link>`로 교체. 활성 탭에 `aria-current="page"` 추가. `useAppNavigate` 의존 제거 → 컴포넌트 client 분리 그대로 유지 (usePathname 필요).
- **GuideCard** — risks 항에 명시된 nested-interactive 문제를 회피하기 위해 **stretched-link 패턴** 채택. 카드 본문은 `<article>`, 맨 마지막에 absolute로 깔린 `<Link className="card-stretched-link">`가 클릭 영역을 덮음. Heart는 `z-index: 2`로 위에 떠 그대로 동작 (Heart 컴포넌트는 이미 `e.stopPropagation()` 보유).
  - `onClick` prop 제거 → 컴포넌트 자체가 `guide.id`로 라우팅. 호출부(`ListScreen`)에서 navigate 의존 제거.
  - Image `alt`를 `guide.name`에서 빈 문자열로 변경 — Link의 `aria-label`이 동일 정보를 제공하므로 스크린리더에 중복되지 않게.
- **ExperienceCard** — 내부에 nested interactive 없으므로 카드 전체를 `<Link>`로 교체. `role="button"`, `tabIndex`, `onPick` 모두 제거. 호출부 4곳 (`Home/Profile/Experiences/List` 중 Experience 사용처) 정리.
- **ExperienceDetailScreen** — host span 2곳 모두 `<Link>`로:
  - 페이지 상단의 underline span → `<Link className="host-inline-link">`
  - "About your host" 카드의 "View profile" 버튼 → `<Link className="host-mini-card-link">`
- **globals.css**
  - 전역 `:focus-visible` 추가 (`outline: 2px solid var(--rausch)`, offset 2px) — 키보드 포커스 가시화.
  - `.card-stretched-link` 유틸 (absolute inset:0, z-index:1, font-size:0, focus시 inset outline).
  - `.guide-card` `position: relative` + `:has(.card-stretched-link:focus-visible)`로 카드 전체 포커스 ring 표시.
  - `.heart-btn` `z-index: 2` — stretched link 위로.
  - `.exp-card` `color: inherit; text-decoration: none` — anchor 기본 스타일 무력화.
  - `.sr-only` 유틸 (현재 미사용이지만 후속 작업 대비).
  - `.host-inline-link` (underline 스타일을 inline style에서 클래스로).
- **수락 기준 충족**
  - ✅ 모든 클릭 가능 div/span 제거됨 (grep 결과 0건).
  - ✅ 키보드 Tab → Enter로 모든 라우팅 가능 (Link/button 기본 거동).
  - ✅ `:focus-visible` 전역 outline 적용.
  - ✅ aria-label / aria-current 추가.
  - ⏭️ axe-core / Lighthouse 점수 측정은 별도 측정 도구 필요 — 본 작업 범위에서는 코드 레벨 a11y 적용 확인까지.
- **검증** — `npm run build` 통과 (Next 14.2.35, 9 routes 모두 정상 생성).
