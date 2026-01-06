import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/roleMiddleware.js'
import { getAllDoctors } from '../controllers/patientController.js'

const router = express.Router()

router.get('/doctors', protect, authorizeRole('PATIENT'), getAllDoctors)

export default router