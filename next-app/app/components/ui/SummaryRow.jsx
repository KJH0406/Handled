import Icon from "./Icon"

export default function SummaryRow({ icon, label, value }) {
  return (
    <div className="row row-gap-md" style={{ alignItems: "flex-start" }}>
      <Icon
        name={icon}
        size={18}
        stroke="var(--muted)"
        style={{ flexShrink: 0, marginTop: 2 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-caption muted">{label}</div>
        <div
          className="t-body-md ink"
          style={{ fontWeight: 500, overflowWrap: "anywhere" }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
