# 일정 비용 상세화 — 요구사항 정의서

> 저장된/생성된 일정을 목업(`reference-old/handled_web_mockup_v7.html`의 `PlannerResult`)처럼
> **날짜별로, 각 활동·이동·숙박 비용과 일/전체 합계를 상세히 표시**하는 기능.
> 디자인 규약은 루트 `DESIGN.md`가 정본(토큰/컴포넌트/접근성).

---

## 1. 목표 (Goal)

현재 일정 화면(`PlanCanvasScreen`)은 시간·소요·카테고리·제목·메모와 지도만 보여 준다.
여기에 **비용·이동 정보·숙박·합계**를 더해, 사용자가 "이 여행에 얼마가 드는지"를 날짜별로 한눈에
파악할 수 있게 한다. 목업 `PlannerResult` 화면의 정보 밀도를 우리 디자인 시스템으로 재현한다.

## 2. 적용 화면 (Where)

- **대상**: `app/screens/PlanCanvasScreen.tsx` (라우트 `/plan/[planId]`).
  - 이 화면은 일정 **생성 직후**와 **마이페이지 > 저장된 일정 열람** 양쪽에서 동일하게 사용된다.
    별도 화면 신설 없이 이 화면을 확장한다.
- `MyPlansScreen`(저장 목록)은 행 요약에 **예상 총액(per person)** 한 줄만 추가(선택).

## 3. 확정된 결정 (Decisions)

| 항목        | 결정                                                                                                                                                                                                                     | 근거               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 비용 출처   | **표시 중심의 대표 추정값.** 실제 제품에선 AI가 입력 기반 생성. 지금은 프로토타입이므로 "정보가 잘 보이는 것"이 우선이고, 정밀한 비용 도출 로직은 과하게 만들지 않는다. 데이터는 AI가 나중에 채울 수 있는 형태로 모델링. | 사용자 지시        |
| 숙박(호텔)  | **1박당 대표 호텔 1개 생성** (이름·지역·성급·1박 요금·소개). 목업 호텔 카드와 "숙박 포함 총액"을 재현.                                                                                                                   | 사용자 선택(추천)  |
| 교통비 표시 | **위저드에서 선택한 이동수단(`PlanInput.transport`)만** 구간별 비용·소요시간으로 표시. 3수단 비교 토글은 비범위.                                                                                                         | 사용자 선택(추천)  |
| 통화        | 기존 로직 그대로. KRW 정본, locale `ko`→`₩`, 그 외 USD 환산 표시(`KRW_PER_USD=1350`). `app/lib/format.ts`/`fmtBudget` 재사용.                                                                                            | 기존 시스템 일관성 |
| 인원 기준   | 모든 단가는 **1인 기준(per person)** 표기. 합계도 per person. 위저드 인원(`planTotalTravelers`)은 보조 표기로만 사용 가능.                                                                                               | 목업 동일          |

## 4. 데이터 모델 변경 (`app/lib/planner/types.ts`)

기존 도메인 단위(KRW 정본)에 맞춰 **금액은 KRW 정수**로 저장하고, 표시 시 `fmtBudget`로 변환한다.
(목업은 USD 정수였으나 우리는 KRW 정본 규약을 따른다.)

```ts
// 구간 이동 정보 (선택한 transport 모드 기준 1건)
export interface SlotTransit {
  mode: Transport // "public" | "taxi" | "car"
  label?: string // 예: "Line 3 (Orange)" / "Kakao Taxi" / "Private Driver"
  info: string // 경로 설명 한 줄
  durationMin: number // 소요(분)
  costKRW: number // 1인 비용(0 = 무료/도보, car는 보통 포함)
  included?: boolean // true면 "포함"으로 표기(요금 대신)
}

export interface PlanSlot {
  // ...기존 필드...
  costKRW?: number // 활동 1인 비용 (0 = 무료)
  costNote?: string // 예: "입장료", "노점 점심"
  tip?: string // 가이드 팁(목업 tip 재현, 선택)
  transit?: SlotTransit // 직전 지점→이 지점 이동(첫 슬롯은 없음/null)
}

export interface PlanLodging {
  name: string
  area: string
  stars: number // 3 | 4 | 5
  nightlyKRW: number // 1박 요금
  blurb: string
}

export interface PlanDay {
  // ...기존 필드...
  theme?: string // 날짜별 테마(목업 day.theme), 선택
  lodging?: PlanLodging // 그날 밤 숙소 (마지막 날은 없을 수 있음 — 아래 가정 참조)
}
```

### 파생 합계 (저장하지 않고 계산; `types.ts`에 헬퍼로)

- `dayActivityTotal = Σ slot.costKRW`
- `dayTransitTotal  = Σ slot.transit.costKRW (included 제외)`
- `daySubtotal      = dayActivityTotal + dayTransitTotal` ("활동+교통")
- `dayWithLodging   = daySubtotal + (lodging.nightlyKRW ?? 0)`
- `tripGrandTotal   = Σ dayWithLodging` (per person)

## 5. 표시 사양 / 비주얼 계약 (목업 `PlannerResult` 재현)

DESIGN.md 토큰·`t-*` 타이포·`categoryColor`·기존 카드/칩 스타일을 사용한다. 새 색/그림자 직접 정의 금지.

1. **헤더 보조줄**: 기존 제목 아래 "예상 총액 `{fmtBudget(tripGrandTotal)}` / 1인" 추가.
2. **이동수단 배지**: 선택한 transport를 칩으로(예: "🚇 대중교통"). `transport` 미선택 시 배지 생략.
3. **날짜 탭**: 기존 day 탭에 각 탭 부제로 `~{fmtBudget(dayWithLodging)}` 표기.
4. **날짜 헤더 블록**: DAY n + (테마) + "{n} stops" + "~{dayWithLodging}/1인".
5. **호텔 카드**: 🏨 + 이름 + "지역 · ★성급" + "1박 {nightlyKRW}" + 소개. (그날 `lodging`이 있을 때만)
6. **타임라인**: 번호 노드 + 세로 연결선. 슬롯 사이에 **TransitConnector**:
   - 모드 라벨/노선, 경로 info, 소요시간, 비용(무료=초록 "무료" / 포함="포함" / 그 외 금액).
7. **슬롯(활동) 카드**: 기존 카드에 추가 —
   - 우측 **비용 pill**: `costKRW === 0`이면 초록 "무료", 아니면 금액. 아래 `costNote`.
   - (선택) `tip` 한 줄.
8. **날짜 합계 블록**:
   - "교통비({모드 라벨})" 라인 = `dayTransitTotal`.
   - 2분할 카드: ① "활동+교통 = `daySubtotal` /1인" ② "숙박 포함(★) = `dayWithLodging` /1인 · 1박".
9. **전체 합계 카드**(브랜드 네이비 그라데이션): "n일 예상 총액 `tripGrandTotal` /1인 · 활동·교통·숙박 포함"
   - 우측에 Day별 소계 목록(Day 1: …, Day 2: …).

모든 금액 출력은 `fmtBudget`(locale 분기) 경유. 합계도 동일.

## 6. 데이터 생성 (`app/lib/planner/generate.ts`)

목업처럼 손으로 큐레이션하지 않고, 생성 시 **대표 추정값**을 채운다(표시 품질 우선, 로직 정밀도는 비핵심).

- **활동 비용**: 카테고리별 대표 단가대를 둔다(예: 무료군 = Culture 일부/Nature, 식사군 = Food,
  체험·뷰티 = 고비용). 예산 티어(`PlanInput.budget` 대비) 또는 단순 고정표로 산정. `costNote`는
  `SCHEDULE_BY_CATEGORY`/카테고리에서 유도.
- **이동(transit)**: 선택 `transport` 기준 슬롯 간 1건. public=저비용+소요 김, taxi=중비용+빠름,
  car=`included:true`(포함)·요금 0. 첫 슬롯은 transit 없음.
- **숙박**: 도시·예산 티어로 대표 호텔 1박 생성(이름/지역/성급/요금/소개). 성급은 예산대에 연동.
- **결정성**: 동일 입력 → 동일 결과(현행 생성기처럼 시드/인덱스 기반, 난수 금지).
- 데이터 형태는 **AI가 동일 스키마로 채울 수 있게** 슬롯/일자 단위로 분리해 둔다.

## 7. i18n

- 신규 라벨(예상 총액, 1인, 활동+교통, 숙박 포함, 교통비, 무료, 포함, per night, n stops, 모드 라벨 등)을
  `messages/en.json`·`messages/ko.json`의 `planner.canvas` 하위에 추가. 하드코딩 문자열 금지.
- 금액은 `fmtBudget`로 locale 분기(₩ / $ 환산).

## 8. 비범위 (Non-goals)

- 3수단(대중교통/택시/자가용) **비교 토글** — 선택 수단만 표시.
- 실제 장소·실명 호텔·실시간 요금 연동, 결제/예약과의 가격 연계.
- 슬롯/호텔 **인라인 편집**(금액 직접 수정). 현 단계는 표시 전용.
- 다인원 합산 청구액(총 인원 × 단가) — per person 기준만.

## 9. 가정 / 확인 필요 (Assumptions)

- **마지막 날 숙박**: 출발일(체크아웃) 밤은 숙소 없음으로 가정 → 그날 `lodging` 생략,
  "활동+교통"만 집계. (다르게 원하면 조정)
- 금액 KRW 정본·`fmtBudget` 표시. USD는 10단위 반올림(기존 `fmtBudget` 동작) 유지.
- 1일 1숙소(도시 내 이동 가정). 도시 간 이동/연박 변형은 비범위.

## 10. 인수 기준 (Acceptance)

1. 저장/생성된 일정에서 날짜별로 활동 비용·구간 이동(선택 수단)·숙박이 표시된다.
2. 각 날짜에 "활동+교통" 및 "숙박 포함" 소계가, 화면 상·하단에 **여행 전체 예상 총액(1인)**이 표시된다.
3. 모든 금액이 locale에 따라 ₩/$로 올바르게 표기된다(`fmtBudget`).
4. 동일 입력으로 재생성 시 동일한 비용·숙소가 나온다(결정성).
5. 신규 문자열이 en/ko 모두 번역되어 있고, 색/타이포는 DESIGN.md 토큰만 사용한다.
6. 비용 데이터가 없는 기존 저장 일정도 깨지지 않는다(필드 옵셔널 → 누락 시 자연 폴백).
