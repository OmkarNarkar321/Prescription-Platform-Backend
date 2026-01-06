import QRCode from 'qrcode'

export const generateQRCode = async (data) => {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrDataURL
  } catch (error) {
    console.error('QR Code generation error:', error)
    throw error
  }
}