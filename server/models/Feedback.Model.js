const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  overallScore: Number,
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  perQuestion: [
    {
      question: String,
      answer: String,
      score: Number,
      feedback: String
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)