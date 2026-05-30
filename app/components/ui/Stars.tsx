import Icon from "./Icon"

export interface StarsProps {
  rating: number
  size?: number
}

export default function Stars({ rating, size = 12 }: StarsProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <Icon
        name="star"
        size={size}
        fill="var(--gold)"
        stroke="var(--gold)"
        sw={1}
      />
      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
        {rating.toFixed(2)}
      </span>
    </span>
  )
}
