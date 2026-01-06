import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import process from 'process'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import consultationRoutes from './routes/consultationRoutes.js'
import prescriptionRoutes from './routes/prescriptionRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/prescriptions', prescriptionRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Prescription Platform API is running' })
})

app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!', error: err.message })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})