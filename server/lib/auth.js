const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)

const JWT_SECRET = process.env.JWT_SECRET || `dev-jwt-secret-change-in-production`
const SALT_ROUNDS = 10

function hashPassword(plain) {
  return bcrypt.hash(String(plain || ``), SALT_ROUNDS)
}

function verifyPassword(plain, hash) {
  return bcrypt.compare(String(plain || ``), String(hash || ``))
}

function signToken({ id, email, role }) {
  return jwt.sign(
    {
      sub: id,
      email,
      role,
    },
    JWT_SECRET,
    { expiresIn: `7d` }
  )
}

function verifyToken(token) {
  return jwt.verify(String(token || ``), JWT_SECRET)
}

function authMiddleware({ optional = false } = {}) {
  return (req, res, next) => {
    const h = req.headers.authorization
    const raw = h && typeof h === `string` && h.startsWith(`Bearer `) ? h.slice(7) : null
    if (!raw) {
      if (optional) {
        req.user = null
        return next()
      }
      return res.status(401).json({ error: `Unauthorized` })
    }
    try {
      const payload = verifyToken(raw)
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role || `user`,
      }
      req.authToken = raw
      return next()
    } catch {
      return res.status(401).json({ error: `Invalid or expired token` })
    }
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== `admin`) {
    return res.status(403).json({ error: `Admin only` })
  }
  return next()
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  authMiddleware,
  requireAdmin,
}
