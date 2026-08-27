# 🎯 AI Interview Copilot

An AI-powered mock interview platform that generates personalized interview questions based on your resume and target role, then scores your answers with detailed, actionable feedback — powered by Google's Gemini AI.

---

## ✨ Features

- **Resume Upload & Skill Extraction** — Upload a PDF resume; the app parses it and automatically extracts your key skills using AI.
- **Role-Based Question Generation** — Choose a target role (Full Stack Developer, Frontend, Backend, Data Scientist, System Design, HR Round) and get a tailored set of interview questions generated on the fly.
- **Interactive Interview Flow** — Answer questions one at a time with a clean, distraction-free UI and progress tracking.
- **AI-Scored Feedback** — After submission, Gemini analyzes every answer and returns:
  - An overall score out of 10
  - Strengths and weaknesses
  - Actionable suggestions for improvement
  - Per-question breakdown with individual scores and feedback
- **Authentication** — Secure signup/login with hashed passwords and JWT-based sessions.

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) components
- Axios for API communication

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- [Google Generative AI (Gemini)](https://ai.google.dev/) for question generation and answer scoring
- `pdf-parse` for resume text extraction
- JWT + bcrypt for authentication
- Multer for file uploads

---


## 🏗️ How It Works

1. **Sign up / log in** — creates a JWT-authenticated session.
2. **Upload resume** — PDF is parsed server-side (`pdf-parse`), and Gemini extracts relevant skills from the raw text.
3. **Start interview** — pick a role; Gemini generates a set of role-specific questions based on your skills and the chosen track.
4. **Answer questions** — a step-by-step interface lets you type answers, track progress, and move between questions.
5. **Get feedback** — on submission, all answers are sent to Gemini for evaluation, returning an overall score, strengths/weaknesses, suggestions, and per-question feedback — rendered on a dedicated results page.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

### 1. Clone the repo
```bash
git clone https://github.com/Aasthaahuja/AI-interview-copilot.git
cd AI-interview-copilot
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `.env.local` file in `client/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
AI-interview-copilot/
├── client/          # Next.js frontend
│   ├── app/         # App Router pages (dashboard, interview, feedback, auth)
│   ├── components/  # Reusable UI components (shadcn/ui)
│   └── lib/         # API client, utilities
└── server/          # Express backend
    ├── routes/       # Auth, resume, interview, feedback endpoints
    ├── models/       # Mongoose schemas
    └── server.js     # Entry point
```

---

## 🔮 Future Improvements

- Voice-based answer input with speech-to-text
- Timed interview mode simulating real interview pressure
- Interview history and progress tracking over time
- Support for additional AI providers

---
