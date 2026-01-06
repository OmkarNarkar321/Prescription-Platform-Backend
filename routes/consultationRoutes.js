import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/roleMiddleware.js'
import { 
  createConsultation, 
  getPatientConsultations, 
  getDoctorConsultations,
  getConsultationById 
} from '../controllers/consultationController.js'

const router = express.Router()

router.post('/', protect, authorizeRole('PATIENT'), createConsultation)
router.get('/patient', protect, authorizeRole('PATIENT'), getPatientConsultations)
router.get('/doctor', protect, authorizeRole('DOCTOR'), getDoctorConsultations)
router.get('/:id', protect, getConsultationById)

export default router