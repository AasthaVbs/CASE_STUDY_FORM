import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiJson, getToken, setToken as persistToken } from "../utils/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    persistToken(null)
    setUser(null)
    navigate(`/`, { replace: true })
  }, [navigate])

  const refreshMe = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await apiJson(`/api/auth/me`)
      setUser(me)
    } catch {
      persistToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshMe()
  }, [refreshMe])

  useEffect(() => {
    const onExpired = () => {
      setUser(null)
      navigate(`/`, { replace: true })
    }
    window.addEventListener(`crm-auth-expired`, onExpired)
    return () => window.removeEventListener(`crm-auth-expired`, onExpired)
  }, [navigate])

  const login = useCallback(
    async (email, password, { asAdmin = false } = {}) => {
      const data = await apiJson(`/api/auth/login`, {
        method: `POST`,
        body: JSON.stringify({ email, password, asAdmin }),
        skipAuth: true,
      })
      persistToken(data.token)
      setUser(data.user)
      return data.user
    },
    []
  )

  const register = useCallback(async (email, password) => {
    const data = await apiJson(`/api/auth/register`, {
      method: `POST`,
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    })
    persistToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === `admin`,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, loading, login, register, logout, refreshMe]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error(`useAuth must be used within AuthProvider`)
  return ctx
}
