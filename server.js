import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import process from 'process'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import consultationRoutes from './routes/consultationRoutes.js'
import prescriptionRoutes from './routes/prescriptionRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://prescription-platform-frontend-bay.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true)
      
      // Check exact match or if it includes vercel.app
      const isAllowed = allowedOrigins.includes(origin) || 
                        (origin && origin.includes('vercel.app'))
      
      if (isAllowed) {
        callback(null, true)
      } else {
        console.log('⚠️ Blocked origin:', origin)
        callback(null, true) // Allow anyway for debugging
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
)

// ✅ REMOVED: app.options('*', cors()) - This was causing the error!
// The CORS middleware above already handles OPTIONS requests

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static('uploads'))

// Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`)
  next()
})

// Connect to Database
connectDB()

// Health check - ROOT
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Prescription Platform API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      patients: '/api/patients/*',
      consultations: '/api/consultations/*',
      prescriptions: '/api/prescriptions/*'
    }
  })
})

// Health check - /health
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/prescriptions', prescriptionRoutes)

// Test route to verify /api/auth works
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res, next) => {
  console.log('❌ 404 - Route not found:', req.method, req.path)
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server Started Successfully      ║
╟───────────────────────────────────────╢
║   Port: ${PORT}                       
║   Environment: ${process.env.NODE_ENV || 'development'}
║   API Base: http://localhost:${PORT}/api
╚═══════════════════════════════════════╝
  `)
})

export default app