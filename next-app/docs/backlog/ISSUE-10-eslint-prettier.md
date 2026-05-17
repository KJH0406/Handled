---
id: ISSUE-10
title: ESLint + Prettier 설정
status: done
priority: low
effort: S
depends_on: []
labels: ["dx", "infra"]
created: 2026-05-17
updated: 2026-05-17
completed: 2026-05-17
---

# ISSUE-10: ESLint + Prettier 설정

## 목표

코드 스타일/품질 자동 점검을 도입. 팀 합류 시 일관성 보장, 흔한 React/Next 실수 사전 방지.

## 현재 상태

- `package.json:9` 에 `"lint": "next lint"` 정의는 있으나 ESLint config 부재 → 실행 시 setup wizard 요구됨
- Prettier 미설정 → 파일마다 들여쓰기/따옴표 일관성 부족 가능

## 수락 기준

- [ ] `eslint-config-next` 적용 + `.eslintrc.json` 생성
- [ ] `prettier` + `eslint-config-prettier` 설치 (eslint와 충돌 방지)
- [ ] `.prettierrc` 생성:
  - 2 space indent, semicolons off, single quote, trailing comma all, print width 80
  - 또는 팀이 합의한 스타일
- [ ] `package.json` scripts 추가:
  - `"lint": "next lint"`
  - `"lint:fix": "next lint --fix"`
  - `"format": "prettier --write ."`
  - `"format:check": "prettier --check ."`
- [ ] 전체 코드에 한 번 `npm run format` 실행 (변경사항은 별도 커밋)
- [ ] `npm run lint` 통과 (0 errors, warning은 허용)
- [ ] `.prettierignore`, `.eslintignore`에 `.next/`, `node_modules/`, `public/` 등 제외

## 구현 메모

```bash
npm install -D eslint eslint-config-next prettier eslint-config-prettier
```

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2
}
```

```
# .prettierignore
.next/
node_modules/
public/
package-lock.json
```

**현재 코드 스타일 분석:**

- 따옴표: 대체로 double `"..."`
- 세미콜론: 없음 (자동 삽입)
- trailing comma: 일관됨

→ 위 prettier 설정이 현재 코드와 호환. 첫 format run 후 큰 diff 없을 예정.

## 위험

- 첫 `prettier --write .` 실행 시 큰 diff 발생 가능 → 별도 PR/커밋으로 분리해서 리뷰 부담 감소
- `react/no-unescaped-entities` 경고가 따옴표 들어간 영문 텍스트 ("\"text\"") 에서 잔뜩 뜰 수 있음 → 위 config에서 off

## 참고

- 관련 파일: 전체
- ESLint Next.js: https://nextjs.org/docs/app/api-reference/config/eslint
- 관련 이슈: [[ISSUE-05]] (TS 도입 시 `@typescript-eslint` 추가)

## 작업 로그 / 발견 사항

- **버전 트랩** — 처음 `npm install -D eslint eslint-config-next` 를 그대로 실행했더니 `eslint@9`, `eslint-config-next@16`이 설치되어 Next 14의 `next lint`가 "Unknown options: useEslintrc, extensions, ..." 로 실패. Next 14의 `next lint`는 ESLint 8 legacy 옵션을 사용 → `eslint@^8.57.1`, `eslint-config-next@14.2.35`로 다운그레이드.
- **TypeScript 통합** — `eslint-config-next`가 내부적으로 `@typescript-eslint/parser`를 포함하므로 별도 설치 없이 `.ts/.tsx` 린트됨. (ISSUE-05 참조 메모의 `@typescript-eslint` 별도 설치는 불필요)
- **설정 파일**
  - `.eslintrc.json` — `next/core-web-vitals` + `prettier`(충돌 방지). `react/no-unescaped-entities` off (영문 따옴표 잔뜩 있음).
  - `.prettierrc` — semi off, double quote (현재 코드 호환), trailingComma all, printWidth 80, tabWidth 2. 이슈 frontmatter의 "single quote"는 typo로 판단(구현 메모의 `singleQuote: false`와 코드 분석 결과 따름).
  - `.prettierignore` — `.next/`, `node_modules/`, `public/`, `package-lock.json`, `next-env.d.ts`.
- **scripts 추가** (`package.json`): `lint:fix`, `format`, `format:check`.
- **format diff** — `npm run format` 첫 실행:
  - `globals.css`: 전체 indent 정규화 (이전엔 wrapper로 6 space 들여썼는데 root 레벨로 평탄화) — 시각적 동일.
  - `next.config.mjs`, `package.json`: 미세 변경.
  - 일부 screen/components(`ExperienceDetailScreen`, `ExperiencesScreen`, `PaymentScreen`, `ProfileScreen`, `TopNav`, `ListScreen` 등): wrap/indent 미세 조정만.
  - 모든 docs `.md` 파일: 테이블 정렬 + 코드블록 indent 정규화. **모든 backlog 이슈 파일이 reformat됨** (내용 동일).
- **검증**
  - ✅ `npm run lint` — 0 errors, 0 warnings.
  - ✅ `npm run format:check` — All matched files use Prettier code style.
  - ✅ `npm run build` — 11 routes 정상.
