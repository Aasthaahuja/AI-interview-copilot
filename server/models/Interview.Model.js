const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  questions: [String],
  answers: [String],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  }
}, { timestamps: true })

module.exports = mongoose.model('Interview', interviewSchema)