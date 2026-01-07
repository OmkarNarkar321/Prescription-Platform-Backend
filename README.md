> **📘 Backend – Online Prescription Platform**
🩺 Project Overview

This is the backend REST API for the Online Prescription Platform built with Node.js, Express, and MongoDB.
It handles authentication, role-based access, consultations, prescription PDFs, and QR code generation.

🚀 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Multer (file uploads)

PDFKit / pdf-lib

qrcode

dotenv

CORS enabled

📁 Folder Structure
backend/
├─ server.js            # App entry point
├─ package.json
├─ .env.example
├─ config/
│  └─ db.js             # MongoDB connection
├─ models/
│  ├─ Doctor.js
│  ├─ Patient.js
│  ├─ Consultation.js
│  └─ Prescription.js
├─ controllers/
│  ├─ authController.js
│  ├─ consultationController.js
│  └─ prescriptionController.js
├─ routes/
│  ├─ doctorRoutes.js
│  ├─ patientRoutes.js
│  ├─ consultationRoutes.js
│  └─ prescriptionRoutes.js
├─ middlewares/
│  ├─ authMiddleware.js
│  └─ roleMiddleware.js
├─ utils/
│  ├─ generatePDF.js
│  └─ generateQR.js
└─ uploads/             # Images & PDFs

🔐 Authentication Flow

JWT issued on login

Role stored in token

Middleware protects routes by role

🌐 API Routes
🔑 Auth Routes
Method	Endpoint	Description
POST	/api/doctor/signup	Doctor signup
POST	/api/doctor/login	Doctor login
POST	/api/patient/signup	Patient signup
POST	/api/patient/login	Patient login
🧑‍🦱 Patient APIs
Method	Endpoint	Description
GET	/api/doctors	Fetch doctors list
POST	/api/consultations	Create consultation
👨‍⚕️ Doctor APIs
Method	Endpoint	Description
GET	/api/consultations	View assigned consultations
POST	/api/prescriptions/:id	Create prescription
PUT	/api/prescriptions/:id	Update prescription
GET	/api/prescriptions/pdf/:id	Download PDF
📄 Prescription PDF

Generated using PDFKit / pdf-lib

Includes:

Doctor details
Patient details
Medicines
Care instructions
QR code reference

⚙️ Environment Variables

Create .env in /backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/prescription_db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

▶️ Setup Instructions
cd backend
npm install
npm run dev

🛡️ Security & Production Readiness

JWT-based auth
Role-protected APIs
CORS configured
Environment-based configs
Modular architecture

✅ Assessment-Ready Highlights

Clean separation of concerns
Scalable folder structure
Real-world API design
Secure authentication flow

PDF & QR code integration
