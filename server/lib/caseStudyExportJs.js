/**
 * Gatsby export: dynamic imports from ../../../static/image/<originalFileName>
 * and caseStudyData properties reference those identifiers (not path strings).
 */

const STATIC_IMAGE_GLOB = `../../../static/image/`

/** Form field keys that map to uploaded images (import name === key). */
const FORM_IMAGE_FIELD_KEYS = [
  `bannerImage`,
  `bannerImageMobile`,
  `introImage`,
  `executionStrategyImage`,
  `inputOutputMainImage`,
  `inputImage1`,
  `inputImage2`,
  `outputImage1`,
  `outputImage2`,
  `coordinatedSideImage`,
]

function getStoredFilename(raw, key) {
  const v = raw?.[key]
  if (v === undefined || v === null) return ``
  const s = String(v).trim()
  if (!s) return ``
  return s.replace(/^.*[/\\]/, ``)
}

function importMarker(key) {
  return `__IMPORT_${key}__`
}

/**
 * Replace image URL strings in built caseStudyData with import markers for export serialization.
 */
function applyImportMarkers(data, raw) {
  if (!data || !raw) return

  const setIfFile = (key, assign) => {
    const fn = getStoredFilename(raw, key)
    if (!fn) return
    assign(importMarker(key))
  }

  setIfFile(`bannerImage`, (m) => {
    data.bannerImage = m
  })
  setIfFile(`bannerImageMobile`, (m) => {
    data.bannerImageMobile = m
  })
  setIfFile(`introImage`, (m) => {
    if (data.customStoryLayout) data.customStoryLayout.introImage = m
  })
  setIfFile(`executionStrategyImage`, (m) => {
    if (data.workingMethodology) data.workingMethodology.workingMethodologyImage = m
  })
  setIfFile(`inputOutputMainImage`, (m) => {
    if (data.customStoryLayout?.postExecution) data.customStoryLayout.postExecution.image = m
  })
  setIfFile(`coordinatedSideImage`, (m) => {
    if (data.customStoryLayout?.postExecution) data.customStoryLayout.postExecution.sideImage = m
  })

  const i1 = getStoredFilename(raw, `inputImage1`)
  const i2 = getStoredFilename(raw, `inputImage2`)
  const o1 = getStoredFilename(raw, `outputImage1`)
  const o2 = getStoredFilename(raw, `outputImage2`)
  if (data.customStoryLayout?.postExecution) {
    const pe = data.customStoryLayout.postExecution
    const ins = []
    if (i1) ins.push(importMarker(`inputImage1`))
    if (i2) ins.push(importMarker(`inputImage2`))
    if (ins.length) pe.inputImages = ins

    const outs = []
    if (o1) outs.push(importMarker(`outputImage1`))
    if (o2) outs.push(importMarker(`outputImage2`))
    if (outs.length) pe.outputImages = outs
  }

  if (data.imageSlider && (i1 || i2)) {
    const imgs = []
    if (i1) imgs.push(importMarker(`inputImage1`))
    if (i2) imgs.push(importMarker(`inputImage2`))
    data.imageSlider.images = imgs
  }
}

function buildDynamicImportBlock(raw) {
  const lines = []
  for (const key of FORM_IMAGE_FIELD_KEYS) {
    const fn = getStoredFilename(raw, key)
    if (!fn) continue
    const pathStr = `${STATIC_IMAGE_GLOB}${fn.replace(/\\/g, `/`)}`
    lines.push(`import ${key} from "${pathStr}";`)
  }
  return lines.join(`\n`)
}

/**
 * Remove prior import lines for form image keys (template may define same identifiers).
 */
function stripFormImageImports(source) {
  return removeAllFormImageImportLines(source)
}

/**
 * Remove every `import <formField> from "..."` line anywhere in the file (fixes duplicates
 * or lines left below Head from older generators).
 */
function removeAllFormImageImportLines(source) {
  const sortedKeys = [...FORM_IMAGE_FIELD_KEYS].sort((a, b) => b.length - a.length)
  const keysPattern = sortedKeys.join(`|`)
  const reRemove = new RegExp(
    `^import\\s+(?:${keysPattern})\\s+from\\s+['"][^'"]+['"];?\\s*\\r?\\n`,
    `gm`
  )
  return source.replace(reRemove, ``)
}

/**
 * Strip all form-image imports from the file, then insert one block immediately before
 * `export const Head` so eslint import/first is satisfied (all imports, then Head, then rest).
 */
function hoistFormImageImports(source, insertText) {
  let cleaned = removeAllFormImageImportLines(source)
  const trimmed = insertText && String(insertText).trim()
  if (trimmed) {
    cleaned = insertBeforeExportHead(cleaned, trimmed)
  }
  return cleaned
}

const TOKEN_MAP = {
  __VAR_beforestate__: `beforestate`,
  __VAR_cureentstate__: `cureentstate`,
  __VAR_CasestudyIcon1__: `CasestudyIcon1`,
  __VAR_CasestudyIcon2__: `CasestudyIcon2`,
  __VAR_CasestudyIcon3__: `CasestudyIcon3`,
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`)
}

/**
 * Serialize caseStudyData object to JS source (const caseStudyData = ...;).
 */
function serializeCaseStudyDataJs(data) {
  let json = JSON.stringify(data, null, 2)
  json = json.replace(/"__IMPORT_([a-zA-Z0-9_$]+)__"/g, `$1`)
  for (const [token, ref] of Object.entries(TOKEN_MAP)) {
    json = json.replace(new RegExp(`"${escapeRegExp(token)}"`, `g`), ref)
  }
  return `const caseStudyData = ${json};`
}

function replaceCaseStudyDataBlock(source, newDeclaration) {
  const needle = `const caseStudyData = `
  const start = source.indexOf(needle)
  if (start === -1) {
    throw new Error(`Could not find caseStudyData block in template`)
  }
  const braceStart = source.indexOf(`{`, start + needle.length)
  if (braceStart === -1) throw new Error(`caseStudyData brace not found`)
  let depth = 0
  let j = braceStart
  for (; j < source.length; j += 1) {
    const c = source[j]
    if (c === `{`) depth += 1
    else if (c === `}`) {
      depth -= 1
      if (depth === 0) {
        j += 1
        while (j < source.length && (source[j] === ` ` || source[j] === `\t`)) j += 1
        if (source[j] === `;`) j += 1
        return source.slice(0, start) + newDeclaration + source.slice(j)
      }
    }
  }
  throw new Error(`Unbalanced braces in caseStudyData`)
}

/**
 * Place dynamic image imports after all static imports but before any other
 * statements (e.g. export const Head) so eslint import/first passes.
 */
function insertBeforeExportHead(source, insertText) {
  const needle = `export const Head`
  const idx = source.indexOf(needle)
  if (idx === -1) {
    throw new Error(`export const Head not found — template must export Head after imports`)
  }
  const block = insertText ? `${insertText}\n\n` : ``
  return source.slice(0, idx) + block + source.slice(idx)
}

module.exports = {
  FORM_IMAGE_FIELD_KEYS,
  STATIC_IMAGE_GLOB,
  getStoredFilename,
  applyImportMarkers,
  buildDynamicImportBlock,
  stripFormImageImports,
  removeAllFormImageImportLines,
  hoistFormImageImports,
  serializeCaseStudyDataJs,
  replaceCaseStudyDataBlock,
  insertBeforeExportHead,
}
