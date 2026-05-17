# 다음 세션 시작 가이드

이 문서는 **새 세션에서 컨텍스트가 초기화된 상태**에서 리팩토링 백로그를 이어 작업하기 위한 단일 진입점입니다.

---

## 한 줄 요청 (복붙해서 새 세션에 붙여넣기)

> `next-app/docs/HOW_TO_RESUME.md`와 `next-app/docs/BACKLOG.md`를 읽고, 가장 우선순위 높은 미해결 이슈를 골라 작업해주세요. 작업 시작 전 해당 이슈 파일을 정독하고 acceptance criteria를 모두 충족시킨 뒤 status를 `done`으로 업데이트해주세요.

---

## 세션 시작 시 에이전트가 해야 할 일 (체크리스트)

1. **상태 파악**
   - `next-app/docs/BACKLOG.md` 읽기 → 이슈 인덱스, status, priority 확인
   - `git status`, `git log -5 --oneline` 으로 마지막 작업 지점 확인
   - 사용자에게 어떤 이슈를 진행할지 확인 (또는 `priority: high` 중 가장 위 미해결 자동 선택)

2. **작업 시작**
   - 해당 `docs/backlog/ISSUE-XX-*.md` 정독
   - `status: open` → `status: in-progress`로 변경 (해당 이슈 파일 frontmatter)
   - `BACKLOG.md` 인덱스도 동일하게 갱신
   - **이슈 파일의 `Acceptance criteria` 와 `Implementation notes` 를 그대로 따라 작업**

3. **작업 중**
   - 새로 발견한 잔여 항목/리스크는 즉시 이슈 파일의 `Notes / discoveries` 섹션에 append
   - 의존 이슈가 보이면 `Dependencies` 섹션 갱신

4. **작업 완료 시**
   - `npm run build` 통과 확인
   - 가능하면 dev server에서 수동 회귀 확인
   - 이슈 파일 status → `done`, BACKLOG.md 갱신
   - 커밋 (사용자 승인 시): `feat:`/`refactor:`/`fix:` prefix + 이슈 ID 본문 포함
     ```
     refactor: ISSUE-02 next/image로 이미지 컴포넌트 전환
     ```
   - 다음 우선순위 이슈로 이동할지 사용자 확인

---

## 디렉토리 구조

```
next-app/docs/
├── HOW_TO_RESUME.md       ← 이 파일
├── BACKLOG.md             ← 이슈 인덱스 (status/priority 일람)
└── backlog/
    ├── _TEMPLATE.md       ← 새 이슈 생성 시 복사 시작점
    └── ISSUE-XX-*.md      ← 개별 이슈
```

## 이슈 파일 명명 규칙

- `ISSUE-` + `2자리 번호` + `-` + `kebab-case-slug` + `.md`
- 예: `ISSUE-01-app-router.md`, `ISSUE-12-search-debounce.md`
- 번호는 순차, 절대 재사용하지 않음 (done 처리해도 번호는 보존)

## Status 값

- `open` — 미착수
- `in-progress` — 작업 중 (한 번에 1개만 권장)
- `blocked` — 의존성 또는 외부 요인으로 막힘 (이유 명시 필수)
- `done` — 완료 (acceptance criteria 전부 충족 + 빌드 통과)
- `dropped` — 더 이상 진행하지 않기로 결정 (사유 명시 필수)

## Priority 정의

- `high` — 확장성/유지보수에 직결. 다음 단계 작업의 기반이 됨
- `medium` — 품질·안정성 개선. 비즈니스 임팩트 있음
- `low` — DX·점진적 개선. 단독으로는 작아도 누적 효과 있음

## Effort 정의

- `S` — 0.5일 이내 (1개 컴포넌트/유틸 변경)
- `M` — 0.5~2일 (여러 파일 + 빌드 검증)
- `L` — 2일 이상 (구조 변경 + 마이그레이션 + 테스트)

---

## 진행 원칙

- **한 번에 한 이슈만 in-progress.** 큰 이슈는 sub-task로 쪼개되 별도 이슈로 분리
- **회귀 금지.** 기존 기능/스타일이 깨지면 안 됨 → 매 단계 빌드 확인, 가능하면 수동 테스트
- **이슈 범위 엄수.** 작업 중 발견한 다른 개선은 새 이슈로 분리, 현재 이슈에 합치지 않음
- **승인 없이 커밋·푸시 금지.**
