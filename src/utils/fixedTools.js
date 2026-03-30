/**
 * Same fixed tools as server/lib/fixedTools.js (Gatsby public paths).
 */
export const FIXED_TOOL_FEATURE_TILES = [
  { icon: `/icon/revit.png`, type: `primary`, title: `Revit` },
  { icon: `/icon/lumion.png`, type: `light`, title: `Lumion` },
  { icon: `/icon/autocad.png`, type: `primary`, title: `AutoCAD` },
]

export function parseToolsCount(raw) {
  const n = parseInt(String(raw ?? `3`), 10)
  if (n === 1 || n === 2 || n === 3) return n
  return 3
}

export function getFeatureTilesForCount(count) {
  return FIXED_TOOL_FEATURE_TILES.slice(0, parseToolsCount(count))
}

export function toolsSummaryForDetails(count) {
  return getFeatureTilesForCount(count)
    .map((t) => t.title)
    .join(`, `)
}

export function inferToolsCountFromLegacy(values) {
  if (values?.toolsCount !== undefined && values?.toolsCount !== null && String(values.toolsCount).trim() !== ``) {
    return parseToolsCount(values.toolsCount)
  }
  const arr = Array.isArray(values?.toolsUsed) ? values.toolsUsed : []
  const n = arr.filter((x) => x && String(x.title || ``).trim()).length
  if (n >= 1 && n <= 3) return n
  return 3
}
