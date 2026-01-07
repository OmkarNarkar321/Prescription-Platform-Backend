import express from 'express'
import { upload } from '../middlewares/upload.js'
import { 
  doctorSignup, 
  doctorLogin, 
  patientSignup, 
  patientLogin 
} from '../controllers/authController.js'

const router = express.Router()

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`🔐 Auth Route: ${req.method} ${req.path}`)
  next()
})

router.post('/doctor/signup', upload.single('profilePicture'), doctorSignup)
router.post('/doctor/login', doctorLogin)
router.post('/patient/signup', upload.single('profilePicture'), patientSignup)
router.post('/patient/login', patientLogin)

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes are working!' })
})

export default router