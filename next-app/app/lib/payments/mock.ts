import type { PaymentInput, PaymentProvider, PaymentResult } from "./types"

const PROCESS_DELAY_MS = 1500

export const mockProvider: PaymentProvider = {
  async process({ card, name }: PaymentInput): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, PROCESS_DELAY_MS))
    return {
      bookingId:
        "HD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      cardLast4: card.replace(/\s/g, "").slice(-4),
      payerName: name,
      paidAt: new Date().toISOString(),
    }
  },
}

export const processPayment = (input: PaymentInput): Promise<PaymentResult> =>
  mockProvider.process(input)
