import React from "react"
import { IconCompass } from "./AuthIcons"

/**
 * Premium auth layout: dark navy canvas, subtle glow, brand block above the card.
 */
export function AuthShell({ brandTitle, brandTagline, children }) {
  return (
    <div className="crm-auth-shell crm-auth-shell--premium">
      <div className="crm-auth-shell__glow" aria-hidden />
      <div className="crm-auth-shell__grid" aria-hidden />
      <div className="crm-auth-shell__inner">
        <header className="crm-auth-brand">
          <div className="crm-auth-brand__icon-wrap">
            <span className="crm-auth-brand__icon">
              <IconCompass />
            </span>
          </div>
          <h1 className="crm-auth-brand__title">{brandTitle}</h1>
          <p className="crm-auth-brand__tagline">{brandTagline}</p>
        </header>
        {children}
      </div>
    </div>
  )
}
