import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileLines, faFolderOpen, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

export function Layout({ title, subtitle, children }) {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()
  const showBack = location.pathname !== `/dashboard`

  return (
    <div className="shell crm-shell">
      <header className="topbar topbar--sticky">
        <div className="topbar__brand-wrap">
          {showBack ? (
            <Link to="/dashboard" className="crm-auth-back" style={{ marginTop: 0 }}>
              ← Back
            </Link>
          ) : null}
          <Link to="/dashboard" className="brand">
            Case Study CRM
          </Link>
          <Link to="/dashboard" className="brand__tag brand__tag--link">
            Dashboard · Forms & exports
          </Link>
        </div>
        <nav className="nav nav--crm">
          <Link to="/form/demo-case-study" className="nav__link">
            <FontAwesomeIcon icon={faFileLines} aria-hidden /> Create pages here
          </Link>
          <Link to="/recent-files" className="nav__link">
            <FontAwesomeIcon icon={faFolderOpen} aria-hidden /> Saved pages
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="nav__link nav__link--muted">
              <FontAwesomeIcon icon={faGear} aria-hidden /> Admin
            </Link>
          ) : null}
          <button type="button" className="nav__link nav__link--button" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} aria-hidden /> Logout
          </button>
        </nav>
      </header>
      <main className="main crm-main">
        {title ? (
          <header className="crm-page-header">
            <h1 className="page-title">{title}</h1>
            {subtitle ? <p className="crm-page-subtitle">{subtitle}</p> : null}
          </header>
        ) : null}
        {children}
      </main>
    </div>
  )
}
