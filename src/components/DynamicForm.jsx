import React from "react"
import { ReferenceCaseStudyForm } from "./reference/ReferenceCaseStudyForm"

/**
 * Dynamic form driven by admin schema. Presentation lives in ReferenceCaseStudyForm + reference.css
 * — replace the stylesheet (and optional class names in the component) with your full design.
 */
export function DynamicForm({
  title = ``,
  description = ``,
  schema,
  values,
  onChange,
  onSubmit,
  submitLabel = `Save`,
  disabled = false,
  saveNote = ``,
}) {
  return (
    <ReferenceCaseStudyForm
      title={title}
      description={description}
      schema={schema}
      values={values}
      onChange={onChange}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      disabled={disabled}
      saveNote={saveNote}
      variant="form"
    />
  )
}
