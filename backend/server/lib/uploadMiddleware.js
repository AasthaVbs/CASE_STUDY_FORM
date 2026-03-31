const path = require(`path`)
const fs = require(`fs`)
const multer = require(`multer`)

const publicRoot = path.join(__dirname, `..`, `..`, `public`)
const uploadDir = path.join(publicRoot, `images`, `case-study`)

function ensureUploadDir() {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadDir()
    cb(null, uploadDir)
  },
  filename(_req, file, cb) {
    let base = path.basename(file.originalname || ``) || `file`
    base = base.replace(/[/\\]/g, `_`)
    cb(null, base || `file-${Date.now()}.jpg`)
  },
})

const uploadImage = multer({
  storage,
  limits: {
    fileSize: Number(process.env.UPLOAD_MAX_BYTES) || 12 * 1024 * 1024,
  },
  fileFilter(_req, file, cb) {
    const ok =
      /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(file.mimetype) ||
      file.mimetype === `image/jpg` ||
      file.mimetype === `image/svg+xml`
    if (ok) cb(null, true)
    else cb(new Error(`Only image files are allowed (jpeg, png, gif, webp, svg)`))
  },
})

module.exports = { uploadImage, uploadDir, publicUrlPath: `/images/case-study` }
