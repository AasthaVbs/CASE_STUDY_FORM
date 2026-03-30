import React from "react"
import { Helmet } from "react-helmet"

const SITE_TITLE = `Form CRM`
const DEFAULT_DESCRIPTION = `Dynamic forms, live preview, and admin export`

export function Seo({ title, description }) {
  const pageTitle = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE
  return (
    <Helmet defaultTitle={SITE_TITLE}>
      <title>{pageTitle}</title>
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      <html lang="en" />
    </Helmet>
  )
}
