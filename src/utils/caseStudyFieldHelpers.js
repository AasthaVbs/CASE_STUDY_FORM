/**
 * When the UI is on a different origin than the API (`VITE_API_URL`), uploaded files are
 * still served from the API (`/images/case-study/...`). Prefix those paths so images load.
 */
function viteApiBaseUrl() {
  if (typeof import.meta !== `undefined` && import.meta.env?.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, ``)
  }
  return ``
}

export function resolvePublicImageUrl(path) {
  if (path === undefined || path === null) return ``
  const p = typeof path === `string` ? path.trim() : String(path).trim()
  if (!p) return ``
  if (/^https?:\/\//i.test(p)) return p
  const base = viteApiBaseUrl()
  if (base && p.startsWith(`/images/`)) return `${base}${p}`
  return p
}

/**
 * Image fields: stored value is original file name (e.g. xyz.png) or legacy full URL path.
 */
export function asImageUrl(values, key) {
  const v = values?.[key]
  if (v === undefined || v === null) return ``
  if (typeof v === `object` && v.url) {
    const u = String(v.url).trim()
    if (!u) return ``
    if (u.startsWith(`/`) || /^https?:\/\//i.test(u)) return resolvePublicImageUrl(u)
    return resolvePublicImageUrl(`/images/case-study/${String(u).replace(/^.*[/\\]/, ``)}`)
  }
  const s = typeof v === `string` ? v.trim() : String(v).trim()
  if (!s) return ``
  if (s.startsWith(`/`) || /^https?:\/\//i.test(s)) return resolvePublicImageUrl(s)
  return resolvePublicImageUrl(`/images/case-study/${s.replace(/^.*[/\\]/, ``)}`)
}
