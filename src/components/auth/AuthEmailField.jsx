import React from "react"
import { IconMail } from "./AuthIcons"

export function AuthEmailField({ id, value, onChange, label = `Email`, autoComplete = `email` }) {
  return (
    <div className="crm-auth-field">
      <label className="crm-auth-label" htmlFor={id}>
        {label}
      </label>
      <div className="crm-auth-input-wrap">
        <span className="crm-auth-input-icon" aria-hidden>
          <IconMail />
        </span>
        <input
          id={id}
          className="crm-auth-input"
          type="email"
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          placeholder="you@company.com"
        />
      </div>
    </div>
  )
}
