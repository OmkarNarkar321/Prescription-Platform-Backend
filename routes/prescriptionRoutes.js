import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/roleMiddleware.js'
import { 
  createPrescription, 
  updatePrescription, 
  generatePDF 
} from '../controllers/prescriptionController.js'

const router = express.Router()

router.post('/:consultationId', protect, authorizeRole('DOCTOR'), createPrescription)
router.put('/:consultationId', protect, authorizeRole('DOCTOR'), updatePrescription)
router.get('/:consultationId/pdf', protect, authorizeRole('DOCTOR'), generatePDF)

export default router