# Handled — Refactoring Backlog

> 이 문서는 인덱스입니다. 작업 시작 전 반드시 `HOW_TO_RESUME.md`를 먼저 읽으세요.
> 각 이슈의 상세는 `backlog/ISSUE-XX-*.md` 파일에 있습니다.

**Last updated:** 2026-05-17
**Current sprint focus:** High priority (1, 2, 4 묶음 권장 — App Router + next/image + Repository pattern)

---

## High priority

| ID                                           | Title                                      | Status | Effort | Depends on |
| -------------------------------------------- | ------------------------------------------ | ------ | ------ | ---------- |
| [01](backlog/ISSUE-01-app-router.md)         | Next.js App Router 실 라우팅 전환          | done   | L      | —          |
| [02](backlog/ISSUE-02-next-image.md)         | `next/image`로 이미지 전환                 | done   | M      | —          |
| [03](backlog/ISSUE-03-next-font.md)          | Pretendard 셀프 호스팅 (`next/font/local`) | done   | S      | —          |
| [04](backlog/ISSUE-04-repository-pattern.md) | 데이터 레이어 추상화 (Repository pattern)  | done   | M      | —          |

## Medium priority

| ID                                      | Title                               | Status  | Effort | Depends on |
| --------------------------------------- | ----------------------------------- | ------- | ------ | ---------- |
| [05](backlog/ISSUE-05-typescript.md)    | TypeScript 도입 (점진적)            | done    | L      | —          |
| [06](backlog/ISSUE-06-inline-styles.md) | 인라인 스타일 정리 → CSS class 추출 | done    | M      | —          |
| [07](backlog/ISSUE-07-accessibility.md) | 접근성 — 클릭 가능 div를 button으로 | done    | S      | —          |
| [08](backlog/ISSUE-08-tests.md)         | E2E + 유닛 테스트 도입              | dropped | M      | —          |
| [09](backlog/ISSUE-09-metadata.md)      | 화면별 metadata 분리 (SEO/OG)       | done    | S      | 01         |

## Low priority

| ID                                               | Title                                   | Status | Effort | Depends on |
| ------------------------------------------------ | --------------------------------------- | ------ | ------ | ---------- |
| [10](backlog/ISSUE-10-eslint-prettier.md)        | ESLint + Prettier 설정                  | done   | S      | —          |
| [11](backlog/ISSUE-11-payment-dynamic-import.md) | PaymentScreen dynamic import            | dropped | S      | —          |
| [12](backlog/ISSUE-12-search-debounce.md)        | 검색 인풋 디바운싱                      | done   | S      | —          |
| [13](backlog/ISSUE-13-payment-mock-extract.md)   | 결제 mock 분리 → `lib/payments/`        | done   | S      | —          |
| [14](backlog/ISSUE-14-i18n.md)                   | i18n 준비 (`next-intl`)                 | open   | L      | —          |
| [15](backlog/ISSUE-15-error-boundary.md)         | `app/error.js`, `app/not-found.js` 추가 | open   | S      | —          |

---

## Status legend

- 🟢 `done` — 완료
- 🟡 `in-progress` — 작업 중
- ⚪ `open` — 미착수
- 🔴 `blocked` — 막힘
- ⚫ `dropped` — 진행 안 함

## 권장 작업 순서

1. **번들 묶음 1** (구조 기반): `03` → `10` → `02` → `15` — 빠른 quick win 4개
2. **번들 묶음 2** (라우팅·데이터): `04` → `01` → `09` — App Router 전환 + repository
3. **번들 묶음 3** (코드 품질): `05` → `06` → `07` → `08` — TS + 정리 + 테스트
4. **번들 묶음 4** (개별 개선): `11`, `12`, `13`, `14` — 우선순위 낮음, 필요 시점에
