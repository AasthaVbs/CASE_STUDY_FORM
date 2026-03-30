import React from "react"

export function FormField({ label, htmlFor, children }) {
  return (
    <div className="form-field">
      {label ? (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
    </div>
  )
}
