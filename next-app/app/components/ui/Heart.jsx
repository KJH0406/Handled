"use client"

import Icon from "./Icon"

export default function Heart({ filled, onClick }) {
  return (
    <button
      className="heart-btn"
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
      aria-label={filled ? "Unsave" : "Save"}
    >
      <Icon
        name="heart"
        size={22}
        fill={filled ? "var(--rausch)" : "rgba(0,0,0,0.5)"}
        stroke={filled ? "var(--rausch)" : "white"}
        sw={2}
      />
    </button>
  )
}
