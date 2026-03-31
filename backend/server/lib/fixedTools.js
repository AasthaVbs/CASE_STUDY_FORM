/**
 * Fixed tool definitions (same order/titles/icons as architecture-outservice-services.js).
 * Icons are public URLs (Gatsby `static/icon/` → `/icon/...`).
 */
const FIXED_TOOL_FEATURE_TILES = [
  { icon: `/icon/revit.png`, type: `primary`, title: `Revit` },
  { icon: `/icon/lumion.png`, type: `light`, title: `Lumion` },
  { icon: `/icon/autocad.png`, type: `primary`, title: `AutoCAD` },
]

function parseToolsCount(raw) {
  const n = parseInt(String(raw ?? `3`), 10)
  if (n === 1 || n === 2 || n === 3) return n
  return 3
}

function getFeatureTilesForCount(count) {
  return FIXED_TOOL_FEATURE_TILES.slice(0, parseToolsCount(count))
}

function toolsSummaryForDetails(count) {
  return getFeatureTilesForCount(count)
    .map((t) => t.title)
    .join(`, `)
}

function inferToolsCountFromLegacy(rawData) {
  if (rawData?.toolsCount !== undefined && rawData?.toolsCount !== null && String(rawData.toolsCount).trim() !== ``) {
    return parseToolsCount(rawData.toolsCount)
  }
  const arr = Array.isArray(rawData?.toolsUsed) ? rawData.toolsUsed : []
  const n = arr.filter((x) => x && String(x.title || ``).trim()).length
  if (n >= 1 && n <= 3) return n
  return 3
}

module.exports = {
  FIXED_TOOL_FEATURE_TILES,
  parseToolsCount,
  getFeatureTilesForCount,
  toolsSummaryForDetails,
  inferToolsCountFromLegacy,
}
