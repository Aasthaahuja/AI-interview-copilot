const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const resumeRoutes = require('./routes/resume.routes')
const interviewRoutes = require('./routes/interview.routes')
const feedbackRoutes = require('./routes/feedback.routes')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/feedback', feedbackRoutes)
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
