import express from 'express'
import { upload } from '../middlewares/upload.js'
import { 
  doctorSignup, 
  doctorLogin, 
  patientSignup, 
  patientLogin 
} from '../controllers/authController.js'

const router = express.Router()

router.post('/doctor/signup', upload.single('profilePicture'), doctorSignup)
router.post('/doctor/login', doctorLogin)
router.post('/patient/signup', upload.single('profilePicture'), patientSignup)
router.post('/patient/login', patientLogin)

export default router