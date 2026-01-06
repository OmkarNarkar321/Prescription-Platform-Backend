import PDFDocument from 'pdfkit'
import { generateQRCode } from './generateQR.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generatePrescriptionPDF = async (consultation, doctor) => {
  // ✅ async work belongs here
  const qrData = `Prescription ID: ${consultation._id}
Doctor: ${doctor.name}
Patient: ${consultation.patientId.name}
Date: ${new Date().toLocaleDateString()}`

  const qrCodeDataURL = await generateQRCode(qrData)
  const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '')
  const qrBuffer = Buffer.from(base64Data, 'base64')

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const uploadDir = path.join(__dirname, '../uploads/prescriptions')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `prescription_${consultation._id}.pdf`
    const filePath = path.join(uploadDir, fileName)
    const writeStream = fs.createWriteStream(filePath)

    doc.pipe(writeStream)

    // Header
    doc.rect(0, 0, doc.page.width, 60).fill('#1E40AF')
    doc.fontSize(20).fillColor('#FFFFFF').text(`Dr. ${doctor.name}`, 50, 20)
    doc.fontSize(10).text('Address: address will go here', 50, 45)

    doc
      .fontSize(12)
      .fillColor('#000000')
      .text(
        `Date: ${new Date(consultation.createdAt).toLocaleDateString()}`,
        400,
        20
      )

    // Care instructions
    doc.moveDown(3)
    doc.fontSize(16).fillColor('#1E40AF').text('Care to be taken', {
      underline: true,
    })
    doc.moveDown(0.5)

    doc.fontSize(11).fillColor('#000000').text(
      consultation.prescription?.careToBeTaken || 'Not specified',
      { width: 500 }
    )

    // Medicines
    doc.moveDown(2)
    doc.fontSize(16).fillColor('#1E40AF').text('Medicine', { underline: true })
    doc.moveDown(0.5)

    doc.fontSize(11).fillColor('#000000').text(
      consultation.prescription?.medicines || 'Not specified',
      { width: 500 }
    )

    // QR Code
    doc.moveDown(4)
    doc.image(qrBuffer, 50, doc.y, { width: 100 })

    // Signature
    doc.moveDown(8)
    doc.fontSize(12).text('Name of doctor', 400, doc.y - 40, {
      align: 'right',
    })
    doc.moveTo(400, doc.y + 5).lineTo(550, doc.y + 5).stroke()

    // Footer
    doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill('#1E40AF')

    doc.end()

    writeStream.on('finish', () => resolve(filePath))
    writeStream.on('error', reject)
  })
}
