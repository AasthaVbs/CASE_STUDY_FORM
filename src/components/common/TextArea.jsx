import React from "react"

export function TextArea({ className = ``, rows = 4, ...props }) {
  return <textarea className={`input textarea ${className}`.trim()} rows={rows} {...props} />
}
