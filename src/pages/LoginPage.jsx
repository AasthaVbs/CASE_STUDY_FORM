import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Seo } from "../components/Seo"
import { useAuth } from "../context/AuthContext"
import { AuthShell } from "../components/auth/AuthShell"
import { AuthEmailField } from "../components/auth/AuthEmailField"
import { AuthPasswordField } from "../components/auth/AuthPasswordField"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(``)
    setLoading(true)
    try {
      await login(email, password)
      const next = location.state?.from?.pathname || `/dashboard`
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message || `Login failed`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      brandTitle="Case Study Studio"
      brandTagline="Manage case-study drafts, exports, and submissions with precision."
    >
      <Seo title="Login" />
      <div className="crm-auth-card crm-auth-card--premium">
        <form onSubmit={onSubmit} className="crm-auth-form">
          <AuthEmailField id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthPasswordField id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="crm-auth-error">{error}</p> : null}
          <button className="crm-auth-submit" type="submit" disabled={loading}>
            {loading ? `Signing in…` : `Sign in to dashboard`}
          </button>
          <div className="crm-auth-secondary-actions">
            <Link to="/register" className="crm-auth-btn-register">
              Register now
            </Link>
          </div>
        </form>
        <p className="crm-auth-footer-hint">
          Are you admin?{" "}
          <Link to="/admin-login" className="crm-auth-footer-link">
            Login here
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
