import React from "react"

export function TextInput({ className = ``, ...props }) {
  return <input className={`input ${className}`.trim()} {...props} />
}
