## SmartMed-AI - AI-Powered Doctor Matching & Telehealth Platform

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat)

---

## 1. PROJECT OVERVIEW

SmartMed-AI is an **AI-assisted doctor-patient matching platform** that connects patients with the right medical specialists in seconds. The system uses keyword-based symptom analysis to automatically map patient complaints to the correct specialization, removing the guesswork of choosing a doctor. Patients can browse verified profiles, book online or physical consultations, and chat directly with doctors through an integrated messaging system. When a doctor is unavailable, an AI-powered chatbot automatically engages the patient, collects their information, and notifies the doctor by email — ensuring no inquiry is ever missed.

Built as a full-stack healthcare solution, SmartMed-AI combines a lightweight vanilla JavaScript frontend with a Firebase-backed Node.js API, demonstrating a production-style architecture for telehealth applications without the overhead of a heavy frontend framework.

### System Workflow

```
Patient describes symptoms
        ↓
AI Symptom Matcher maps keywords → Specialization
        ↓
Filtered doctor list (city, rating, availability, consultation type)
        ↓
Patient books appointment OR sends a chat message
        ↓
   ┌────────────────┴────────────────┐
   ↓                                 ↓
Doctor Online                  Doctor Offline
   ↓                                 ↓
Direct reply in dashboard      AI Chatbot auto-replies
                                       ↓
                                Email notification sent to doctor
```

---

## 2. KEY FEATURES

| Feature | Description |
|---|---|
| **AI Symptom Matching** | Keyword-mapping engine translates natural-language symptoms (e.g. "chest pain") into the correct medical specialization (e.g. Cardiologist) |
| **Doctor Discovery & Filters** | Search and filter doctors by specialization, city, consultation type, availability, and minimum experience |
| **Appointment Booking** | Patients select date, time slot, and consultation type (Online/Physical) with real-time booking confirmation |
| **Doctor Dashboard** | Doctors manage appointments (confirm/cancel), toggle live availability, and update their professional profile |
| **Patient Dashboard** | Patients track all appointments by status (pending, confirmed, cancelled) in a unified view |
| **AI Chatbot Auto-Reply** | When a doctor is marked unavailable, an automated chatbot responds to patient messages instantly |
| **Email Notifications** | Doctors receive an email alert for every new patient message via Nodemailer + Gmail SMTP |
| **Rating & Reviews** | Patients can rate doctors after a consultation |
| **Firebase Authentication** | Secure email/password authentication with role-based access control (Patient vs Doctor) |
| **Profile Picture Upload** | Doctors can upload a profile photo, stored and served via Multer |
| **Responsive UI** | Fully responsive layout across desktop, tablet, and mobile breakpoints |

---

## 3. TECH STACK

### Frontend
- **HTML5** — Semantic markup across all pages
- **CSS3** — Custom design system (no frameworks), CSS variables, Sora + Instrument Serif typography
- **Vanilla JavaScript (ES6+)** — Modular API layer, no build step required

### Backend
- **Node.js** — Runtime environment
- **Express.js** — REST API framework
- **Firebase Admin SDK** — Server-side authentication verification and Firestore access
- **Multer** — Multipart form-data handling for profile picture uploads
- **Nodemailer** — Transactional email delivery via Gmail SMTP
- **CORS** — Cross-origin resource sharing configuration
- **dotenv** — Environment variable management

### Database & Auth
- **Firebase Authentication** — Email/password user management with custom role claims
- **Firebase Firestore** — NoSQL document database for users, doctors, appointments, and messages

### Tooling
- **Nodemon** — Auto-restart development server
- **Git & GitHub** — Version control

---

## 4. FOLDER STRUCTURE

```
SmartMed-AI/
│
├── backend/
│   ├── config/
│   │   ├── firebase.js          # Firebase Admin SDK initialization
│   │   └── db.js                # Firestore connection check
│   ├── controllers/
│   │   ├── authController.js    # Register / Login logic
│   │   ├── doctorController.js  # Doctor profile + search logic
│   │   ├── appointmentController.js
│   │   └── chatController.js    # Messaging + AI auto-reply trigger
│   ├── middleware/
│   │   ├── auth.middleware.js   # Firebase ID token verification
│   │   └── upload.middleware.js # Multer config for image uploads
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   ├── appointment.routes.js
│   │   └── chat.routes.js
│   ├── services/
│   │   ├── chatbotService.js    # Keyword-based auto-reply engine
│   │   └── emailService.js      # Nodemailer transporter + templates
│   ├── uploads/                 # Doctor profile pictures (static)
│   ├── serviceAccountKey.json   # Firebase Admin credentials (gitignored)
│   ├── .env                     # Environment variables (gitignored)
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css            # Complete design system
│   ├── js/
│   │   └── app.js               # Auth, API client, toast, helpers
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── search-results.html
│   │   ├── doctor-profile.html
│   │   ├── appointment.html
│   │   ├── patient-dashboard.html
│   │   └── doctor-dashboard.html
│   └── index.html               # Landing page
│
└── README.md
```

---

## 5. INSTALLATION & SETUP

### Prerequisites
- Node.js v18 or higher
- A Firebase project with **Authentication** (Email/Password) and **Firestore** enabled
- A Gmail account with an App Password generated for SMTP

### Step 1 — Clone the repository
```bash
git clone https://github.com/your-username/SmartMed-AI.git
cd SmartMed-AI
```

### Step 2 — Backend setup
```bash
cd backend
npm install
```

Place your Firebase service account key at:
```
backend/serviceAccountKey.json
```

Create a `.env` file in `backend/`:
```env
FIREBASE_API_KEY=your_firebase_web_api_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_digit_app_password
PORT=5000
```

Run the server:
```bash
npm run dev
```
Server starts at `http://localhost:5000`

### Step 3 — Frontend setup
No build step required. Open `frontend/index.html` directly in a browser, or serve it with a static server (e.g. VS Code Live Server) at:
```
http://127.0.0.1:5500/frontend/index.html
```

### Step 4 — Firebase Console configuration
1. **Authentication → Sign-in method →** enable **Email/Password**
2. **Firestore Database →** create database in production mode
3. **Firestore → Rules →** set development rules (tighten before production):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 6. API ENDPOINTS

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new patient or doctor |
| POST | `/api/auth/login` | Authenticate and receive an ID token |

### Doctors
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors/search?q=&city=` | Search doctors by symptom/specialization and city |
| GET | `/api/doctors/:id` | Get a single doctor's public profile |
| GET | `/api/doctors/me` | Get the logged-in doctor's own profile |
| POST | `/api/doctors/profile` | Create or update doctor profile (multipart/form-data) |
| PATCH | `/api/doctors/availability` | Toggle doctor's live availability status |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments` | Book a new appointment |
| GET | `/api/appointments/patient` | Get all appointments for the logged-in patient |
| GET | `/api/appointments/doctor` | Get all appointments for the logged-in doctor |
| PATCH | `/api/appointments/:id` | Update appointment status (confirm/cancel) |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send a message to a doctor (triggers AI auto-reply if offline) |
| GET | `/api/chat/messages` | Get all messages received by the logged-in doctor |

---

## 7. DATABASE SCHEMA (Firestore Collections)

**users**
```
{ name, email, role: "patient" | "doctor", createdAt }
```

**doctors**
```
{ userId, name, specialization, city, consultationType,
  experience, bio, phone, profilePic, isAvailable, rating, createdAt }
```

**appointments**
```
{ patientId, patientName, doctorId, date, time,
  type: "Online" | "Physical", problem, status, createdAt }
```

**messages**
```
{ doctorId, senderName, senderEmail, senderPhone,
  problem, reply, isAIReply, createdAt }
```

---

## 8. FUTURE ROADMAP

- [ ] Real-time chat using Firebase Realtime Database or WebSockets
- [ ] Video consultation integration (WebRTC / Twilio)
- [ ] Payment gateway integration for paid consultations
- [ ] Replace keyword-based symptom matcher with an LLM-powered triage assistant
- [ ] SMS notifications via Twilio alongside email alerts
- [ ] Admin panel for platform-wide doctor verification and analytics
- [ ] Multi-language support (Urdu/English toggle)

---

## 9. AUTHOR

**Name:** Samra Fatima
**Email:** sminhas1405@gmail.com
**GitHub:** [github.com/Samra-ca](https://github.com/Samra-ca)
