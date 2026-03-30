import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Seo } from "../components/Seo"
import { useAuth } from "../context/AuthContext"
import { AuthShell } from "../components/auth/AuthShell"
import { AuthEmailField } from "../components/auth/AuthEmailField"
import { AuthPasswordField } from "../components/auth/AuthPasswordField"

export function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(``)
    try {
      await login(email, password, { asAdmin: true })
      navigate(`/dashboard`, { replace: true })
    } catch (err) {
      setError(err.message || `Admin login failed`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      brandTitle="Administrator access"
      brandTagline="Sign in with your admin credentials to configure forms and view all submissions."
    >
      <Seo title="Admin Login" />
      <div className="crm-auth-card crm-auth-card--premium">
        <Link to="/" className="crm-auth-back-inline">
          ← Back to sign in
        </Link>
        <p className="crm-auth-card-lead">Admin console</p>
        <form onSubmit={onSubmit} className="crm-auth-form">
          <AuthEmailField id="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthPasswordField id="admin-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="crm-auth-error">{error}</p> : null}
          <button className="crm-auth-submit" type="submit" disabled={loading}>
            {loading ? `Signing in…` : `Sign in as administrator`}
          </button>
          <div className="crm-auth-secondary-actions">
            <Link to="/register" className="crm-auth-btn-register">
              Register now
            </Link>
          </div>
        </form>
        <p className="crm-auth-footer-hint">
          Standard user?{" "}
          <Link to="/" className="crm-auth-footer-link">
            User sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
