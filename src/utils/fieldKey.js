export function fieldKey(field) {
  const n = field?.name || field?.id
  if (typeof n === `string` && n.trim()) {
    // Keep raw key so dotted paths (a.b.c) remain intact for case-study export.
    return n.trim()
  }
  return `field_${String(field?.id || `x`).replace(/[^a-zA-Z0-9_]/g, `_`)}`
}

export function buildDefaultValues(schema) {
  const fields = schema?.fields || []
  const o = {}
  for (const f of fields) {
    const key = fieldKey(f)
    const hasDefault = Object.prototype.hasOwnProperty.call(f || {}, `defaultValue`)
    if ((f.type === `select` || f.type === `radio`) && f.options && f.options.length) {
      o[key] = hasDefault ? f.defaultValue : f.options[0].value
    } else if (f.type === `list`) {
      o[key] = hasDefault ? f.defaultValue : []
    } else if (f.type === `checkbox`) {
      o[key] = hasDefault ? !!f.defaultValue : false
    } else {
      o[key] = hasDefault ? f.defaultValue : ``
    }
  }
  return o
}
