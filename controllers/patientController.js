import Doctor from '../models/Doctor.js'

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password')
    res.json({ doctors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}