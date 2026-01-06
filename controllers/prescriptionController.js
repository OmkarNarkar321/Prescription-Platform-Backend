import Consultation from '../models/Consultation.js'
import { generatePrescriptionPDF } from '../utils/generatePDF.js'
import fs from 'fs'

export const createPrescription = async (req, res) => {
  try {
    const { careToBeTaken, medicines } = req.body
    const consultationId = req.params.consultationId

    const consultation = await Consultation.findById(consultationId)
      .populate('doctorId')
      .populate('patientId')

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    if (consultation.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    consultation.prescription = {
      careToBeTaken,
      medicines,
      prescribedAt: new Date()
    }
    consultation.status = 'completed'

    await consultation.save()

    res.json({ 
      message: 'Prescription created successfully',
      consultation 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updatePrescription = async (req, res) => {
  try {
    const { careToBeTaken, medicines } = req.body
    const consultationId = req.params.consultationId

    const consultation = await Consultation.findById(consultationId)
      .populate('doctorId')
      .populate('patientId')

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    if (consultation.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    consultation.prescription.careToBeTaken = careToBeTaken
    consultation.prescription.medicines = medicines
    consultation.prescription.prescribedAt = new Date()

    await consultation.save()

    res.json({ 
      message: 'Prescription updated successfully',
      consultation 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const generatePDF = async (req, res) => {
  try {
    const consultationId = req.params.consultationId

    const consultation = await Consultation.findById(consultationId)
      .populate('doctorId')
      .populate('patientId')

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    if (!consultation.prescription || !consultation.prescription.careToBeTaken) {
      return res.status(400).json({ message: 'Prescription not completed yet' })
    }

    if (consultation.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const pdfPath = await generatePrescriptionPDF(consultation, consultation.doctorId)

    res.download(pdfPath, `prescription_${consultationId}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading file:', err)
      }
      fs.unlinkSync(pdfPath)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}