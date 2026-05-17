---
id: ISSUE-10
title: ESLint + Prettier 설정
status: open
priority: low
effort: S
depends_on: []
labels: ["dx", "infra"]
created: 2026-05-17
updated: 2026-05-17
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

- (작업 시작 후 채워짐)
