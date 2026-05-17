---
id: ISSUE-12
title: 검색 인풋 디바운싱 (useDebounce)
status: open
priority: low
effort: S
depends_on: []
labels: ["perf", "ux"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-12: 검색 인풋 디바운싱 (useDebounce)

## 목표

ListScreen/ExperiencesScreen의 검색 인풋이 매 키 입력마다 즉시 필터링하지 않도록 디바운스. 빠른 타이핑 시 불필요한 리렌더 감소.

## 현재 상태

- `screens/ListScreen.jsx:14, 71` — `q` state가 입력 즉시 변경 → `useMemo(filtered)` 즉시 재계산
- `screens/ExperiencesScreen.jsx:18, 76` — 동일
- 데이터 크기가 작은 in-memory (가이드 6명, 체험 17개) 라 현재는 체감 무방. **추후 데이터 증가 또는 server fetching 도입 시** 의미 있음

## 수락 기준

- [ ] `hooks/useDebounce.js` 생성 (제네릭 형태로 재사용 가능)
- [ ] ListScreen/ExperiencesScreen 검색 인풋에 적용 (200ms debounce)
- [ ] 사용자 입력은 즉시 반영(input 컨트롤드 유지), 필터 트리거만 debounce
- [ ] `npm run build` 통과
- [ ] 동작 회귀 없음 (검색 결과 동일)

## 구현 메모

```js
// hooks/useDebounce.js
"use client"
import { useEffect, useState } from "react"

export function useDebounce(value, delay = 200) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
```

```jsx
// screens/ExperiencesScreen.jsx
import { useDebounce } from "../hooks/useDebounce"

const [q, setQ] = useState(initialQuery || "")
const debouncedQ = useDebounce(q, 200)

const filtered = useMemo(
  () => experiencesRepo.list({ city, category, query: debouncedQ }),
  [city, category, debouncedQ],
)
```

## 위험

- debounce 적용 후 사용자가 "결과 보일 때까지 200ms 지연" → 200ms 정도면 인지 무방
- ISSUE-04 (repository) 완료 후 적용하는 게 자연스러움 (인터페이스 정리된 상태)

## 참고

- 관련 파일:
  - `next-app/app/screens/ListScreen.jsx`
  - `next-app/app/screens/ExperiencesScreen.jsx`
- Rules: `~/.claude/rules/typescript/patterns.md` (useDebounce 예시 있음)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
