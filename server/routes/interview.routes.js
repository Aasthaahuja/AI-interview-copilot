const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth.middleware')
const { startInterview, submitAnswers, getHistory } = require('../controllers/interview.controller')

router.post('/start', protect, startInterview)
router.post('/submit', protect, submitAnswers)
router.get('/history', protect, getHistory)

module.exports = router