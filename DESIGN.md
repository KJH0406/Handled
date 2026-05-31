# Handled 디자인 시스템

이 문서는 Handled 웹앱의 디자인 시스템 **단일 기준(source of truth)** 이다. 토큰·컴포넌트·접근성 규칙을 정의한다.

- 모든 토큰은 `app/globals.css`의 `:root`에 CSS 변수로 정의된다.
- 스타일링은 **글로벌 CSS 클래스 + CSS 변수** 방식이다(Tailwind/CSS Modules 미사용).
- 이 시스템은 *실제 코드에 쓰인 값에서 추출·수렴*한 결과이며, 임의의 트렌드가 아니다.
- 개선 항목은 **명명된 표준**(WCAG 2.1/2.2, Nielsen 휴리스틱, Apple HIG 44px)에 근거한다.

> **브랜드 팔레트는 고정이다.** Classic Blue `#0f4c81` + Deep Coral `#ea6863`는 CPO 지정 리브랜딩 결과다. 새 색을 만들지 말고 이 토큰으로 수렴한다.

---

## 1. 디자인 토큰

### 1.1 색상

| 그룹 | 토큰 | 값 | 용도 |
|---|---|---|---|
| 표면 | `--canvas` | `#ffffff` | 기본 배경 |
| | `--surface-soft` / `--surface-strong` | `#f7f7f7` / `#f2f2f2` | 보조 배경, hover |
| | `--hairline` / `--hairline-soft` | `#dddddd` / `#ebebeb` | 구분선·테두리 |
| | `--border-strong` | `#c1c1c1` | 강조 테두리 |
| 텍스트 | `--ink` | `#222222` | 제목·강조 (10.5:1) |
| | `--body` | `#3f3f3f` | 본문 (10.5:1) |
| | `--muted` | `#6a6a6a` | 보조 텍스트 (5.4:1, AA 통과) |
| | `--muted-soft` | `#929292` | **비활성/placeholder/비텍스트 전용** (3.1:1) |
| | `--on-primary` | `#ffffff` | 컬러 배경 위 텍스트 |
| | `--on-primary-muted` | `rgba(255,255,255,.72)` | 컬러(남색) 배경 위 보조 텍스트 |
| 브랜드 | `--primary` (+`-dark`/`-mid`/`-light`/`-active`/`-disabled`) | `#0f4c81` … | 주 액션·링크 (흰 위 8.9:1) |
| | `--coral` (+`-dark`/`-mid`/`-light`) | `#ea6863` … | 보조 강조 (**텍스트엔 `--coral-dark`**) |
| | `--gold` / `--gold-bg` | `#f0a830` / `#fef8ec` | 별점·스포트라이트 |
| 상태 | `--error` / `--error-hover` | `#c13515` / `#b32505` | 에러 |
| 소셜 | `--brand-facebook` / `--brand-line` | `#1877f2` / `#06c755` | 소셜 로그인 버튼(3rd-party 예외) |
| 그림자 | `--shadow-sm` / `--shadow-md` / `--shadow-lg` / `--shadow-hover` | — | 4단 elevation |
| 오버레이 | `--scrim` / `--scrim-strong` | `rgba(0,0,0,.5)` / `.64` | 모달 딤 |
| | `--overlay-hover` / `--overlay-press` | `rgba(0,0,0,.06)` / `.1` | 표면 상호작용 |

**대비 규칙 (WCAG 1.4.3 AA, 4.5:1):**
- 실제 텍스트는 `--muted` 이상만 사용. `--muted-soft`는 비활성·placeholder·비텍스트 아이콘에만.
- `--coral`은 채움/테두리용. 텍스트가 필요하면 `--coral-dark`.

### 1.2 타이포그래피

폰트: Pretendard Variable (`--font`). 스케일은 **균형형**(본문 16 기준).

| size 토큰 | 값 | leading 토큰 | 값 | weight 토큰 | 값 |
|---|---|---|---|---|---|
| `--text-rating` | 64px | `--leading-tight` | 1.15 | `--weight-regular` | 400 |
| `--text-display-xl` | clamp(28,4.4vw,44) | `--leading-snug` | 1.3 | `--weight-medium` | 500 |
| `--text-display` | 32px | `--leading-normal` | 1.5 | `--weight-semibold` | 600 |
| `--text-title-lg` | 24px | `--leading-relaxed` | 1.7 | `--weight-bold` | 700 |
| `--text-title` | 20px | | | | |
| `--text-heading` | 16px | tracking: `--tracking-tight` -0.02em / `--tracking-normal` 0 / `--tracking-wide` 0.04em |
| `--text-body` | 16px | |
| `--text-body-sm` | 14px | |
| `--text-caption` | 12px | |
| `--text-micro` | 11px | |

**유틸 클래스**(이 토큰들을 조합, `className`으로 사용): `.t-rating` `.t-display-xl` `.t-display` `.t-display-lg`(=title-lg) `.t-display-md`/`.t-display-sm`(=title) `.t-title-md`/`.t-title-sm`(=heading) `.t-body-md`/`.t-body-sm` `.t-caption`/`.t-caption-sm` `.t-badge`/`.t-uppercase-tag`(=micro).
- 인라인 `style`로 `fontSize`/`fontWeight`를 직접 지정하지 말 것 — 위 클래스나 `var(--text-*)`/`var(--weight-*)` 사용.
- 웨이트는 **4종만**(400/500/600/700). 800/900 사용 금지.

### 1.3 간격 (4px 그리드)

`--s-xxs`2 · `--s-xs`4 · `--s-sm`8 · `--s-md`12 · `--s-base`16 · `--s-20`20 · `--s-lg`24 · `--s-xl`32 · `--s-40`40 · `--s-xxl`48 · `--s-section`64

- 인라인 raw px 대신 `var(--s-*)` 또는 `.stack-*`/`.row-gap-*`/`.mb-*` 유틸 사용.
- off-grid 값(6/10/14/18/28)은 인접 토큰으로 스냅.

### 1.4 radius / z-index / motion

- **radius**: `--r-xs`4 · `--r-sm`8 · `--r-md`14 · `--r-lg`32 · `--r-full`9999. (원형은 `--r-full`, `50%`/`999`/raw 금지)
- **z-index**(레이어): `--z-raised`1 · `--z-sticky`100 · `--z-overlay`200 · `--z-modal`300 · `--z-popover`400 · `--z-toast`500.
- **motion**: `--duration-fast`.15s · `--duration-base`.2s · `--duration-slow`.4s · `--ease-standard`. `prefers-reduced-motion` 존중.

### 1.5 브레이크포인트(표준)

**480 / 744 / 1024 / 1280** (max-width 기준)을 go-forward 표준으로 한다. CSS 미디어쿼리는 변수를 못 쓰므로 상수로 통일한다. 신규 반응형은 이 4단만 사용.

---

## 2. 컴포넌트

모든 인터랙티브 요소는 **hover / focus-visible / active / disabled** 상태를 가진다. 포커스는 전역 `:focus-visible { outline: 2px solid var(--primary) }`로 처리(개별 box-shadow 링 금지 — 조상 `overflow:hidden`에 잘림).

### 2.1 버튼 `.btn`

- 베이스: `min-height:44px`, `radius:--r-sm`, `--text-body`/`--weight-medium`.
- 변형: `.btn-primary`(파랑 채움) · `.btn-secondary`(ink 테두리) · `.btn-tertiary`(고스트, 컴팩트) · `.btn-pill`(필터 맥락) · `.btn-block`(full-width) · `.icon-btn`(아이콘 원형).
- 상태: `:disabled`/`[aria-disabled]` = opacity .5 + not-allowed(전 변형 일관). hover/active는 `:not(:disabled)` 가드.
- 로딩: `.btn--loading` = 라벨 숨김 + `::after` 스피너(`--btn-spinner` 색은 변형별). JSX에서 `aria-busy`+`disabled` 동반.
- CTA는 라운드 사각(`--r-sm`), 필터/태그류는 `.btn-pill`.

### 2.2 폼 / 인풋

표준 패턴(인증·결제·플래너 공통):
```jsx
<div className="field">
  <label htmlFor="x">라벨</label>            {/* 상단 고정 라벨, htmlFor 필수 */}
  <input id="x" className="input" aria-invalid={err||undefined}
         aria-describedby={err ? "x-error" : undefined} />
</div>
{err && <div id="x-error" className="help-error" role="alert">…</div>}
```
- `.input`: `min-height:44`, `radius:--r-sm`, focus 시 `border-color:--ink`(+전역 outline). 에러는 `.input[aria-invalid="true"]` 또는 `.input.error`.
- **아이콘/액션 동반 인풋** `.input-affix`(언더라인식 `.auth-input-row`를 대체·통일): `.affix-icon`(선행 아이콘) + `<input>` + `.affix-action`(예: 비밀번호 👁 토글, `aria-pressed`). `data-invalid`로 에러 테두리.
- **라벨 규칙(WCAG 1.3.1/4.1.2)**: 모든 입력은 `<label htmlFor>`로 프로그램 연결. placeholder를 라벨로 쓰지 말 것(예시 힌트로만).
- **검증 피드백(WCAG 3.3.1)**: 에러는 `aria-invalid` + `aria-describedby` + `role="alert"`(라이브 영역)로 알린다.

### 2.3 카드 (하이브리드 표면)

- `.card`: 기본은 **보더 플랫**(`--hairline-soft` + `--r-md`).
- `.card--interactive`: 클릭 가능한 카드에 부여 → hover 시 `--shadow-hover` + `translateY(-2px)` 부상. 정보 카드(비클릭)는 플랫 유지.

### 2.4 칩 / 태그 / 배지

- `.chip`: 인터랙티브 필터(hover/`.active`). · `.tag`: 정적 라벨. · `.badge-pill`: 알림/카운트 마이크로(`--text-micro`).
- 의미가 겹치면 위 3종으로 수렴.

### 2.5 모달 / 오버레이

- `.modal-overlay`: `--scrim` 배경 + `--z-modal`. `role="dialog"`/`aria-modal`. · `.modal-card`: `--shadow-lg`.

### 2.6 리스팅 페이지 패턴 (스토리 / 경험)

- **`.page-intro`** (남색 히어로): 상단 소개 섹션을 `--primary-dark`→`--primary` 그라데이션 배경으로 깔아 본문(흰 배경)과 시각 분리. 내부 텍스트는 `.ink`→`--on-primary`, `.muted`→`--on-primary-muted`로 자동 반전. 키커는 `.page-intro-kicker`(아이콘 stroke/fill을 `--on-primary`로) 사용.
- **`.listing-toolbar`**: 검색 + 필터를 하나의 카드(`--canvas`+`--hairline`+`--shadow-sm`)로 묶어 "툴바"로 인식되게 함. `.listing-toolbar-search`(하단 hairline 구분선 동반) + `.listing-toolbar-filters`(`FilterRow` 묶음). 개별 요소가 떠 보이지 않도록 그룹화하는 것이 목적.

---

## 3. 접근성 체크리스트

- [ ] **대비**: 본문 텍스트 ≥ `--muted`(4.5:1). `--muted-soft`는 비활성/placeholder만.
- [ ] **터치 타깃 44px**(WCAG 2.5.5 / Apple HIG): 작은 아이콘 버튼은 시각 크기를 유지하되 `::after { inset: -Npx }`로 탭 영역을 44px로 확장(`.icon-btn`, `.heart-btn` 참고).
- [ ] **포커스 가시성**(2.4.7): 전역 `:focus-visible` outline에 의존. 제거 금지.
- [ ] **시맨틱**: 클릭 요소는 `<button>`/`<a>`. `<div onClick>` 금지.
- [ ] **폼**: `<label htmlFor>`, `aria-invalid`, `aria-describedby`, 에러 `role="alert"`.
- [ ] **모션**: `prefers-reduced-motion: reduce` 존중.
- [ ] **이미지**: `alt` 제공(장식은 `alt=""`/`aria-hidden`).

---

## 4. 유지보수 규칙

1. **새 색/사이즈/간격을 하드코딩하지 말 것.** 토큰에 없으면 먼저 토큰을 추가·논의.
2. 인라인 `style`은 레이아웃(grid/flex/position)에 한정. 색/타이포/radius/간격은 토큰/클래스로.
3. 컴포넌트는 이중화하지 말 것(과거 `.btn-*`/`.auth-btn`, `.input`/`.auth-input-row` 통합 완료). 새 변형은 기존 베이스에 modifier로.
4. 브랜드 색은 CPO 디렉티브. 변경 시 이 문서 + `:root` + 목업을 동기화.

> 참고: `reference-old/`(구 목업 v7·구 DESIGN.md)는 *역사적 자료*이며 기준이 아니다. 본 문서가 기준이다.
