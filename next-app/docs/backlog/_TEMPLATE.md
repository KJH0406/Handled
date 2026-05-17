---
id: ISSUE-XX
title: <한 줄 제목>
status: open          # open | in-progress | blocked | done | dropped
priority: medium      # high | medium | low
effort: M             # S | M | L
depends_on: []        # ["ISSUE-01"]
labels: []            # ["refactor", "perf", "a11y", "dx", "test", "infra"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-XX: <제목>

## 목표 (Goal)

<왜 이 작업이 필요한가, 1~2문장>

## 현재 상태 (Current state)

<지금 코드/구조의 어디가 문제인지. 파일 경로 + 라인 번호로 구체적으로>

- `next-app/app/foo.jsx:123` — XX 하드코딩
- ...

## 수락 기준 (Acceptance criteria)

작업 완료 판정 체크리스트. 모두 충족돼야 `done`.

- [ ] <조건 1>
- [ ] <조건 2>
- [ ] `npm run build` 통과
- [ ] 기존 기능 회귀 없음 (수동 확인 또는 E2E)

## 구현 메모 (Implementation notes)

<어떤 식으로 접근할지. 코드 스니펫·라이브러리·명령어>

```bash
# 예시
```

## 위험 (Risk)

<무엇이 깨질 수 있는지. 회귀 가능 영역>

## 참고 (References)

- 관련 파일:
- 외부 문서:
- 관련 이슈: [[ISSUE-YY]]

## 작업 로그 / 발견 사항 (Notes / discoveries)

> 작업하면서 새로 발견한 점을 append. 다음 세션의 컨텍스트가 됨.

- (작업 시작 후 채워짐)
