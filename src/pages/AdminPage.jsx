import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { apiJson, apiUrl, downloadWithAuth, authHeaders } from "../utils/api"

const emptySchemaText = JSON.stringify(
  {
    fields: [
      {
        id: `f1`,
        name: `example`,
        label: `Example`,
        type: `text`,
        required: false,
        placeholder: ``,
      },
    ],
  },
  null,
  2
)

export function AdminPage() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState(`New form`)
  const [slug, setSlug] = useState(``)
  const [description, setDescription] = useState(``)
  const [schemaText, setSchemaText] = useState(emptySchemaText)
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [subs, setSubs] = useState([])
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [submissionCode, setSubmissionCode] = useState(``)
  const [loadingCode, setLoadingCode] = useState(false)

  const refresh = useCallback(async () => {
    const list = await apiJson(`/api/forms`)
    setForms(list)
    return list
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e.message || `Could not reach API. Is the server running?`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const selected = useMemo(() => forms.find((f) => f.id === selectedId) || null, [forms, selectedId])

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    ;(async () => {
      try {
        const list = await apiJson(`/api/forms/${encodeURIComponent(selectedId)}/submissions`)
        if (!cancelled) setSubs(list)
      } catch {
        if (!cancelled) setSubs([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const loadIntoEditor = (f) => {
    setSelectedId(f.id)
    setTitle(f.title)
    setSlug(f.slug)
    setDescription(f.description || ``)
    setSchemaText(JSON.stringify(f.schema, null, 2))
    setSelectedSubmissionId(null)
    setSubmissionCode(``)
  }

  const resetNew = () => {
    setSelectedId(null)
    setTitle(`New form`)
    setSlug(``)
    setDescription(``)
    setSchemaText(emptySchemaText)
    setSelectedSubmissionId(null)
    setSubmissionCode(``)
  }

  const onSave = async () => {
    setSaving(true)
    setError(null)
    try {
      let schema
      try {
        schema = JSON.parse(schemaText)
      } catch {
        throw new Error(`Schema JSON is invalid`)
      }
      if (selectedId) {
        await apiJson(`/api/forms/${encodeURIComponent(selectedId)}`, {
          method: `PUT`,
          body: JSON.stringify({
            title,
            slug: slug || undefined,
            description,
            schema,
          }),
        })
        await refresh()
      } else {
        const created = await apiJson(`/api/forms`, {
          method: `POST`,
          body: JSON.stringify({
            title,
            slug: slug || undefined,
            description,
            schema,
          }),
        })
        setSelectedId(created.id)
        setSlug(created.slug)
        await refresh()
      }
    } catch (e) {
      setError(e.message || `Save failed`)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm(`Delete this form and its submissions?`)) return
    setError(null)
    try {
      await apiJson(`/api/forms/${encodeURIComponent(id)}`, { method: `DELETE` })
      if (selectedId === id) resetNew()
      await refresh()
    } catch (e) {
      setError(e.message || `Delete failed`)
    }
  }

  const loadSubmissionCode = useCallback(
    async (submissionId) => {
      if (!selected) return
      setLoadingCode(true)
      setSelectedSubmissionId(submissionId)
      try {
        const res = await fetch(
          apiUrl(
            `/api/forms/${encodeURIComponent(selected.id)}/submissions/${encodeURIComponent(
              submissionId
            )}/generate-case-study-full-preview`
          ),
          { headers: authHeaders() }
        )
        const txt = await res.text()
        if (!res.ok) throw new Error(txt || `Failed to load generated code`)
        setSubmissionCode(txt)
      } catch (e) {
        setSubmissionCode(`// ${e.message || `Failed to load generated code`}`)
      } finally {
        setLoadingCode(false)
      }
    },
    [selected]
  )

  useEffect(() => {
    if (!selected || subs.length === 0) return
    const stillExists = selectedSubmissionId && subs.some((s) => s.id === selectedSubmissionId)
    if (stillExists) return
    loadSubmissionCode(subs[0].id)
  }, [selected, subs, selectedSubmissionId, loadSubmissionCode])

  const onDownloadSchema = async () => {
    if (!selected) return
    await downloadWithAuth(`/api/forms/${encodeURIComponent(selected.id)}/generate.js`, `${selected.slug || `form`}.js`)
  }

  return (
    <Layout title="Admin" subtitle="Form definitions, submissions, and generated component exports.">
      <Seo title="Admin" />
      <p className="muted">
        <Link to="/">Home</Link> · Manage form definitions and export <code>.js</code> components.
      </p>

      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}

      <div className="grid-two" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="row" style={{ justifyContent: `space-between` }}>
            <h2 style={{ margin: 0, fontSize: `1.15rem` }}>Forms</h2>
            <button type="button" className="btn" onClick={resetNew}>
              New
            </button>
          </div>
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id}>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: `4px 8px`, fontSize: `0.9rem` }}
                      onClick={() => loadIntoEditor(f)}
                    >
                      {f.title}
                    </button>
                  </td>
                  <td>
                    <Link to={`/form/${encodeURIComponent(f.slug)}`}>{f.slug}</Link>
                  </td>
                  <td style={{ textAlign: `right` }}>
                    <button type="button" className="btn" onClick={() => onDelete(f.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 style={{ marginTop: 0, fontSize: `1.15rem` }}>{selectedId ? `Edit form` : `Create form`}</h2>
          <div className="stack">
            <div className="form-field">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="slug">
                Slug (URL)
              </label>
              <input
                id="slug"
                className="input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto from title if empty"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="schema">
                Schema (JSON)
              </label>
              <textarea
                id="schema"
                className="input textarea"
                rows={16}
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
              />
              <div className="muted" style={{ fontSize: `0.85rem` }}>
                Field types: <code>text</code>, <code>email</code>, <code>number</code>, <code>textarea</code>,{" "}
                <code>image</code> (uploads to <code>/public/images/case-study/</code>), <code>select</code> (with{" "}
                <code>options</code>), <code>checkbox</code>.
                <br />
                For case-study forms, prefer plain text/image fields; JSON is auto-built when saving/exporting.
              </div>
            </div>
            <div className="row">
              <button type="button" className="btn btn-primary" disabled={saving} onClick={onSave}>
                {saving ? `Saving…` : `Save`}
              </button>
              {selected ? (
                <button type="button" className="btn btn-primary" onClick={onDownloadSchema}>
                  Download form .js (schema component)
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {selected ? (
        <div className="panel" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: `1.15rem` }}>Submissions</h2>
          {subs.length === 0 ? (
            <p className="muted">No submissions yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Updated</th>
                  <th>Saved file</th>
                  <th>Export</th>
                  <th>Data (JSON)</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontSize: `0.85rem` }}>{s.id}</td>
                    <td style={{ fontSize: `0.85rem` }}>{new Date(s.updatedAt).toLocaleString()}</td>
                    <td style={{ fontSize: `0.85rem` }}>
                      <code>{`${selected.slug}/${String(s.data?.pageName || selected.slug || `case-study`)
                        .replace(/[^a-zA-Z0-9-_]/g, `-`)
                        .replace(/-+/g, `-`)
                        .replace(/^-|-$/g, ``) || `case-study`}.js`}</code>
                    </td>
                    <td>
                      {selected ? (
                        <div className="row" style={{ gap: 8 }}>
                          <button type="button" className="btn" onClick={() => loadSubmissionCode(s.id)}>
                            View generated file
                          </button>
                          <button
                            type="button"
                            className="btn"
                            onClick={() =>
                              downloadWithAuth(
                                `/api/forms/${encodeURIComponent(selected.id)}/submissions/${encodeURIComponent(
                                  s.id
                                )}/generate-case-study-full.js`,
                                `${selected.slug || `case-study`}-${s.id.slice(0, 8)}.js`
                              )
                            }
                          >
                            Download architecture format .js
                          </button>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <pre
                        style={{
                          margin: 0,
                          whiteSpace: `pre-wrap`,
                          fontSize: `0.82rem`,
                          maxHeight: 160,
                          overflow: `auto`,
                        }}
                      >
                        {JSON.stringify(s.data, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
      {selected && selectedSubmissionId ? (
        <div className="panel" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: `1.15rem` }}>
            Generated file preview {loadingCode ? `(loading…)` : ``}
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Architecture page format preview with your saved data injected.
          </p>
          <pre
            style={{
              margin: 0,
              whiteSpace: `pre`,
              fontSize: `0.82rem`,
              maxHeight: 420,
              overflow: `auto`,
            }}
          >
            {submissionCode || `No generated code yet.`}
          </pre>
        </div>
      ) : null}
    </Layout>
  )
}
