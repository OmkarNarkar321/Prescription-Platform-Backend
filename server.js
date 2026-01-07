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

// CORS Configuration - Allow all Vercel deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://prescription-platform-frontend-bay.vercel.app',
  /^https:\/\/prescription-platform-frontend-.*\.vercel\.app$/
]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      // Check if origin matches allowed patterns
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin)
        }
        return allowedOrigin === origin
      })
      
      if (isAllowed) {
        callback(null, true)
      } else {
        console.log('Blocked origin:', origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  })
)

// Handle preflight requests
app.options('*', cors())

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// DB
connectDB()

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Prescription Platform API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/prescriptions', prescriptionRoutes)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
  console.log(`API URL: http://localhost:${PORT}`)
})