import React from "react"
import { Link } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePen, faFolderTree, faSliders } from "@fortawesome/free-solid-svg-icons"

export function HomePage() {
  const { isAdmin } = useAuth()

  return (
    <Layout title="Dashboard" subtitle="Create pages, manage saved files, and export your case-study code.">
      <Seo title="Dashboard" />
      <div className="crm-home">
        <div className="crm-stat-grid">
          <Link to="/form/demo-case-study" className="crm-stat-card crm-stat-card--accent">
            <span className="crm-stat-card__label">
              <FontAwesomeIcon icon={faFilePen} aria-hidden /> Editor
            </span>
            <span className="crm-stat-card__title">Case Study</span>
            <span className="crm-stat-card__hint">Fill fields, upload images, save drafts to the server.</span>
            <span className="crm-stat-card__cta">Open form →</span>
          </Link>
          <Link to="/recent-files" className="crm-stat-card">
            <span className="crm-stat-card__label">
              <FontAwesomeIcon icon={faFolderTree} aria-hidden /> Library
            </span>
            <span className="crm-stat-card__title">Saved pages</span>
            <span className="crm-stat-card__hint">Every submission is listed until you delete it.</span>
            <span className="crm-stat-card__cta">View list →</span>
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="crm-stat-card crm-stat-card--quiet">
              <span className="crm-stat-card__label">
                <FontAwesomeIcon icon={faSliders} aria-hidden /> Configuration
              </span>
              <span className="crm-stat-card__title">Admin</span>
              <span className="crm-stat-card__hint">Form schemas, submissions, and generated exports.</span>
              <span className="crm-stat-card__cta">Open admin →</span>
            </Link>
          ) : null}
        </div>
       
      </div>
    </Layout>
  )
}
