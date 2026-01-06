import Doctor from '../models/Doctor.js'
import Patient from '../models/Patient.js'
import { generateToken } from '../utils/generateToken.js'

export const doctorSignup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, specialty, yearsOfExperience } = req.body

    const doctorExists = await Doctor.findOne({ $or: [{ email }, { phoneNumber }] })

    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor already exists with this email or phone' })
    }

    const profilePicture = req.file ? req.file.filename : null

    if (!profilePicture) {
      return res.status(400).json({ message: 'Profile picture is required' })
    }

    const doctor = await Doctor.create({
      name,
      email,
      password,
      phoneNumber,
      specialty,
      yearsOfExperience,
      profilePicture
    })

    if (doctor) {
      res.status(201).json({
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          specialty: doctor.specialty,
          yearsOfExperience: doctor.yearsOfExperience,
          profilePicture: doctor.profilePicture,
          role: doctor.role
        },
        token: generateToken(doctor._id, doctor.role)
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const doctor = await Doctor.findOne({ email })

    if (doctor && (await doctor.matchPassword(password))) {
      res.json({
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          specialty: doctor.specialty,
          yearsOfExperience: doctor.yearsOfExperience,
          profilePicture: doctor.profilePicture,
          role: doctor.role
        },
        token: generateToken(doctor._id, doctor.role)
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const patientSignup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, age, historyOfSurgery, historyOfIllness } = req.body

    const patientExists = await Patient.findOne({ $or: [{ email }, { phoneNumber }] })

    if (patientExists) {
      return res.status(400).json({ message: 'Patient already exists with this email or phone' })
    }

    const profilePicture = req.file ? req.file.filename : null

    if (!profilePicture) {
      return res.status(400).json({ message: 'Profile picture is required' })
    }

    const illnessArray = historyOfIllness 
      ? historyOfIllness.split(',').map(item => item.trim()).filter(item => item)
      : []

    const patient = await Patient.create({
      name,
      email,
      password,
      phoneNumber,
      age,
      historyOfSurgery: historyOfSurgery || '',
      historyOfIllness: illnessArray,
      profilePicture
    })

    if (patient) {
      res.status(201).json({
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          age: patient.age,
          historyOfSurgery: patient.historyOfSurgery,
          historyOfIllness: patient.historyOfIllness,
          profilePicture: patient.profilePicture,
          role: patient.role
        },
        token: generateToken(patient._id, patient.role)
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const patient = await Patient.findOne({ email })

    if (patient && (await patient.matchPassword(password))) {
      res.json({
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          age: patient.age,
          historyOfSurgery: patient.historyOfSurgery,
          historyOfIllness: patient.historyOfIllness,
          profilePicture: patient.profilePicture,
          role: patient.role
        },
        token: generateToken(patient._id, patient.role)
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}