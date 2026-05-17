"use client"

import type { ReactNode } from "react"
import Icon from "../ui/Icon"

interface BreadcrumbProps {
  onBack: () => void
  children: ReactNode
}

export default function Breadcrumb({ onBack, children }: BreadcrumbProps) {
  return (
    <button type="button" className="breadcrumb" onClick={onBack}>
      <Icon name="arrowLeft" size={16} />
      <span className="t-body-sm">{children}</span>
    </button>
  )
}
