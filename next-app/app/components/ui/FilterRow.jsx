"use client"

export default function FilterRow({ label, options, value, onChange }) {
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
