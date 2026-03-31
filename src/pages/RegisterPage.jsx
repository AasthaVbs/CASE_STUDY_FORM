import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Seo } from "../components/Seo"
import { useAuth } from "../context/AuthContext"
import { AuthShell } from "../components/auth/AuthShell"
import { AuthEmailField } from "../components/auth/AuthEmailField"
import { AuthPasswordField } from "../components/auth/AuthPasswordField"

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(``)
    setLoading(true)
    try {
      await register(email, password)
      navigate(`/dashboard`, { replace: true })
    } catch (err) {
      setError(err.message || `Registration failed`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      brandTitle="Create your workspace"
      brandTagline="Register here."
    >
      <Seo title="Register" />
      <div className="crm-auth-card crm-auth-card--premium">
        <Link to="/" className="crm-auth-back-inline">
          ← Back to sign in
        </Link>
        <p className="crm-auth-card-lead">New account</p>
       
        <form onSubmit={onSubmit} className="crm-auth-form">
          <AuthEmailField id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthPasswordField
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
          />
          {error ? <p className="crm-auth-error">{error}</p> : null}
          <button className="crm-auth-submit" type="submit" disabled={loading}>
            {loading ? `Creating account…` : `Create account`}
          </button>
        </form>
        <p className="crm-auth-footer-hint">
          Already have an account?{" "}
          <Link to="/" className="crm-auth-footer-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
