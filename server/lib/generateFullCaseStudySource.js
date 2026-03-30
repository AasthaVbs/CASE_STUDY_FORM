const fs = require(`fs`)
const path = require(`path`)
const { buildCaseStudyData } = require(`./generateCaseStudyPage`)
const {
  applyImportMarkers,
  buildDynamicImportBlock,
  hoistFormImageImports,
  serializeCaseStudyDataJs,
  replaceCaseStudyDataBlock,
} = require(`./caseStudyExportJs`)

function sanitizeComponentName(raw) {
  const base = String(raw || `GeneratedCaseStudy`)
    .replace(/[^a-zA-Z0-9_$]/g, `_`)
    .replace(/^[^a-zA-Z_$]/, `_`)
  return base || `GeneratedCaseStudy`
}

function generateFullCaseStudySourceFile({ formSlug, submission, sourceFilePath }) {
  const sourcePath = sourceFilePath || path.join(__dirname, `..`, `..`, `architecture-outservice-services.js`)
  const raw = submission?.data || {}
  const data = buildCaseStudyData(raw)
  applyImportMarkers(data, raw)

  const dynamicImports = buildDynamicImportBlock(raw)
  let out = hoistFormImageImports(fs.readFileSync(sourcePath, `utf8`), dynamicImports)

  out = replaceCaseStudyDataBlock(out, serializeCaseStudyDataJs(data))

  const componentName = sanitizeComponentName(data?.pageName || formSlug || `GeneratedCaseStudy`)
  const componentDecl = /const\s+[A-Za-z0-9_$]+\s*=\s*\(\)\s*=>\s*\{/
  if (componentDecl.test(out)) {
    out = out.replace(componentDecl, `const ${componentName} = () => {`)
  }
  out = out.replace(/export default\s+[A-Za-z0-9_$]+\s*;/, `export default ${componentName};`)

  const banner = `/**
 * Auto-generated case-study page source from form "${formSlug}" submission "${submission?.id || ``}".
 * Template: architecture-outservice-services.js
 * Uploaded images use original file names; imports resolve to ../../../static/image/<filename>
 */
`
  return `${banner}\n${out}`
}

module.exports = { generateFullCaseStudySourceFile }
