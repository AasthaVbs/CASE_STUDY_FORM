import React from "react"

export function SelectField({ className = ``, children, ...props }) {
  return (
    <select className={`input select ${className}`.trim()} {...props}>
      {children}
    </select>
  )
}
