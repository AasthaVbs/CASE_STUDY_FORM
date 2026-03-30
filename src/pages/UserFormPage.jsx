import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { DynamicForm } from "../components/DynamicForm"
import { toast } from "react-toastify"
import { apiJson } from "../utils/api"
import { buildDefaultValues } from "../utils/fieldKey"

function storageKey(formId) {
  return `crm_submission_${formId}`
}
function draftStorageKey(formId) {
  return `crm_form_draft_${formId}`
}

function sanitizeJsFileBase(input, fallback = `case-study`) {
  const raw = String(input || ``).trim()
  const base = (raw || fallback).replace(/[^a-zA-Z0-9-_]/g, `-`).replace(/-+/g, `-`).replace(/^-|-$/g, ``)
  return base || fallback
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function apiJsonWithRetry(path, options, retries = 2, delayMs = 300) {
  let lastErr = null
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await apiJson(path, options)
    } catch (e) {
      lastErr = e
      if (i === retries) break
      const msg = String(e?.message || ``).toLowerCase()
      if (!(msg.includes(`failed to fetch`) || msg.includes(`network`) || msg.includes(`econnrefused`))) {
        break
      }
      await sleep(delayMs)
    }
  }
  throw lastErr
}

export function UserFormPage() {
  const { slug, submissionId: submissionIdFromRoute } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [values, setValues] = useState({})
  const [submissionId, setSubmissionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (slug === `demo-case-study`) {
          // Keep demo schema synced so image fields remain upload controls.
          await apiJsonWithRetry(`/api/forms/ensure-demo`, { method: `POST` }, 2, 300)
        }
        const f = await apiJsonWithRetry(`/api/forms/by-slug/${encodeURIComponent(slug)}`, undefined, 2, 300)
        if (cancelled) return
        setForm(f)
        const defaults = buildDefaultValues(f.schema)

        if (submissionIdFromRoute) {
          try {
            const sub = await apiJson(`/api/submissions/${encodeURIComponent(submissionIdFromRoute)}`)
            if (cancelled) return
            if (!sub || sub.formId !== f.id) {
              setError(`Submission not found for this form.`)
              setValues(defaults)
              setSubmissionId(null)
              setLoading(false)
              return
            }
            setSubmissionId(sub.id)
            setValues({ ...defaults, ...sub.data })
            if (typeof window !== `undefined`) {
              window.localStorage.setItem(storageKey(f.id), sub.id)
            }
            setLoading(false)
            return
          } catch {
            if (!cancelled) setError(`Could not load submission.`)
            setValues(defaults)
            setSubmissionId(null)
            setLoading(false)
            return
          }
        }

        let sid =
          typeof window !== `undefined` ? window.localStorage.getItem(storageKey(f.id)) : null
        if (sid) {
          try {
            const sub = await apiJson(`/api/submissions/${encodeURIComponent(sid)}`)
            if (sub && sub.formId === f.id) {
              setSubmissionId(sub.id)
              setValues({ ...defaults, ...sub.data })
              setLoading(false)
              return
            }
          } catch {
            sid = null
          }
        }
        if (typeof window !== `undefined`) {
          const draftRaw = window.localStorage.getItem(draftStorageKey(f.id))
          if (draftRaw) {
            try {
              const draft = JSON.parse(draftRaw)
              setValues({ ...defaults, ...(draft || {}) })
              setSubmissionId(null)
              return
            } catch {
              window.localStorage.removeItem(draftStorageKey(f.id))
            }
          }
        }
        setValues(defaults)
        setSubmissionId(null)
      } catch (e) {
        // Auto-heal demo route if DB is empty.
        if (e?.status === 404 && slug === `demo-case-study`) {
          try {
            await apiJsonWithRetry(`/api/forms/ensure-demo`, { method: `POST` }, 2, 300)
            const f = await apiJsonWithRetry(`/api/forms/by-slug/${encodeURIComponent(slug)}`, undefined, 2, 300)
            if (cancelled) return
            setForm(f)
            const defaults = buildDefaultValues(f.schema)
            setValues(defaults)
            setSubmissionId(null)
            return
          } catch (inner) {
            if (!cancelled) setError(inner.message || `Failed to create demo form`)
            return
          }
        }
        if (!cancelled) setError(e.message || `Failed to load form`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (slug) load()
    return () => {
      cancelled = true
    }
  }, [slug, submissionIdFromRoute])

  useEffect(() => {
    if (!form || submissionId || submissionIdFromRoute) return
    if (typeof window === `undefined`) return
    window.localStorage.setItem(draftStorageKey(form.id), JSON.stringify(values || {}))
  }, [form, values, submissionId, submissionIdFromRoute])

  const onSave = useCallback(async () => {
    if (!form) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      if (submissionId) {
        const sub = await apiJson(`/api/submissions/${encodeURIComponent(submissionId)}`, {
          method: `PUT`,
          body: JSON.stringify({ data: values }),
        })
        setMessage(`Saved.`)
        setValues(buildDefaultValues(form.schema))
        setSubmissionId(null)
        if (typeof window !== `undefined`) {
          window.localStorage.removeItem(storageKey(form.id))
          window.localStorage.removeItem(draftStorageKey(form.id))
        }
        navigate(`/form/${encodeURIComponent(slug)}`, { replace: true })
        toast.success(`Your page has been updated successfully.`)
      } else {
        const sub = await apiJson(`/api/forms/${encodeURIComponent(form.id)}/submissions`, {
          method: `POST`,
          body: JSON.stringify({ data: values }),
        })
        if (typeof window !== `undefined`) {
          window.localStorage.removeItem(storageKey(form.id))
          window.localStorage.removeItem(draftStorageKey(form.id))
        }
        setSubmissionId(null)
        setValues(buildDefaultValues(form.schema))
        setMessage(`Saved.`)
        toast.success(`Your page has been added successfully.`)
        navigate(`/form/${encodeURIComponent(slug)}`, { replace: true })
      }
    } catch (e) {
      setError(e.message || `Save failed`)
      toast.error(e.message || `Save failed`)
    } finally {
      setSaving(false)
    }
  }, [form, submissionId, values, slug, navigate])

  const title = useMemo(() => {
    if (slug === `demo-case-study`) return `Case Study`
    return form?.title || `Form`
  }, [form, slug])
  const savedFileName = useMemo(() => `${sanitizeJsFileBase(values?.pageName, form?.slug || `case-study`)}.js`, [values, form])

  const onCreateNewPage = useCallback(() => {
    if (!form || !slug) return
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem(storageKey(form.id))
      window.localStorage.removeItem(draftStorageKey(form.id))
    }
    setSubmissionId(null)
    setValues(buildDefaultValues(form.schema))
    setMessage(null)
    setError(null)
    navigate(`/form/${encodeURIComponent(slug)}`, { replace: true })
  }, [form, slug, navigate])

  if (!slug) {
    return (
      <Layout title="Form">
        <p className="error">Missing form slug.</p>
      </Layout>
    )
  }

  const pageSubtitle =
    !loading && form
      ? `${form.slug}${submissionId ? ` · ${savedFileName}` : ` · New draft`}`
      : undefined

  return (
    <Layout title={loading ? `Loading…` : title} subtitle={pageSubtitle}>
      <Seo title={title} description={form?.description} />
      <div className="user-form-toolbar">
        <p className="muted user-form-toolbar__meta">
          <Link to="/dashboard">Dashboard</Link>
          {form ? (
            <>
              {" "}
              · <span className="badge">{form.slug}</span>
              {submissionId ? (
                <>
                  {" "}
                  · <span className="badge">{savedFileName}</span>
                </>
              ) : null}
            </>
          ) : null}
        </p>
        {!loading && form ? (
          <button type="button" className="btn btn-ghost-light btn-primary border-none" onClick={onCreateNewPage}>
            Create new page
          </button>
        ) : null}
      </div>

      {error ? <p className="error">{error}</p> : null}

      {loading ? <p className="muted">Loading form…</p> : null}

      {!loading && form ? (
        <div className="panel" style={{ marginTop: 16, minHeight: `calc(100vh - 180px)` }}>
          <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>Edit</h2>
          <DynamicForm
            title={form.title}
            description={form.description}
            schema={form.schema}
            values={values}
            onChange={setValues}
            onSubmit={onSave}
            submitLabel={saving ? `Saving…` : `Save`}
            disabled={saving}
            saveNote={message ? `File saved as: ${savedFileName}` : ``}
          />
        </div>
      ) : null}
    </Layout>
  )
}
