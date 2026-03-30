import React from "react"
import { fieldKey } from "../../utils/fieldKey"
import { apiUrl, authHeaders } from "../../utils/api"
import "./reference.css"

/**
 * Presentation shell for dynamic CRM data. Replace `reference.css` with your full stylesheet;
 * keep the same class names, or edit the className strings here to match your markup.
 *
 * Props:
 * - title, description — from form definition
 * - schema — { fields: [...] }
 * - values — flat object keyed by field name
 * - onChange — (nextValues) => void
 * - onSubmit — optional; if omitted, form still renders but you can hide actions with hideSubmit
 * - readOnly — inputs become read-only (e.g. preview column)
 * - hideSubmit — hide the submit row
 * - variant — "form" | "preview" — preview shows label/value list with same visual theme
 */
export function ReferenceCaseStudyForm({
  title = ``,
  description = ``,
  schema,
  values = {},
  onChange,
  onSubmit,
  submitLabel = `Save`,
  saveNote = ``,
  disabled = false,
  readOnly = false,
  hideSubmit = false,
  variant = `form`,
}) {
  const fields = schema?.fields || []
  const [uploading, setUploading] = React.useState(null)
  const [uploadErr, setUploadErr] = React.useState(``)

  const handleChange = (key, value) => {
    if (readOnly || typeof onChange !== `function`) return
    onChange({ ...values, [key]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (readOnly || disabled || typeof onSubmit !== `function`) return
    onSubmit(values)
  }

  const uploadFile = async (key, file) => {
    if (readOnly || typeof onChange !== `function`) return
    setUploading(key)
    setUploadErr(``)
    try {
      const fd = new FormData()
      fd.append(`file`, file)
      const res = await fetch(apiUrl(`/api/upload`), { method: `POST`, body: fd, headers: authHeaders() })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Upload failed`)
      const stored = data.filename || (data.url && String(data.url).split(`/`).pop()) || ``
      onChange({ ...values, [key]: stored })
    } catch (e) {
      setUploadErr(e.message || `Upload failed`)
    } finally {
      setUploading(null)
    }
  }

  const safeInputId = (f, key) => `field-${String(f.id || key).replace(/\./g, `_`)}`

  if (variant === `preview`) {
    return (
      <aside className="crm-ref crm-ref--preview" aria-label="Live preview">
        <div className="crm-ref__preview-title">Live preview</div>
        <header className="crm-ref__header">
          <div className="crm-ref__header-row">
            {title ? <h2 className="crm-ref__title">{title}</h2> : null}
            {description ? <p className="crm-ref__lead">{description}</p> : null}
          </div>
        </header>
        <dl className="crm-ref__dl">
          {fields.map((f) => {
            const key = fieldKey(f)
            const label = f.label || key
            const v = values[key]
            let display =
              f.type === `checkbox` ? (v ? `Yes` : `No`) : v === undefined || v === null || v === `` ? `—` : String(v)
            if (f.type === `radio` && Array.isArray(f.options) && v !== undefined && v !== null && v !== ``) {
              const opt = f.options.find((o) => String(o.value) === String(v))
              display = opt ? opt.label || String(v) : String(v)
            }
            const pathStr = v === undefined || v === null ? `` : String(v)
            const previewSrc =
              pathStr &&
              (pathStr.startsWith(`/`) || /^https?:\/\//i.test(pathStr))
                ? pathStr
                : pathStr
                  ? `/images/case-study/${pathStr.replace(/^.*[/\\]/, ``)}`
                  : ``
            const showImg = f.type === `image` && previewSrc
            const extra = f.className ? ` ${f.className}` : ``
            return (
              <div key={f.id || key} className={`crm-ref__row${extra}`}>
                <dt className="crm-ref__dt">{label}</dt>
                <dd className="crm-ref__dd">
                  {showImg ? <img src={previewSrc} alt="" className="crm-ref__preview-img" /> : display}
                </dd>
              </div>
            )
          })}
        </dl>
      </aside>
    )
  }

  return (
    <section className="crm-ref">
      <header className="crm-ref__header">
        <div className="crm-ref__header-row">
          {title ? <h1 className="crm-ref__title">{title}</h1> : null}
          {description ? <p className="crm-ref__lead">{description}</p> : null}
        </div>
      </header>

      <form className="crm-ref__form" onSubmit={handleSubmit} noValidate>
        <div className="crm-ref__fields">
          {uploadErr ? <p className="crm-ref__upload-err">{uploadErr}</p> : null}
          {fields.map((f) => {
            const key = fieldKey(f)
            const label = f.label || key
            const required = !!f.required
            const fieldClass = f.className ? ` ${f.className}` : ``

            if (f.type === `textarea`) {
              return (
                <div key={f.id || key} className={`crm-ref__field${fieldClass}`}>
                  <label className="crm-ref__label" htmlFor={key}>
                    {label}
                    {required ? ` *` : ``}
                  </label>
                  <textarea
                    id={key}
                    name={key}
                    className="crm-ref__control"
                    value={values[key] ?? ``}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={f.placeholder || ``}
                    rows={f.rows && f.rows > 0 ? f.rows : 4}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                  {f.helpText ? <p className="crm-ref__helper">{f.helpText}</p> : null}
                </div>
              )
            }

            if (f.type === `image`) {
              const inputId = safeInputId(f, key)
              const pathVal = values[key] ?? ``
              const thumbSrc =
                pathVal &&
                (String(pathVal).startsWith(`/`) || /^https?:\/\//i.test(String(pathVal)))
                  ? pathVal
                  : pathVal
                    ? `/images/case-study/${String(pathVal).replace(/^.*[/\\]/, ``)}`
                    : null
              return (
                <div key={f.id || key} className={`crm-ref__field crm-ref__field--image${fieldClass}`}>
                  <label className="crm-ref__label" htmlFor={inputId}>
                    {label}
                    {required ? ` *` : ``}
                  </label>
                  <div className="crm-ref__image-upload">
                    <input
                      type="file"
                      id={inputId}
                      name={key}
                      accept="image/*"
                      className="crm-ref__file-input"
                      disabled={disabled || readOnly || uploading === key}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ``
                        if (file) uploadFile(key, file)
                      }}
                    />
                    {thumbSrc ? (
                      <div className="crm-ref__image-row">
                        <img src={thumbSrc} alt="" className="crm-ref__thumb" />
                        <div className="crm-ref__image-meta">
                          <input
                            type="text"
                            className="crm-ref__control"
                            readOnly
                            value={pathVal}
                            title={pathVal}
                          />
                          {!readOnly ? (
                            <button
                              type="button"
                              className="crm-ref__btn-ghost"
                              onClick={() => handleChange(key, ``)}
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <p className="crm-ref__image-hint">
                        {uploading === key ? `Uploading…` : `Choose your file here`}
                      </p>
                    )}
                  </div>
                </div>
              )
            }

            if (f.type === `list`) {
              const items = Array.isArray(values[key]) ? values[key] : []
              const fieldsDef = Array.isArray(f.itemFields) ? f.itemFields : [{ key: `text`, label: `Text`, type: `text` }]
              const listItemSplit =
                fieldsDef.length === 2 &&
                fieldsDef[0]?.type === `text` &&
                (fieldsDef[1]?.type === `textarea` || fieldsDef[1]?.type === `text`)
              return (
                <div key={f.id || key} className={`crm-ref__field crm-ref__field--list${fieldClass}`}>
                  <label className="crm-ref__label">{label}</label>
                  <div className="crm-ref__list-stack">
                    {items.map((item, idx) => {
                      const rowFields = fieldsDef.map((fd) => {
                        const itemVal = item?.[fd.key] ?? ``
                        if (fd.type === `textarea`) {
                          return (
                            <textarea
                              key={`${key}_${idx}_${fd.key}`}
                              className="crm-ref__control"
                              rows={fd.rows && fd.rows > 0 ? fd.rows : 2}
                              placeholder={fd.label || fd.key}
                              value={itemVal}
                              disabled={disabled || readOnly}
                              onChange={(e) => {
                                const next = [...items]
                                next[idx] = { ...(next[idx] || {}), [fd.key]: e.target.value }
                                handleChange(key, next)
                              }}
                            />
                          )
                        }
                        return (
                          <input
                            key={`${key}_${idx}_${fd.key}`}
                            type="text"
                            className="crm-ref__control"
                            placeholder={fd.label || fd.key}
                            value={itemVal}
                            disabled={disabled || readOnly}
                            onChange={(e) => {
                              const next = [...items]
                              next[idx] = { ...(next[idx] || {}), [fd.key]: e.target.value }
                              handleChange(key, next)
                            }}
                          />
                        )
                      })
                      return (
                        <div key={`${key}_${idx}`} className={`crm-ref__list-item${listItemSplit ? ` crm-ref__list-item--split` : ``}`}>
                          {listItemSplit ? <div className="crm-ref__list-item-fields">{rowFields}</div> : rowFields}
                          {!readOnly ? (
                            <button
                              type="button"
                              className="crm-ref__btn-ghost crm-ref__list-remove"
                              onClick={() => {
                                const next = items.filter((_, i) => i !== idx)
                                handleChange(key, next)
                              }}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      )
                    })}
                    {!readOnly ? (
                      <button
                        type="button"
                        className="crm-ref__btn-add"
                        onClick={() => {
                          const next = [...items, {}]
                          handleChange(key, next)
                        }}
                      >
                        {f.addLabel || `+ Add`}
                      </button>
                    ) : null}
                  </div>
                </div>
              )
            }

            if (f.type === `radio` && Array.isArray(f.options)) {
              const current = values[key] ?? f.defaultValue ?? ``
              return (
                <div key={f.id || key} className={`crm-ref__field crm-ref__field--radio${fieldClass}`}>
                  <span className="crm-ref__label" id={`${key}-radio-legend`}>
                    {label}
                    {required ? ` *` : ``}
                  </span>
                  <div className="crm-ref__radio-group" role="radiogroup" aria-labelledby={`${key}-radio-legend`}>
                    {f.options.map((o) => (
                      <label key={String(o.value)} className="crm-ref__radio-option">
                        <input
                          type="radio"
                          name={key}
                          value={o.value}
                          checked={String(current) === String(o.value)}
                          onChange={() => handleChange(key, o.value)}
                          disabled={disabled || readOnly}
                          required={required}
                        />
                        <span>{o.label || o.value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            }

            if (f.type === `select` && Array.isArray(f.options)) {
              return (
                <div key={f.id || key} className={`crm-ref__field${fieldClass}`}>
                  <label className="crm-ref__label" htmlFor={key}>
                    {label}
                    {required ? ` *` : ``}
                  </label>
                  <select
                    id={key}
                    name={key}
                    className="crm-ref__control"
                    value={values[key] ?? ``}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required={required}
                    disabled={disabled}
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label || o.value}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (f.type === `checkbox`) {
              return (
                <div key={f.id || key} className={`crm-ref__field crm-ref__field--checkbox${fieldClass}`}>
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    className="crm-ref__checkbox"
                    checked={!!values[key]}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    disabled={disabled}
                  />
                  <label className="crm-ref__checkbox-label" htmlFor={key}>
                    {label}
                    {required ? ` *` : ``}
                  </label>
                </div>
              )
            }

            const inputType =
              f.type === `email` ? `email` : f.type === `number` ? `number` : `text`

            return (
              <div key={f.id || key} className={`crm-ref__field${fieldClass}`}>
                <label className="crm-ref__label" htmlFor={key}>
                  {label}
                  {required ? ` *` : ``}
                </label>
                <input
                  id={key}
                  name={key}
                  type={inputType}
                  className="crm-ref__control"
                  value={values[key] ?? ``}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={f.placeholder || ``}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                />
              </div>
            )
          })}
        </div>

        {!hideSubmit ? (
          <div className="crm-ref__actions">
            <button type="submit" className="crm-ref__submit" disabled={disabled || readOnly}>
              {submitLabel}
            </button>
            {saveNote ? <p className="crm-ref__save-note">{saveNote}</p> : null}
          </div>
        ) : null}
      </form>
    </section>
  )
}
