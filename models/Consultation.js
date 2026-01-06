import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  currentIllness: {
    type: String,
    required: true
  },
  recentSurgery: {
    type: String,
    default: ''
  },
  surgeryTimeSpan: {
    type: String,
    default: ''
  },
  isDiabetic: {
    type: Boolean,
    default: false
  },
  allergies: {
    type: String,
    default: ''
  },
  others: {
    type: String,
    default: ''
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  prescription: {
    careToBeTaken: {
      type: String,
      default: ''
    },
    medicines: {
      type: String,
      default: ''
    },
    prescribedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
})

export default mongoose.model('Consultation', consultationSchema)