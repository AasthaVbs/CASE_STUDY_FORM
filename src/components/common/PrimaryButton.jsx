import React from "react"

export function PrimaryButton({ className = ``, type = `button`, ...props }) {
  return <button type={type} className={`btn btn-primary ${className}`.trim()} {...props} />
}
