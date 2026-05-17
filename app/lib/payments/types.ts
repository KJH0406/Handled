export interface PaymentInput {
  amount: number
  card: string
  name: string
}

export interface PaymentResult {
  bookingId: string
  cardLast4: string
  payerName: string
  paidAt: string
}

export interface PaymentProvider {
  process(input: PaymentInput): Promise<PaymentResult>
}
