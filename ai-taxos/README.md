# AI TaxOS 🚀

**India's Most Intelligent AI-Powered Tax Platform**

> One AI Platform for Taxpayers, Businesses, and Chartered Accountants

---

## What's Built

| Layer | Stack | Port |
|-------|-------|------|
| **Frontend** | React 18 + Vite + Tailwind CSS | `:3000` |
| **Backend** | Node.js + Express + Firebase Admin SDK | `:5000` |
| **AI Service** | Python + FastAPI + Gemini + Groq | `:8000` |
| **Database** | Firebase Firestore | Cloud |
| **Storage** | Firebase Storage | Cloud |
| **Auth** | Firebase Authentication | Cloud |

---

## Features

- ✅ **Authentication** — Email/Password + Google OAuth, email verification, role-based access
- ✅ **Multi-role Dashboard** — Individual, Business, CA, Admin role-specific views
- ✅ **AI Tax Assistant** — Chat with Gemini/Groq AI for Indian tax guidance
- ✅ **OCR Document Processing** — Upload invoices, Form 16, salary slips
- ✅ **GST Module** — Calculator, Sales/Purchase Register, ITC, GSTR-3B summary
- ✅ **Income Tax Calculator** — Old vs New regime, deductions, advance tax schedule
- ✅ **CA Workspace** — Client management, tasks, messaging, filing tracker
- ✅ **Reports Engine** — P&L, GST, Tax reports with PDF/CSV/Excel export
- ✅ **Admin Panel** — User management, CA verification, audit logs
- ✅ **Firebase Backend** — All data in Firestore, files in Storage, Auth token verification

---

## Quick Start

### 1. Firebase Setup (Required for full functionality)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Enable **Firestore Database** (production mode)
5. Enable **Storage**
6. Go to **Project Settings → Service Accounts → Generate new private key**
7. Save as `backend/serviceAccountKey.json`

### 2. Frontend Setup

```bash
cd frontend

# Copy and fill in your Firebase config
cp .env.example .env
# Edit .env with your Firebase project credentials

npm install
npm run dev
# → http://localhost:3000
```

### 3. Backend Setup

```bash
cd backend

# Place serviceAccountKey.json here (from step 1 above)
# OR copy .env.example to .env and fill FIREBASE_PROJECT_ID

cp .env.example .env
node server.js
# → http://localhost:5000
# Works in demo mode without Firebase credentials
```

### 4. AI Service Setup (Optional — for live AI chat)

```bash
cd ai-service

cp .env.example .env
# Add your GOOGLE_GEMINI_API_KEY and/or GROQ_API_KEY

pip install -r requirements.txt
python main.py
# → http://localhost:8000
# Works in fallback mode without API keys
```

---

## Firebase Configuration

### Frontend `.env`
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Backend `serviceAccountKey.json`
Place the downloaded service account JSON file at `backend/serviceAccountKey.json`.

---

## Firebase Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `users` | User profiles with PAN, GSTIN, role |
| `businesses` | Business entities per user |
| `documents` | Uploaded document metadata + OCR status |
| `gstEntries` | GST sales and purchase entries |
| `taxRecords` | Income tax calculations |
| `chatHistory` | AI chat conversation history |
| `reports` | Generated report records |
| `notifications` | User notifications |
| `auditLogs` | System audit trail |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/documents/upload` | Upload document to Firebase Storage |
| GET | `/api/documents` | List user documents |
| POST | `/api/gst/calculate` | Calculate GST |
| POST | `/api/gst/entry` | Add sales/purchase entry |
| GET | `/api/gst/report` | GST summary report |
| POST | `/api/tax/calculate` | Income tax calculation |
| POST | `/api/ai/chat` | AI tax Q&A |
| GET | `/api/admin/users` | List all users (admin) |
| PUT | `/api/admin/ca/:uid/verify` | Verify CA account |

---

## Roles & Access

| Role | Access |
|------|--------|
| `individual` | Dashboard, AI Chat, Documents, Income Tax, Reports, Profile |
| `business` | + GST Module, Analytics, Business Profile |
| `ca` | + Clients, Tasks, CA Workspace |
| `admin` | + Admin Panel, User Management, Audit Logs |

---

## Getting API Keys

- **Google Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Groq**: [console.groq.com](https://console.groq.com)
- **Firebase**: [console.firebase.google.com](https://console.firebase.google.com)

---

## Project Structure

```
ai-taxos/
├── frontend/                    ← React + Vite + Tailwind
│   ├── src/
│   │   ├── firebase/config.js   ← Firebase client SDK
│   │   ├── contexts/AuthContext.jsx  ← Auth + Firestore profile sync
│   │   ├── services/api.js      ← Axios with auto Firebase token
│   │   ├── pages/
│   │   │   ├── auth/            ← Login, Register, Onboarding
│   │   │   ├── dashboard/       ← Role-aware dashboard
│   │   │   ├── ai/              ← AI Tax Assistant
│   │   │   ├── documents/       ← OCR upload + Firebase Storage
│   │   │   ├── gst/             ← GST Module
│   │   │   ├── tax/             ← Income Tax Calculator
│   │   │   ├── reports/         ← PDF/CSV/Excel exports
│   │   │   ├── ca/              ← CA Workspace
│   │   │   ├── admin/           ← Admin Panel
│   │   │   └── profile/         ← User Profile
│   │   └── components/layout/   ← Sidebar, TopBar, AppLayout
│   └── .env.example
│
├── backend/                     ← Node.js + Express
│   ├── firebase.js              ← Firebase Admin SDK init
│   ├── middleware/auth.js        ← Token verification
│   ├── routes/
│   │   ├── auth.js              ← POST /api/auth/*
│   │   ├── users.js             ← GET/PUT /api/users/*
│   │   ├── business.js          ← CRUD /api/business
│   │   ├── documents.js         ← Firebase Storage upload
│   │   ├── gst.js               ← GST calculations + entries
│   │   ├── tax.js               ← Income tax calculator
│   │   ├── ai.js                ← AI proxy + fallback
│   │   ├── reports.js           ← Report generation
│   │   └── admin.js             ← Admin management
│   ├── serviceAccountKey.json   ← ← Place YOUR key here
│   └── .env.example
│
└── ai-service/                  ← Python + FastAPI
    ├── main.py                  ← FastAPI app with Gemini + Groq
    ├── requirements.txt
    └── .env.example
```

---

*Built with AI TaxOS v1.0 · Made for Indian Taxpayers, Businesses & CAs*
