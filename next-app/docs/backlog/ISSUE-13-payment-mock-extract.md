---
id: ISSUE-13
title: 결제 mock 분리 → lib/payments/
status: open
priority: low
effort: S
depends_on: []
labels: ["refactor", "architecture"]
created: 2026-05-17
updated: 2026-05-17
---

# ISSUE-13: 결제 mock 분리 → lib/payments/

## 목표

`PaymentScreen` 내부에 `setTimeout(...,1500)`으로 구현된 결제 mock을 별도 모듈로 분리. 추후 실제 결제 API 연동 시 화면 코드 무수정 교체 가능.

## 현재 상태

- `screens/PaymentScreen.jsx:62-74` — submit() 안에서 직접:
  ```js
  setTimeout(() => {
    setLoading(false)
    onConfirm({ ...booking, payerName, cardLast4, bookingId })
  }, 1500)
  ```
- 카드 정보 유효성 검사도 같은 파일 내에 (`validate()`, `fmtCard`, `fmtExp`)

## 수락 기준

- [ ] `lib/payments/mock.js` 생성 — `processPayment(payload): Promise<PaymentResult>`
- [ ] `lib/payments/validators.js` 또는 `lib/payments/format.js` 로 카드 입력 포맷터/검증 추출
- [ ] PaymentScreen은 결제 절차를 직접 알지 않음, 결과만 처리:
  ```js
  const result = await processPayment({ booking, card, name, ... })
  onConfirm({ ...booking, ...result })
  ```
- [ ] 인터페이스 설계 시 실제 PG (토스/스트라이프) 교체 가능하도록:
  ```ts
  interface PaymentProvider {
    process(input): Promise<PaymentResult>
  }
  ```
- [ ] `npm run build` 통과 + 결제 흐름 회귀 없음

## 구현 메모

```js
// lib/payments/mock.js
export async function processPayment({ amount, card, name }) {
  await new Promise((r) => setTimeout(r, 1500))
  // 항상 성공 (mock). 실패 시뮬레이션은 throw new Error("...")
  return {
    bookingId: "HD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    cardLast4: card.replace(/\s/g, "").slice(-4),
    payerName: name,
    paidAt: new Date().toISOString(),
  }
}
```

```js
// lib/payments/format.js
export const fmtCard = (v) =>
  v
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19)

export const fmtExp = (v) =>
  v
    .replace(/\D/g, "")
    .replace(/^(.{2})(.+)/, "$1/$2")
    .slice(0, 5)

export function validateCard({ name, card, exp, cvc, zip }) {
  const e = {}
  if (!name?.trim()) e.name = "Enter the cardholder name"
  if ((card ?? "").replace(/\s/g, "").length < 16)
    e.card = "Enter a 16-digit card number"
  if (!/^\d{2}\/\d{2}$/.test(exp ?? "")) e.exp = "MM/YY format"
  if ((cvc ?? "").length < 3) e.cvc = "3-digit CVC"
  if (!zip?.trim()) e.zip = "Enter ZIP code"
  return e
}
```

```jsx
// PaymentScreen.jsx (요약)
import { processPayment } from "../lib/payments/mock"
import { fmtCard, fmtExp, validateCard } from "../lib/payments/format"

const submit = async () => {
  const errors = validateCard({ name, card, exp, cvc, zip })
  if (Object.keys(errors).length) {
    setErrs(errors)
    return
  }
  setLoading(true)
  try {
    const result = await processPayment({ amount: booking.total, card, name })
    onConfirm({ ...booking, ...result })
  } catch (err) {
    setErrs({ general: err.message })
  } finally {
    setLoading(false)
  }
}
```

## 위험

- 검증 메시지가 약간 달라질 수 있음 → 동일 wording 유지
- `validateCard`에서 inputs 모양이 바뀌면 setErrs와의 매핑 주의

## 참고

- 관련 파일:
  - `next-app/app/screens/PaymentScreen.jsx` (62-74행 + 5-15행 fmtCard/fmtExp)
- 관련 이슈: [[ISSUE-08]] (mock 분리하면 vitest로 테스트 쉬워짐)

## 작업 로그 / 발견 사항

- (작업 시작 후 채워짐)
