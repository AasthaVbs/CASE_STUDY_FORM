import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="crm-auth-loading">
        <div className="crm-auth-loading__spinner" aria-hidden />
        <p className="crm-auth-loading__text">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
