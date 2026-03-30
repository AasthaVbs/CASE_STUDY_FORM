import React from "react"
import { ReferenceCaseStudyForm } from "./reference/ReferenceCaseStudyForm"

/** Same reference shell as the editor, read-only preview column. */
export function FormPreview({ title = ``, description = ``, schema, values }) {
  return (
    <ReferenceCaseStudyForm
      variant="preview"
      title={title}
      description={description}
      schema={schema}
      values={values}
      hideSubmit
    />
  )
}
