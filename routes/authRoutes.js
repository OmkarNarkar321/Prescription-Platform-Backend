import express from 'express'
import { upload } from '../middlewares/upload.js'
import { 
  doctorSignup, 
  doctorLogin, 
  patientSignup, 
  patientLogin 
} from '../controllers/authController.js'

const router = express.Router()

// Logging middleware for debugging
router.use((req, res, next) => {
  console.log(`🔐 Auth Route: ${req.method} ${req.path}`)
  console.log(`📍 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
})

// Doctor routes
router.post('/doctor/signup', upload.single('profilePicture'), doctorSignup)
router.post('/doctor/login', doctorLogin)

// Patient routes
router.post('/patient/signup', upload.single('profilePicture'), patientSignup)
router.post('/patient/login', patientLogin)

// Test route to verify auth routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  })
})

export default router