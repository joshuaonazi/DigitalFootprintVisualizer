require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()
app.set('trust proxy', 1) // the host sits behind a proxy
app.use(helmet())
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      student_id TEXT,
      faculty TEXT,
      password_hash TEXT NOT NULL,
      consent_given BOOLEAN NOT NULL DEFAULT FALSE,
      consent_at TIMESTAMPTZ,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS survey_responses (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      answers JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS risk_results (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      survey_id BIGINT REFERENCES survey_responses(id) ON DELETE SET NULL,
      overall_score INT NOT NULL,
      risk_tier TEXT NOT NULL,
      dimensions JSONB NOT NULL,
      top_threats JSONB,
      summary TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS quiz_results (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      phase TEXT NOT NULL CHECK (phase IN ('pre', 'post')),
      score INT NOT NULL,
      total INT NOT NULL,
      percentage INT NOT NULL,
      answers JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

const publicUser = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  studentId: u.student_id,
  faculty: u.faculty,
  consentGiven: u.consent_given,
  role: u.role,
})

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not signed in' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please sign in again.' })
  }
}

app.get('/api/health', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW() AS time')
    res.json({ status: 'ok', dbTime: r.rows[0].time })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'error', message: 'Database connection failed' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, studentId, faculty, password } = req.body || {}
    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' })
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ error: 'Enter a valid email address' })
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const hash = await bcrypt.hash(password, 12)
    const r = await pool.query(
      `INSERT INTO users (full_name, email, student_id, faculty, password_hash)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fullName.trim(), email.trim().toLowerCase(), studentId || null, faculty || null, hash]
    )
    const user = r.rows[0]
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'An account with this email already exists' })
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  skipSuccessfulRequests: true,
  message: { error: 'Too many failed attempts. Try again in 15 minutes.' },
})

app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })
    const r = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()])
    const user = r.rows[0]
    const ok = user && (await bcrypt.compare(password, user.password_hash))
    if (!ok) return res.status(401).json({ error: 'Incorrect email or password' })
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const r = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.sub])
  if (!r.rows[0]) return res.status(404).json({ error: 'User not found' })
  res.json({ user: publicUser(r.rows[0]) })
})

app.post('/api/auth/consent', requireAuth, async (req, res) => {
  const r = await pool.query(
    'UPDATE users SET consent_given = TRUE, consent_at = NOW() WHERE id = $1 RETURNING *',
    [req.user.sub]
  )
  res.json({ user: publicUser(r.rows[0]) })
})

// Next: endpoints for survey, risk results and quiz scores
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  })

const TIERS = ['Low', 'Medium', 'High', 'Critical']

const riskShape = (r) =>
  r && {
    overallScore: r.overall_score,
    riskTier: r.risk_tier,
    dimensions: r.dimensions,
    topThreats: r.top_threats,
    summary: r.summary,
    createdAt: r.created_at,
  }

const quizShape = (q) =>
  q && { score: q.score, total: q.total, percentage: q.percentage, phase: q.phase, createdAt: q.created_at }

app.post('/api/survey', requireAuth, wrap(async (req, res) => {
  const { answers } = req.body || {}
  if (!answers || typeof answers !== 'object' || Array.isArray(answers))
    return res.status(400).json({ error: 'Survey answers are required' })
  const r = await pool.query(
    'INSERT INTO survey_responses (user_id, answers) VALUES ($1, $2) RETURNING id',
    [req.user.sub, JSON.stringify(answers)]
  )
  res.status(201).json({ surveyId: r.rows[0].id })
}))

app.post('/api/risk', requireAuth, wrap(async (req, res) => {
  const { surveyId, overallScore, riskTier, dimensions, topThreats, summary } = req.body || {}
  if (!Number.isFinite(overallScore) || overallScore < 0 || overallScore > 100 ||
      !TIERS.includes(riskTier) || !dimensions || typeof dimensions !== 'object')
    return res.status(400).json({ error: 'Incomplete or invalid risk result' })
  const r = await pool.query(
    `INSERT INTO risk_results (user_id, survey_id, overall_score, risk_tier, dimensions, top_threats, summary)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.user.sub, surveyId || null, Math.round(overallScore), riskTier,
     JSON.stringify(dimensions), JSON.stringify(topThreats || []), summary || null]
  )
  res.status(201).json({ risk: riskShape(r.rows[0]) })
}))

app.get('/api/risk/latest', requireAuth, wrap(async (req, res) => {
  const r = await pool.query(
    'SELECT * FROM risk_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.sub])
  res.json({ risk: riskShape(r.rows[0]) || null })
}))

// First quiz a student takes is their 'pre' (baseline); later attempts are 'post'
app.post('/api/quiz', requireAuth, wrap(async (req, res) => {
  const { score, total, answers } = req.body || {}
  if (!Number.isInteger(score) || !Number.isInteger(total) || total <= 0 || score < 0 || score > total)
    return res.status(400).json({ error: 'Invalid quiz score' })
  const existing = await pool.query(
    "SELECT 1 FROM quiz_results WHERE user_id = $1 AND phase = 'pre' LIMIT 1", [req.user.sub])
  const phase = existing.rowCount === 0 ? 'pre' : 'post'
  const r = await pool.query(
    `INSERT INTO quiz_results (user_id, phase, score, total, percentage, answers)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.user.sub, phase, score, total, Math.round((score / total) * 100),
     JSON.stringify(answers || [])]
  )
  res.status(201).json({ quiz: quizShape(r.rows[0]) })
}))

app.get('/api/me/summary', requireAuth, wrap(async (req, res) => {
  const u = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.sub])
  if (!u.rows[0]) return res.status(404).json({ error: 'User not found' })
  const risk = await pool.query(
    'SELECT * FROM risk_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.sub])
  const pre = await pool.query(
    "SELECT * FROM quiz_results WHERE user_id = $1 AND phase = 'pre' ORDER BY created_at ASC LIMIT 1", [req.user.sub])
  const post = await pool.query(
    "SELECT * FROM quiz_results WHERE user_id = $1 AND phase = 'post' ORDER BY created_at DESC LIMIT 1", [req.user.sub])
  res.json({
    user: publicUser(u.rows[0]),
    risk: riskShape(risk.rows[0]) || null,
    quiz: { pre: quizShape(pre.rows[0]) || null, post: quizShape(post.rows[0]) || null },
  })
}))

const PORT = process.env.PORT || 5000
initDb()
  .then(() => app.listen(PORT, () => console.log(`DFV API running on port ${PORT}`)))
  .catch((err) => {
    console.error('Could not start. Database error:', err.message)
    process.exit(1)
  })