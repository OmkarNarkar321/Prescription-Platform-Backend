import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  historyOfSurgery: {
    type: String,
    default: ''
  },
  historyOfIllness: {
    type: [String],
    default: []
  },
  profilePicture: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'PATIENT',
    immutable: true
  }
}, {
  timestamps: true
})

patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

patientSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('Patient', patientSchema)