import React, { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { toast } from "react-toastify"
import { apiJson, downloadWithAuth } from "../utils/api"
import { useAuth } from "../context/AuthContext"

function toSafeFile(input, fallback = `case-study`) {
  const raw = String(input || ``).trim()
  const base = (raw || fallback).replace(/[^a-zA-Z0-9-_]/g, `-`).replace(/-+/g, `-`).replace(/^-|-$/g, ``)
  return `${base || fallback}.js`
}

function clearLocalStorageForSubmission(submissionId) {
  if (typeof window === `undefined`) return
  const keys = Object.keys(window.localStorage)
  for (const k of keys) {
    if (k.startsWith(`crm_submission_`) && window.localStorage.getItem(k) === submissionId) {
      window.localStorage.removeItem(k)
    }
  }
}

async function fetchRecentRows() {
  try {
    const data = await apiJson(`/api/recent-files`)
    return Array.isArray(data) ? data : []
  } catch (e) {
    if (e?.status !== 404) throw e
    const forms = await apiJson(`/api/forms`)
    const rows = []
    for (const form of forms || []) {
      const subs = await apiJson(`/api/forms/${encodeURIComponent(form.id)}/submissions`)
      for (const sub of subs || []) {
        const filename = toSafeFile(sub?.data?.pageName, form.slug || `case-study`)
        rows.push({
          formId: form.id,
          formSlug: form.slug,
          formTitle: form.title,
          submissionId: sub.id,
          updatedAt: sub.updatedAt,
          pageName: sub?.data?.pageName || ``,
          filename,
          folderPath: form.slug,
          relativePath: `${form.slug}/${filename}`,
          downloadUrl: `/api/forms/${encodeURIComponent(form.id)}/submissions/${encodeURIComponent(
            sub.id
          )}/generate-case-study-full.js`,
        })
      }
    }
    rows.sort((a, b) => String(b.updatedAt || ``).localeCompare(String(a.updatedAt || ``)))
    return rows
  }
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 21h4l11.5-11.5a2 2 0 000-2.83L18.33 5.5a2 2 0 00-2.83 0L4 16.5V21z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RecentFilesPage() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchRecentRows()
      setItems(rows)
    } catch (e) {
      setError(e.message || `Failed to load recent files`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onDelete = async (submissionId) => {
    if (!window.confirm(`Delete this saved page from the list? This cannot be undone.`)) return
    setDeletingId(submissionId)
    setError(null)
    try {
      await apiJson(`/api/submissions/${encodeURIComponent(submissionId)}`, { method: `DELETE` })
      clearLocalStorageForSubmission(submissionId)
      toast.success(`This page has been removed successfully.`)
      await load()
    } catch (e) {
      setError(e.message || `Delete failed`)
      toast.error(e.message || `Delete failed`)
    } finally {
      setDeletingId(null)
    }
  }

  const onDownload = async (x) => {
    try {
      await downloadWithAuth(x.downloadUrl, x.filename)
    } catch (e) {
      setError(e.message || `Download failed`)
      toast.error(e.message || `Download failed`)
    }
  }

  return (
    <Layout title="Saved pages" subtitle="All submissions stay here until you remove them.">
      <Seo title="Saved pages" />
      <div className="crm-page-intro">
        <p className="crm-page-intro__text">
          Each row is a saved case-study draft. Data is stored on the server until you delete it. Use refresh if you
          saved in another tab.
        </p>
        <button type="button" className="btn btn-ghost-light btn--sm" onClick={load} disabled={loading}>
          {loading ? `Refreshing…` : `Refresh`}
        </button>
      </div>
      {error ? <p className="error crm-alert">{error}</p> : null}
      {loading && items.length === 0 ? <p className="crm-muted-on-dark">Loading…</p> : null}
      {!loading || items.length > 0 ? (
        <div className="crm-table-card crm-surface-light">
          {items.length === 0 ? (
            <p className="crm-empty-inline">No saved pages yet. Save from the user form — they will appear here.</p>
          ) : (
            <div className="crm-table-scroll">
              <table className="table table--crm">
                <thead>
                  <tr>
                    <th className="th-sr">#</th>
                    <th>File</th>
                    <th>Folder</th>
                    <th>Form</th>
                    <th>Last updated</th>
                    {isAdmin ? <th className="th-actions">Edit</th> : null}
                    {isAdmin ? <th className="th-actions">Download</th> : null}
                    <th className="th-actions">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((x, index) => (
                    <tr key={`${x.formId}-${x.submissionId}`}>
                      <td className="td-sr">{index + 1}</td>
                      <td>
                        <code className="crm-code">{x.filename}</code>
                      </td>
                      <td>
                        <code className="crm-code">{x.folderPath}</code>
                      </td>
                      <td>
                        <span className="crm-table-strong">{x.formTitle || x.formSlug}</span>
                      </td>
                      <td className="crm-table-date">{new Date(x.updatedAt).toLocaleString()}</td>
                      {isAdmin ? (
                        <td className="td-actions">
                          <Link
                            className="crm-table-link"
                            to={`/form/${encodeURIComponent(x.formSlug)}/submission/${encodeURIComponent(x.submissionId)}`}
                            title="Edit"
                            aria-label={`Edit ${x.filename}`}
                          >
                            <span className="crm-table-link__icon">
                              <EditIcon />
                            </span>
                            <span className="crm-table-link__label">Edit</span>
                          </Link>
                        </td>
                      ) : null}
                      {isAdmin ? (
                        <td className="td-actions">
                          <button type="button" className="btn btn-crm-secondary btn--sm" onClick={() => onDownload(x)}>
                            Download
                          </button>
                        </td>
                      ) : null}
                      <td className="td-actions">
                        <button
                          type="button"
                          className="crm-icon-btn crm-icon-btn--danger"
                          title="Delete"
                          aria-label={`Delete ${x.filename}`}
                          disabled={deletingId === x.submissionId}
                          onClick={() => onDelete(x.submissionId)}
                        >
                          <TrashIcon />
                          <span className="crm-icon-btn__text">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </Layout>
  )
}
