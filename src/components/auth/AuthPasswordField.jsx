import React, { useState } from "react"
import { IconEye, IconLock } from "./AuthIcons"

export function AuthPasswordField({
  id,
  value,
  onChange,
  label = `Password`,
  autoComplete = `current-password`,
  minLength,
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="crm-auth-field">
      <label className="crm-auth-label" htmlFor={id}>
        {label}
      </label>
      <div className="crm-auth-input-wrap crm-auth-input-wrap--password">
        <span className="crm-auth-input-icon" aria-hidden>
          <IconLock />
        </span>
        <input
          id={id}
          className="crm-auth-input crm-auth-input--padded-right"
          type={show ? `text` : `password`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="crm-auth-eye"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? `Hide password` : `Show password`}
        >
          <IconEye open={show} />
        </button>
      </div>
    </div>
  )
}
