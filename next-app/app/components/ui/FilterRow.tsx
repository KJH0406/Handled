"use client"

export interface FilterRowProps {
  label: string
  options: readonly string[]
  value: string
  onChange: (next: string) => void
}

export default function FilterRow({
  label,
  options,
  value,
  onChange,
}: FilterRowProps) {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        className="t-caption-sm muted"
        style={{ marginBottom: 8, fontWeight: 500 }}
      >
        {label}
      </div>
      <div
        className="row"
        style={{
          gap: 8,
          flexWrap: "wrap",
          overflowX: "auto",
        }}
      >
        {options.map((o) => (
          <button
            key={o}
            className={`chip ${value === o ? "active" : ""}`}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
