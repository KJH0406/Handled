export interface CardFormInput {
  name: string
  card: string
  exp: string
  cvc: string
  zip: string
}

export type CardFieldErrors = Partial<Record<keyof CardFormInput, string>>

export type CardErrorMessages = Record<keyof CardFormInput, string>

const DEFAULT_MESSAGES: CardErrorMessages = {
  name: "Enter the cardholder name",
  card: "Enter a 16-digit card number",
  exp: "MM/YY format",
  cvc: "3-digit CVC",
  zip: "Enter ZIP code",
}

export function validateCard(
  input: CardFormInput,
  messages: CardErrorMessages = DEFAULT_MESSAGES,
): CardFieldErrors {
  const errors: CardFieldErrors = {}
  if (!input.name.trim()) errors.name = messages.name
  if (input.card.replace(/\s/g, "").length < 16) errors.card = messages.card
  if (!/^\d{2}\/\d{2}$/.test(input.exp)) errors.exp = messages.exp
  if (input.cvc.length < 3) errors.cvc = messages.cvc
  if (!input.zip.trim()) errors.zip = messages.zip
  return errors
}
