const { MongoClient } = require(`mongodb`)

const uri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017`
const dbName = process.env.MONGODB_DB || `case_study_crm`

let client = null
let db = null

async function connectDb() {
  if (db) return db
  client = new MongoClient(uri)
  await client.connect()
  db = client.db(dbName)

  const forms = db.collection(`forms`)
  const submissions = db.collection(`submissions`)
  const users = db.collection(`users`)

  await forms.createIndex({ id: 1 }, { unique: true })
  await forms.createIndex({ slug: 1 }, { unique: true })
  await submissions.createIndex({ id: 1 }, { unique: true })
  await submissions.createIndex({ formId: 1 })
  await submissions.createIndex({ userId: 1 })
  await users.createIndex({ id: 1 }, { unique: true })
  await users.createIndex({ email: 1 }, { unique: true })

  return db
}

function docToForm(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description || ``,
    schema: doc.schema,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function docToSubmission(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    formId: doc.formId,
    userId: doc.userId || null,
    data: doc.data || {},
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function docToUserPublic(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    email: doc.email,
    role: doc.role || `user`,
    createdAt: doc.createdAt,
  }
}

async function getUserByEmail(email) {
  const doc = await db.collection(`users`).findOne({ email: String(email || ``).trim().toLowerCase() })
  return doc
}

async function getUserById(id) {
  const doc = await db.collection(`users`).findOne({ id })
  return doc
}

async function insertUser({ id, email, passwordHash, role = `user` }) {
  const now = new Date().toISOString()
  await db.collection(`users`).insertOne({
    id,
    email: String(email || ``).trim().toLowerCase(),
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now,
  })
  return getUserById(id)
}

async function listForms() {
  const rows = await db
    .collection(`forms`)
    .find({})
    .sort({ updatedAt: -1 })
    .toArray()
  return rows.map(docToForm)
}

async function getFormById(id) {
  const doc = await db.collection(`forms`).findOne({ id })
  return docToForm(doc)
}

async function getFormBySlug(slug) {
  const doc = await db.collection(`forms`).findOne({ slug })
  return docToForm(doc)
}

async function insertForm({ id, slug, title, description, schema }) {
  const now = new Date().toISOString()
  await db.collection(`forms`).insertOne({
    id,
    slug,
    title,
    description: description || ``,
    schema,
    createdAt: now,
    updatedAt: now,
  })
  return getFormById(id)
}

async function updateForm(id, { slug, title, description, schema }) {
  const existing = await getFormById(id)
  if (!existing) return null
  const now = new Date().toISOString()
  const next = {
    slug: slug !== undefined ? slug : existing.slug,
    title: title !== undefined ? title : existing.title,
    description: description !== undefined ? description : existing.description,
    schema: schema !== undefined ? schema : existing.schema,
  }
  await db.collection(`forms`).updateOne(
    { id },
    {
      $set: {
        slug: next.slug,
        title: next.title,
        description: next.description || ``,
        schema: next.schema,
        updatedAt: now,
      },
    }
  )
  return getFormById(id)
}

async function deleteForm(id) {
  const existing = await getFormById(id)
  if (!existing) return false
  await db.collection(`submissions`).deleteMany({ formId: id })
  const r = await db.collection(`forms`).deleteOne({ id })
  return r.deletedCount > 0
}

async function listSubmissions(formId, { userId, isAdmin } = {}) {
  const q = { formId }
  if (!isAdmin && userId) {
    q.userId = userId
  }
  const rows = await db
    .collection(`submissions`)
    .find(q)
    .sort({ updatedAt: -1 })
    .toArray()
  return rows.map(docToSubmission)
}

async function listRecentSubmissionsForRecentFiles({ userId, isAdmin }) {
  const q = isAdmin ? {} : { userId }
  const rows = await db
    .collection(`submissions`)
    .find(q)
    .sort({ updatedAt: -1 })
    .toArray()
  return rows.map(docToSubmission)
}

async function getSubmission(id) {
  const doc = await db.collection(`submissions`).findOne({ id })
  return docToSubmission(doc)
}

async function insertSubmission({ id, formId, data, userId }) {
  const now = new Date().toISOString()
  await db.collection(`submissions`).insertOne({
    id,
    formId,
    userId: userId || null,
    data: data || {},
    createdAt: now,
    updatedAt: now,
  })
  return getSubmission(id)
}

async function updateSubmission(id, data) {
  const existing = await getSubmission(id)
  if (!existing) return null
  const now = new Date().toISOString()
  const nextData = data !== undefined ? data : existing.data
  await db.collection(`submissions`).updateOne(
    { id },
    {
      $set: {
        data: nextData,
        updatedAt: now,
      },
    }
  )
  return getSubmission(id)
}

async function deleteSubmission(id) {
  const r = await db.collection(`submissions`).deleteOne({ id })
  return r.deletedCount > 0
}

async function closeDb() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

module.exports = {
  connectDb,
  closeDb,
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
}
