/**
 * In development, Vite proxies `/api` to the Express server (see vite.config.js).
 * In production, set VITE_API_URL to your API origin (no trailing slash) if the UI
 * is served from a different host than the API.
 */
const TOKEN_KEY = `crm_token`

export function getToken() {
  if (typeof window === `undefined`) return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (typeof window === `undefined`) return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

export function apiUrl(path) {
  const base =
    typeof import.meta !== `undefined` && import.meta.env?.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).replace(/\/$/, ``)
      : ``
  if (!path.startsWith(`/`)) return `${base}/${path}`
  return base ? `${base}${path}` : path
}

/** Headers for JSON requests; includes Bearer token when present. */
export function authHeaders(extra = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

export async function apiJson(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null
  const { skipAuth, ...fetchOptions } = options
  const res = await fetch(apiUrl(path), {
    ...fetchOptions,
    headers: {
      ...(hasBody ? { "Content-Type": `application/json` } : {}),
      ...(skipAuth ? {} : authHeaders()),
      ...(fetchOptions.headers || {}),
    },
  })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (res.status === 401 && typeof window !== `undefined`) {
    const skipSessionClear = path === `/api/auth/login` || path === `/api/auth/register`
    if (!skipSessionClear) {
      window.localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new CustomEvent(`crm-auth-expired`))
    }
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || res.statusText || `Request failed`)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

/**
 * Download a file from an authenticated GET endpoint (e.g. generated .js).
 * Plain <a href> cannot send Authorization headers.
 */
export async function downloadWithAuth(path, filename) {
  const token = getToken()
  const res = await fetch(apiUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (res.status === 401 && typeof window !== `undefined`) {
    window.localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new CustomEvent(`crm-auth-expired`))
  }
  if (!res.ok) {
    const text = await res.text()
    let msg = res.statusText
    try {
      const j = JSON.parse(text)
      if (j && j.error) msg = j.error
    } catch {
      if (text) msg = text
    }
    throw new Error(msg || `Download failed`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement(`a`)
  a.href = url
  a.download = filename || `download`
  a.rel = `noopener`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
