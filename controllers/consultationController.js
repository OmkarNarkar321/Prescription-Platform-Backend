import Consultation from '../models/Consultation.js'

export const createConsultation = async (req, res) => {
  try {
    const {
      doctorId,
      currentIllness,
      recentSurgery,
      surgeryTimeSpan,
      isDiabetic,
      allergies,
      others,
      transactionId
    } = req.body

    const consultation = await Consultation.create({
      doctorId,
      patientId: req.user._id,
      currentIllness,
      recentSurgery,
      surgeryTimeSpan,
      isDiabetic,
      allergies,
      others,
      transactionId
    })

    res.status(201).json({ 
      message: 'Consultation created successfully',
      consultation 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPatientConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.user._id })
      .populate('doctorId', '-password')
      .sort({ createdAt: -1 })

    res.json({ consultations })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDoctorConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.user._id })
      .populate('patientId', '-password')
      .sort({ createdAt: -1 })

    res.json({ consultations })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('doctorId', '-password')
      .populate('patientId', '-password')

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    if (req.user.role === 'DOCTOR' && consultation.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (req.user.role === 'PATIENT' && consultation.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    res.json({ consultation })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}