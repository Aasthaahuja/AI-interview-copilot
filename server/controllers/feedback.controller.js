const Feedback = require('../models/Feedback.model')
const Interview = require('../models/Interview.model')
const { evaluateAnswers } = require('../utils/gemini')

const generateFeedback = async (req, res) => {
  try {
    const { interviewId } = req.body

    // get interview from DB
    const interview = await Interview.findById(interviewId)

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    if (!interview.answers || interview.answers.length === 0) {
      return res.status(400).json({ message: 'No answers found for this interview' })
    }

    // send to Gemini for evaluation
    const evaluation = await evaluateAnswers(
      interview.questions,
      interview.answers,
      interview.role
    )

    // save feedback to DB
    const feedback = await Feedback.create({
      userId: req.userId,
      interviewId,
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      suggestions: evaluation.suggestions,
      perQuestion: evaluation.perQuestion
    })

    res.status(201).json({
      message: 'Feedback generated',
      feedback
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getFeedback = async (req, res) => {
  try {
    const { interviewId } = req.params

    const feedback = await Feedback.findOne({ interviewId })

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    res.status(200).json({ feedback })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { generateFeedback, getFeedback }