const crypto = require(`crypto`)
const { listForms, insertForm, updateForm } = require(`./db`)

const DEMO_SCHEMA = {
  fields: [
    { id: `f0`, name: `pageName`, label: `Page name (download file name)`, type: `text`, placeholder: `abcd` },
    { id: `f1`, name: `bannerImage`, label: `Banner image (desktop)`, type: `image` },
    { id: `f2`, name: `bannerImageMobile`, label: `Banner image (mobile)`, type: `image` },
    { id: `f4`, name: `introImage`, label: `Intro image`, type: `image` },
    { id: `f5`, name: `introDescription`, label: `Intro description`, type: `textarea`, rows: 3 },
    { id: `f6`, name: `details.levelOfDevelopment`, label: `Level of development (value only)`, type: `text` },
    { id: `f7`, name: `details.projectArea`, label: `Project area (value only)`, type: `text` },
    { id: `f8`, name: `details.location`, label: `Location (value only)`, type: `text` },
    {
      id: `f9`,
      name: `painPoints`,
      label: `Pain points`,
      type: `list`,
      itemFields: [
        { key: `title`, label: `Title`, type: `text` },
        { key: `text`, label: `Description`, type: `textarea`, rows: 2 },
      ],
      addLabel: `+ Add pain point`,
    },
    {
      id: `f10`,
      name: `solutions`,
      label: `How We Solved It`,
      type: `list`,
      itemFields: [
        { key: `title`, label: `Title`, type: `text` },
        { key: `text`, label: `Description`, type: `textarea`, rows: 2 },
      ],
      addLabel: `+ Add solution`,
    },
    { id: `f11`, name: `executionStrategyDescription`, label: `Execution Strategy description`, type: `textarea`, rows: 3 },
    { id: `f12`, name: `executionStrategyImage`, label: `Execution Strategy image`, type: `image` },
    { id: `f13`, name: `inputOutputMainImage`, label: `Input/Output main image`, type: `image` },
    { id: `f14`, name: `inputImage1`, label: `View Inputs image 1`, type: `image` },
    { id: `f15`, name: `inputImage2`, label: `View Inputs image 2`, type: `image` },
    { id: `f16`, name: `outputImage1`, label: `View Outputs image 1`, type: `image` },
    { id: `f17`, name: `outputImage2`, label: `View Outputs image 2`, type: `image` },
    {
      id: `f18`,
      name: `coordinatedPoints`,
      label: `Coordinated. Approved. Delivered. points`,
      type: `list`,
      itemFields: [{ key: `text`, label: `Point`, type: `textarea`, rows: 2 }],
      addLabel: `+ Add point`,
    },
    { id: `f19`, name: `coordinatedSideImage`, label: `Coordinated section side image`, type: `image` },
    {
      id: `f20`,
      name: `toolsCount`,
      label: `Tools Used`,
      type: `radio`,
      defaultValue: `3`,
      options: [
        { value: `1`, label: `Revit` },
        { value: `2`, label: `Revit, Lumion` },
        { value: `3`, label: `Revit, Lumion, AutoCAD` },
      ],
    },
    { id: `f21`, name: `ctaButtonText`, label: `CTA button text`, type: `text`, defaultValue: `Start your project button` },
    {
      id: `f22`,
      name: `caseStudyPdfUrl`,
      label: `Case study PDF URL`,
      type: `text`,
      placeholder: `https://www.virtualbuildingstudio.com/resources/your-case-study.pdf`,
      helpText: `Optional. When set, the floating “Download PDF” button links to this URL.`,
    },
  ],
}

async function seedIfEmpty() {
  const forms = await listForms()
  if (forms.length > 0) return
  const id = crypto.randomUUID()
  await insertForm({
    id,
    slug: `demo-case-study`,
    title: `Demo case study`,
    description: `Sample form — replace with your design later.`,
    schema: DEMO_SCHEMA,
  })
  console.log(`Seeded demo form: demo-case-study`)
}

async function ensureDemoForm() {
  const forms = await listForms()
  const existing = forms.find((f) => f.slug === `demo-case-study`)
  if (existing) {
    // Keep demo slug always aligned with latest dynamic schema definition.
    return updateForm(existing.id, {
      title: `Demo case study`,
      description: `Sample form — replace with your design later.`,
      schema: DEMO_SCHEMA,
    })
  }
  const id = crypto.randomUUID()
  await insertForm({
    id,
    slug: `demo-case-study`,
    title: `Demo case study`,
    description: `Sample form — replace with your design later.`,
    schema: DEMO_SCHEMA,
  })
  return { id, slug: `demo-case-study` }
}

module.exports = { seedIfEmpty, ensureDemoForm, DEMO_SCHEMA }
