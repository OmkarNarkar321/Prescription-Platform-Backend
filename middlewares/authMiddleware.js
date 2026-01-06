import jwt from 'jsonwebtoken'
import Doctor from '../models/Doctor.js'
import Patient from '../models/Patient.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      if (decoded.role === 'DOCTOR') {
        req.user = await Doctor.findById(decoded.id).select('-password')
      } else if (decoded.role === 'PATIENT') {
        req.user = await Patient.findById(decoded.id).select('-password')
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' })
      }

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}