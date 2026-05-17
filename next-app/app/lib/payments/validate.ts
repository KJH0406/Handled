export interface CardFormInput {
  name: string
  card: string
  exp: string
  cvc: string
  zip: string
}

export type CardFieldErrors = Partial<Record<keyof CardFormInput, string>>

export function validateCard(input: CardFormInput): CardFieldErrors {
  const errors: CardFieldErrors = {}
  if (!input.name.trim()) errors.name = "Enter the cardholder name"
  if (input.card.replace(/\s/g, "").length < 16)
    errors.card = "Enter a 16-digit card number"
  if (!/^\d{2}\/\d{2}$/.test(input.exp)) errors.exp = "MM/YY format"
  if (input.cvc.length < 3) errors.cvc = "3-digit CVC"
  if (!input.zip.trim()) errors.zip = "Enter ZIP code"
  return errors
}
