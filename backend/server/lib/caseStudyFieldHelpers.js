/**
 * Image fields: stored value is original file name (e.g. xyz.png) or legacy full URL path.
 */
function asImageUrl(values, key) {
  const v = values?.[key]
  if (v === undefined || v === null) return ``
  if (typeof v === `object` && v.url) {
    const u = String(v.url).trim()
    if (!u) return ``
    if (u.startsWith(`/`) || /^https?:\/\//i.test(u)) return u
    return `/images/case-study/${String(u).replace(/^.*[/\\]/, ``)}`
  }
  const s = typeof v === `string` ? v.trim() : String(v).trim()
  if (!s) return ``
  if (s.startsWith(`/`) || /^https?:\/\//i.test(s)) return s
  return `/images/case-study/${s.replace(/^.*[/\\]/, ``)}`
}

module.exports = { asImageUrl }
