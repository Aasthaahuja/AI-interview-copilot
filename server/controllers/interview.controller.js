const Interview = require('../models/Interview.model')
const User = require('../models/User.model')
const { generateInterviewQuestions } = require('../utils/gemini')

// START INTERVIEW
const startInterview = async (req, res) => {
  try {
    // get user's resume data from DB
    const user = await User.findById(req.userId)

    if (!user.resume || !user.resume.skills.length) {
      return res.status(400).json({ message: 'Please upload your resume first' })
    }

    const role = req.body.role || user.resume.role
    const skills = user.resume.skills

    // generate questions using Gemini
    const questions = await generateInterviewQuestions(role, skills)

    // save interview session to DB
    const interview = await Interview.create({
      userId: req.userId,
      role,
      questions,
      answers: [],
      status: 'in-progress'
    })

    res.status(201).json({
      message: 'Interview started',
      interviewId: interview._id,
      role,
      questions
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// SUBMIT ANSWERS
const submitAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body

    const interview = await Interview.findById(interviewId)

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    interview.answers = answers
    interview.status = 'completed'
    await interview.save()

    res.status(200).json({
      message: 'Answers submitted successfully',
      interviewId: interview._id
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET INTERVIEW HISTORY
const getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('role status createdAt questions')

    res.status(200).json({ interviews })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { startInterview, submitAnswers, getHistory }