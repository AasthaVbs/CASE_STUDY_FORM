const { asImageUrl } = require(`./caseStudyFieldHelpers`)
const { getFeatureTilesForCount, toolsSummaryForDetails, inferToolsCountFromLegacy } = require(`./fixedTools`)

function asText(values, key, fallback = ``) {
  const v = values?.[key]
  if (v === undefined || v === null) return fallback
  return String(v).trim()
}

function parseMaybeJson(value) {
  if (typeof value !== `string`) return null
  const t = value.trim()
  if (!t) return null
  if ((t.startsWith(`{`) && t.endsWith(`}`)) || (t.startsWith(`[`) && t.endsWith(`]`))) {
    try {
      return JSON.parse(t)
    } catch {
      return null
    }
  }
  return null
}

function listFromLines(values, key) {
  const raw = asText(values, key, ``)
  if (!raw) return []
  return raw
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function collectPairs(values, base, max) {
  const out = []
  for (let i = 1; i <= max; i += 1) {
    const title = asText(values, `${base}${i}.title`, ``)
    const text = asText(values, `${base}${i}.text`, ``)
    if (!title && !text) continue
    const item = {}
    if (title) item.title = title
    if (text) item.text = text
    out.push(item)
  }
  return out
}

function compact(value) {
  if (Array.isArray(value)) {
    const arr = value.map(compact).filter((v) => v !== undefined)
    return arr.length ? arr : undefined
  }
  if (value && typeof value === `object`) {
    const o = {}
    for (const [k, v] of Object.entries(value)) {
      const cv = compact(v)
      if (cv !== undefined) o[k] = cv
    }
    return Object.keys(o).length ? o : undefined
  }
  if (value === `` || value === null || value === undefined) return undefined
  return value
}

function firstNonEmpty() {
  for (const item of arguments) {
    const v = item === undefined || item === null ? `` : String(item).trim()
    if (v) return v
  }
  return ``
}

function buildCaseStudyData(rawData) {
  if (!rawData || typeof rawData !== `object`) return {}

  // If user directly provides full object under `caseStudyData`, use it.
  if (
    rawData.caseStudyData &&
    typeof rawData.caseStudyData === `object` &&
    !Array.isArray(rawData.caseStudyData)
  ) {
    return rawData.caseStudyData
  }

  const painPoints = Array.isArray(rawData?.painPoints) ? rawData.painPoints.filter((x) => x && (x.title || x.text)) : []
  const solutions = Array.isArray(rawData?.solutions) ? rawData.solutions.filter((x) => x && (x.title || x.text)) : []
  const coordinatedPoints = Array.isArray(rawData?.coordinatedPoints)
    ? rawData.coordinatedPoints.map((x) => String(x?.text || ``).trim()).filter(Boolean)
    : []
  const toolsCount = inferToolsCountFromLegacy(rawData)
  const toolTiles = getFeatureTilesForCount(toolsCount)
  const toolsSummary = toolsSummaryForDetails(toolsCount)

  const sliderImages = [asImageUrl(rawData, `inputImage1`), asImageUrl(rawData, `inputImage2`)].filter(Boolean)
  const out = {
    pageName: asText(rawData, `pageName`, ``),
    caseStudyPdfUrl: asText(rawData, `caseStudyPdfUrl`, ``),
    bannerImage: asImageUrl(rawData, `bannerImage`),
    bannerImageMobile: asImageUrl(rawData, `bannerImageMobile`),
    description: asText(rawData, `introDescription`, ``),
    description2: ``,
    customStoryLayout: {
      useCustomHero: true,
      useDefaultHeader: true,
      useContactHeaderOnly: true,
      centerIntroMetaBelow: true,
      introMetaDetailCount: 3,
      metaStatsHighlight: true,
      pageClass: `singapore-case-theme`,
      heroBgPosition: `center`,
      heroBgSize: `contain`,
      heroBgRepeat: `no-repeat`,
      introImage: asImageUrl(rawData, `introImage`),
      painPointsTitle: `Pain Points of The Client`,
      painPointsImage: `__VAR_beforestate__`,
      solutionsTitle: `How We Solved It`,
      solutionsImage: `__VAR_cureentstate__`,
      painPoints,
      solutions,
      postExecution: {
        image: asImageUrl(rawData, `inputOutputMainImage`),
        inputImages: [asImageUrl(rawData, `inputImage1`), asImageUrl(rawData, `inputImage2`)].filter(Boolean),
        outputImages: [asImageUrl(rawData, `outputImage1`), asImageUrl(rawData, `outputImage2`)].filter(Boolean),
        title: `Coordinated. Approved. Delivered.`,
        points: coordinatedPoints,
        sideImage: asImageUrl(rawData, `coordinatedSideImage`),
      },
    },
    caseStudyDetails: [
      { icon: `__VAR_CasestudyIcon1__`, type: `primary`, typeTitle: `Level of Development`, description: asText(rawData, `details.levelOfDevelopment`, ``) },
      { icon: `__VAR_CasestudyIcon2__`, type: `light`, typeTitle: `Project Area`, description: asText(rawData, `details.projectArea`, ``) },
      { icon: `__VAR_CasestudyIcon3__`, type: `primary`, typeTitle: `Location`, description: asText(rawData, `details.location`, ``) },
      { icon: `__VAR_CasestudyIcon1__`, type: `light`, typeTitle: `Tools Used`, description: toolsSummary },
    ],
    states: [
      {
        title: `Pain Points of The Client`,
        image: `__VAR_beforestate__`,
        points: painPoints,
        description: { sections: [{ title: `Execution Strategy`, text: asText(rawData, `executionStrategyDescription`, ``) }] },
      },
      {
        title: `How We Solved It`,
        image: `__VAR_cureentstate__`,
        points: solutions,
        description: { sections: [] },
      },
    ],
    imageSlider: {
      title: asText(rawData, `imageSlider.title`, `Project Images`),
      images: sliderImages,
    },
    teamStructure: {
      title: ``,
      teamStructureImage: ``,
    },
    features: {
      featuresTitle: `Tools Used`,
      featureTile: toolTiles,
    },
    workingMethodology: {
      title: `Execution Strategy`,
      description: asText(rawData, `executionStrategyDescription`, ``),
      steps: [],
      workingMethodologyImage: asImageUrl(rawData, `executionStrategyImage`),
    },
    tableSection: {
      title: asText(rawData, `tableSection.title`, ``),
      tableImage: asText(rawData, `tableSection.tableImage`, ``),
    },
    cta: {
      title: ``,
      btn: asText(rawData, `ctaButtonText`, `Start your project button`),
    },
  }
  return compact(out) || {}
}

function sanitizeComponentName(raw) {
  const base = String(raw || `GeneratedCaseStudy`)
    .replace(/[^a-zA-Z0-9_$]/g, `_`)
    .replace(/^[^a-zA-Z_$]/, `_`)
  return base || `GeneratedCaseStudy`
}

function generateCaseStudyPageFile({ formSlug, submission, componentImportPath, componentName }) {
  const data = buildCaseStudyData(submission?.data || {})
  const safeName = sanitizeComponentName(componentName || `CaseStudy_${formSlug}`)
  const importPath = componentImportPath || `./caseStudy1`
  const payload = JSON.stringify(data, null, 2)

  return `/**
 * Auto-generated from form "${formSlug}" submission "${submission?.id || ``}".
 * This file follows the same pattern as your architecture case-study page.
 */
import React from "react";
import CaseStudyComponent from "${importPath}";

const caseStudyData = ${payload};

const ${safeName} = () => {
  return <CaseStudyComponent data={caseStudyData} />;
};

export default ${safeName};
`
}

module.exports = { generateCaseStudyPageFile, buildCaseStudyData }
