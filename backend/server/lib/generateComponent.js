/**
 * Builds a standalone React component file (.js) that wraps ReferenceCaseStudyForm.
 */

function escapeJsString(s) {
  return String(s)
    .replace(/\\/g, `\\\\`)
    .replace(/'/g, `\\'`)
    .replace(/\n/g, `\\n`)
    .replace(/\r/g, ``)
}

function buildDefaultValuesObject(schema) {
  const fields = schema.fields || []
  const o = {}
  for (const f of fields) {
    const n = f.name || f.id
    const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(n)
      ? n
      : `field_${String(f.id).replace(/[^a-zA-Z0-9_]/g, `_`)}`
    if (f.type === `select` && f.options && f.options.length) {
      o[key] = f.options[0].value
    } else if (f.type === `checkbox`) {
      o[key] = false
    } else {
      o[key] = ``
    }
  }
  return o
}

/**
 * @param {object} opts
 * @param {object} opts.form - { id, slug, title, description, schema }
 * @param {string} opts.importPath - relative import for ReferenceCaseStudyForm
 * @param {string} opts.componentName - exported function name
 */
function generateReactComponentFile({ form, importPath, componentName }) {
  const schema = form.schema || { fields: [] }
  const schemaJson = JSON.stringify(schema)
  const defaults = buildDefaultValuesObject(schema)
  const title = escapeJsString(form.title || `Form`)
  const desc = escapeJsString(form.description || ``)

  const name =
    componentName ||
    `GeneratedForm_${form.slug.replace(/[^a-zA-Z0-9_]/g, `_`)}`.replace(/^[^a-zA-Z_$]/, `_`)

  const safeImport = importPath.replace(/\\/g, `/`)

  return `/**
 * Auto-generated from form "${escapeJsString(form.slug)}" (${form.id})
 * Generated at: ${new Date().toISOString()}
 * Uses ReferenceCaseStudyForm — keep reference.css + component in sync with your main design.
 */
import React, { useState } from 'react'
import { ReferenceCaseStudyForm } from '${safeImport}'

const FORM_TITLE = '${title}'
const FORM_DESCRIPTION = '${desc}'
const FORM_SCHEMA = ${schemaJson}
const DEFAULT_VALUES = ${JSON.stringify(defaults)}

export function ${name}({ initialValues, onSubmit, submitLabel = 'Save' }) {
  const [values, setValues] = useState(() => ({
    ...DEFAULT_VALUES,
    ...(initialValues || {}),
  }))

  return (
    <ReferenceCaseStudyForm
      title={FORM_TITLE}
      description={FORM_DESCRIPTION}
      schema={FORM_SCHEMA}
      values={values}
      onChange={setValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
    />
  )
}

export default ${name}
`
}

module.exports = { generateReactComponentFile }
