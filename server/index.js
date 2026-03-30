require(`dotenv`).config()
const path = require(`path`)
const express = require(`express`)
const cors = require(`cors`)
const crypto = require(`crypto`)

const {
  connectDb,
  listForms,
  getFormById,
  getFormBySlug,
  insertForm,
  updateForm,
  deleteForm,
  listSubmissions,
  listRecentSubmissionsForRecentFiles,
  getSubmission,
  insertSubmission,
  updateSubmission,
  deleteSubmission,
  getUserByEmail,
  getUserById,
  insertUser,
  docToUserPublic,
} = require(`./db`)
const {
  hashPassword,
  verifyPassword,
  signToken,
  authMiddleware,
  requireAdmin,
} = require(`./lib/auth`)
const { generateReactComponentFile } = require(`./lib/generateComponent`)
const { generateCaseStudyPageFile } = require(`./lib/generateCaseStudyPage`)
const { generateFullCaseStudySourceFile } = require(`./lib/generateFullCaseStudySource`)
const { uploadImage, publicUrlPath } = require(`./lib/uploadMiddleware`)
const { seedIfEmpty, ensureDemoForm } = require(`./seed`)

const app = express()
const PORT = Number(process.env.API_PORT) || 3001

const authRequired = authMiddleware({ optional: false })

app.use(cors())
app.use(express.json({ limit: `2mb` }))

function canAccessSubmission(sub, user) {
  if (!sub || !user) return false
  if (user.role === `admin`) return true
  return sub.userId && sub.userId === user.id
}

function normalizeEmail(e) {
  return String(e || ``).trim().toLowerCase()
}

app.post(`/api/auth/register`, async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    const em = normalizeEmail(email)
    if (!em || !password) return res.status(400).json({ error: `Email and password required` })
    if (String(password).length < 6) return res.status(400).json({ error: `Password must be at least 6 characters` })

    const adminEmail = process.env.ADMIN_EMAIL ? normalizeEmail(process.env.ADMIN_EMAIL) : ``
    if (adminEmail && em === adminEmail) {
      return res.status(403).json({
        error: `This email is reserved for the administrator account created from your server configuration. Sign in on the home page or use Admin login — do not register again. Use a different email to create a new user account.`,
      })
    }

    const existing = await getUserByEmail(em)
    if (existing) {
      const msg =
        existing.role === `admin`
          ? `This email is already registered as an administrator. Sign in instead of registering.`
          : `Email already registered. Try signing in instead.`
      return res.status(409).json({ error: msg })
    }

    const id = crypto.randomUUID()
    const passwordHash = await hashPassword(password)
    await insertUser({ id, email: em, passwordHash, role: `user` })
    const user = await getUserById(id)
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    res.status(201).json({ token, user: docToUserPublic(user) })
  } catch (e) {
    if (e && e.code === 11000) {
      return res.status(409).json({ error: `Email already registered. Try signing in instead.` })
    }
    console.error(`register`, e)
    next(e)
  }
})

app.post(`/api/auth/login`, async (req, res, next) => {
  try {
    const { email, password, asAdmin } = req.body || {}
    const em = normalizeEmail(email)
    if (!em || !password) return res.status(400).json({ error: `Email and password required` })
    const user = await getUserByEmail(em)
    if (!user) return res.status(401).json({ error: `Invalid credentials` })
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: `Invalid credentials` })
    if (asAdmin && user.role !== `admin`) {
      return res.status(403).json({ error: `Not an admin account` })
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    res.json({ token, user: docToUserPublic(user) })
  } catch (e) {
    next(e)
  }
})

app.get(`/api/auth/me`, authRequired, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id)
    if (!user) return res.status(401).json({ error: `User not found` })
    res.json(docToUserPublic(user))
  } catch (e) {
    next(e)
  }
})

app.post(`/api/upload`, authRequired, uploadImage.single(`file`), (req, res) => {
  if (!req.file) return res.status(400).json({ error: `no file` })
  const url = `${publicUrlPath}/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
})

app.use(express.static(path.join(__dirname, `..`, `public`)))

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, `-`)
    .replace(/^-|-$/g, ``) || `form`
}

function normalizeSchema(body) {
  const schema = body.schema || {}
  const fields = Array.isArray(schema.fields) ? schema.fields : []
  const normalized = fields.map((f, i) => ({
    id: f.id || `f_${i + 1}`,
    name: f.name || f.id || `field_${i + 1}`,
    label: f.label || f.name || `Field ${i + 1}`,
    type: f.type || `text`,
    required: !!f.required,
    placeholder: f.placeholder || ``,
    helpText: f.helpText || ``,
    defaultValue: Object.prototype.hasOwnProperty.call(f || {}, `defaultValue`) ? f.defaultValue : undefined,
    rows: f.rows,
    addLabel: f.addLabel || ``,
    itemFields: Array.isArray(f.itemFields) ? f.itemFields : undefined,
    options: Array.isArray(f.options) ? f.options : undefined,
  }))
  return { ...schema, fields: normalized }
}

function isDuplicateKeyError(e) {
  return e && e.code === 11000
}

function sanitizeJsFileBase(input, fallback) {
  const raw = String(input || ``).trim()
  const base = (raw || fallback || `case-study`).replace(/[^a-zA-Z0-9-_]/g, `-`).replace(/-+/g, `-`).replace(/^-|-$/g, ``)
  return base || `case-study`
}

app.get(`/api/health`, (_req, res) => {
  res.json({ ok: true, service: `case-study-form-api`, db: `mongodb` })
})

app.get(`/api/forms`, authRequired, requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listForms())
  } catch (e) {
    next(e)
  }
})

app.get(`/api/recent-files`, authRequired, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === `admin`
    const subs = await listRecentSubmissionsForRecentFiles({ userId: req.user.id, isAdmin })
    const forms = await listForms()
    const formMap = new Map(forms.map((f) => [f.id, f]))
    const rows = []
    for (const sub of subs) {
      const form = formMap.get(sub.formId)
      if (!form) continue
      const pageName = sub?.data?.pageName
      const filename = `${sanitizeJsFileBase(pageName, form.slug)}.js`
      rows.push({
        formId: form.id,
        formSlug: form.slug,
        formTitle: form.title,
        submissionId: sub.id,
        updatedAt: sub.updatedAt,
        pageName: pageName || ``,
        filename,
        folderPath: form.slug,
        relativePath: `${form.slug}/${filename}`,
        downloadUrl: `/api/forms/${encodeURIComponent(form.id)}/submissions/${encodeURIComponent(
          sub.id
        )}/generate-case-study-full.js`,
      })
    }
    rows.sort((a, b) => String(b.updatedAt || ``).localeCompare(String(a.updatedAt || ``)))
    res.json(rows)
  } catch (e) {
    next(e)
  }
})

app.post(`/api/forms`, authRequired, requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, description, schema } = req.body || {}
    if (!title) return res.status(400).json({ error: `title is required` })
    const id = crypto.randomUUID()
    let finalSlug = slugify(slug || title)
    let attempt = 0
    while ((await getFormBySlug(finalSlug)) && attempt < 20) {
      finalSlug = `${slugify(slug || title)}-${crypto.randomBytes(3).toString(`hex`)}`
      attempt += 1
    }
    try {
      const form = await insertForm({
        id,
        slug: finalSlug,
        title,
        description: description || ``,
        schema: normalizeSchema({ schema }),
      })
      res.status(201).json(form)
    } catch (e) {
      if (isDuplicateKeyError(e)) {
        return res.status(409).json({ error: `slug already exists`, slug: finalSlug })
      }
      throw e
    }
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/by-slug/:slug`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormBySlug(req.params.slug)
    if (!form) return res.status(404).json({ error: `not found` })
    res.json(form)
  } catch (e) {
    next(e)
  }
})

app.post(`/api/forms/ensure-demo`, authRequired, async (_req, res, next) => {
  try {
    const ensured = await ensureDemoForm()
    const form = await getFormBySlug(`demo-case-study`)
    res.status(200).json(form || ensured)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:id`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id)
    if (!form) return res.status(404).json({ error: `not found` })
    res.json(form)
  } catch (e) {
    next(e)
  }
})

app.put(`/api/forms/:id`, authRequired, requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, description, schema } = req.body || {}
    const updated = await updateForm(req.params.id, {
      title,
      slug: slug !== undefined ? slugify(slug) : undefined,
      description,
      schema: schema !== undefined ? normalizeSchema({ schema }) : undefined,
    })
    if (!updated) return res.status(404).json({ error: `not found` })
    res.json(updated)
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return res.status(409).json({ error: `slug already exists` })
    }
    next(e)
  }
})

app.delete(`/api/forms/:id`, authRequired, requireAdmin, async (req, res, next) => {
  try {
    const ok = await deleteForm(req.params.id)
    if (!ok) return res.status(404).json({ error: `not found` })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:id/submissions`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id)
    if (!form) return res.status(404).json({ error: `not found` })
    const isAdmin = req.user.role === `admin`
    res.json(await listSubmissions(req.params.id, { userId: req.user.id, isAdmin }))
  } catch (e) {
    next(e)
  }
})

app.post(`/api/forms/:id/submissions`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id)
    if (!form) return res.status(404).json({ error: `not found` })
    const id = crypto.randomUUID()
    const data = (req.body && req.body.data) || {}
    const sub = await insertSubmission({ id, formId: req.params.id, data, userId: req.user.id })
    res.status(201).json(sub)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/submissions/:id`, authRequired, async (req, res, next) => {
  try {
    const sub = await getSubmission(req.params.id)
    if (!sub) return res.status(404).json({ error: `not found` })
    if (!canAccessSubmission(sub, req.user)) return res.status(403).json({ error: `Forbidden` })
    res.json(sub)
  } catch (e) {
    next(e)
  }
})

app.put(`/api/submissions/:id`, authRequired, async (req, res, next) => {
  try {
    const existing = await getSubmission(req.params.id)
    if (!existing) return res.status(404).json({ error: `not found` })
    if (!canAccessSubmission(existing, req.user)) return res.status(403).json({ error: `Forbidden` })
    const data = (req.body && req.body.data) !== undefined ? req.body.data : undefined
    const updated = await updateSubmission(req.params.id, data)
    if (!updated) return res.status(404).json({ error: `not found` })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

app.delete(`/api/submissions/:id`, authRequired, async (req, res, next) => {
  try {
    const existing = await getSubmission(req.params.id)
    if (!existing) return res.status(404).json({ error: `not found` })
    if (!canAccessSubmission(existing, req.user)) return res.status(403).json({ error: `Forbidden` })
    const ok = await deleteSubmission(req.params.id)
    if (!ok) return res.status(404).json({ error: `not found` })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:id/generate.js`, authRequired, requireAdmin, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id)
    if (!form) return res.status(404).json({ error: `not found` })
    const importPath =
      req.query.importPath ||
      process.env.GENERATED_IMPORT_PATH ||
      `../../components/reference/ReferenceCaseStudyForm`
    const componentName = req.query.componentName || ``
    const name =
      componentName ||
      `GeneratedForm_${form.slug.replace(/[^a-zA-Z0-9_]/g, `_`)}`.replace(/^[^a-zA-Z_$]/, `_`)

    const code = generateReactComponentFile({
      form,
      importPath,
      componentName: name,
    })

    const filename = `${form.slug || `form`}.js`
    res.setHeader(`Content-Type`, `text/javascript; charset=utf-8`)
    res.setHeader(`Content-Disposition`, `attachment; filename="${filename}"`)
    res.send(code)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:formId/submissions/:submissionId/generate-case-study.js`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.formId)
    if (!form) return res.status(404).json({ error: `form not found` })

    const submission = await getSubmission(req.params.submissionId)
    if (!submission || submission.formId !== form.id) {
      return res.status(404).json({ error: `submission not found` })
    }
    if (!canAccessSubmission(submission, req.user)) return res.status(403).json({ error: `Forbidden` })

    const componentImportPath = req.query.componentImportPath || `./caseStudy1`
    const componentName =
      req.query.componentName ||
      `ArchitectureOutsourceServicesCaseStudy_${submission.id.slice(0, 8)}`

    const code = generateCaseStudyPageFile({
      formSlug: form.slug,
      submission,
      componentImportPath,
      componentName,
    })

    const filename = `${form.slug || `case-study`}-${submission.id.slice(0, 8)}.js`
    res.setHeader(`Content-Type`, `text/javascript; charset=utf-8`)
    res.setHeader(`Content-Disposition`, `attachment; filename="${filename}"`)
    res.send(code)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:formId/submissions/:submissionId/generate-case-study-preview`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.formId)
    if (!form) return res.status(404).json({ error: `form not found` })

    const submission = await getSubmission(req.params.submissionId)
    if (!submission || submission.formId !== form.id) {
      return res.status(404).json({ error: `submission not found` })
    }
    if (!canAccessSubmission(submission, req.user)) return res.status(403).json({ error: `Forbidden` })

    const componentImportPath = req.query.componentImportPath || `./caseStudy1`
    const componentName =
      req.query.componentName ||
      `ArchitectureOutsourceServicesCaseStudy_${submission.id.slice(0, 8)}`

    const code = generateCaseStudyPageFile({
      formSlug: form.slug,
      submission,
      componentImportPath,
      componentName,
    })

    res.setHeader(`Content-Type`, `text/plain; charset=utf-8`)
    res.send(code)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:formId/submissions/:submissionId/generate-case-study-full.js`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.formId)
    if (!form) return res.status(404).json({ error: `form not found` })
    const submission = await getSubmission(req.params.submissionId)
    if (!submission || submission.formId !== form.id) {
      return res.status(404).json({ error: `submission not found` })
    }
    if (!canAccessSubmission(submission, req.user)) return res.status(403).json({ error: `Forbidden` })
    const code = generateFullCaseStudySourceFile({ formSlug: form.slug, submission })
    const pageName = submission?.data?.pageName
    const filename = `${sanitizeJsFileBase(pageName, form.slug)}.js`
    res.setHeader(`Content-Type`, `text/javascript; charset=utf-8`)
    res.setHeader(`Content-Disposition`, `attachment; filename="${filename}"`)
    res.send(code)
  } catch (e) {
    next(e)
  }
})

app.get(`/api/forms/:formId/submissions/:submissionId/generate-case-study-full-preview`, authRequired, async (req, res, next) => {
  try {
    const form = await getFormById(req.params.formId)
    if (!form) return res.status(404).json({ error: `form not found` })
    const submission = await getSubmission(req.params.submissionId)
    if (!submission || submission.formId !== form.id) {
      return res.status(404).json({ error: `submission not found` })
    }
    if (!canAccessSubmission(submission, req.user)) return res.status(403).json({ error: `Forbidden` })
    const code = generateFullCaseStudySourceFile({ formSlug: form.slug, submission })
    res.setHeader(`Content-Type`, `text/plain; charset=utf-8`)
    res.send(code)
  } catch (e) {
    next(e)
  }
})

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  if (err && err.code === `LIMIT_FILE_SIZE`) {
    return res.status(400).json({ error: `File too large` })
  }
  if (err && err.message && String(err.message).includes(`Only image`)) {
    return res.status(400).json({ error: err.message })
  }
  res.status(500).json({ error: `server error` })
})

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return
  const existing = await getUserByEmail(email)
  if (existing) return
  const id = crypto.randomUUID()
  const passwordHash = await hashPassword(password)
  await insertUser({ id, email, passwordHash, role: `admin` })
  console.log(`Seeded admin user: ${email}`)
}

async function main() {
  await connectDb()
  await seedIfEmpty()
  await ensureDemoForm()
  await ensureAdminUser()
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`MongoDB: ${process.env.MONGODB_URI || `mongodb://127.0.0.1:27017`} / ${process.env.MONGODB_DB || `case_study_crm`}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
