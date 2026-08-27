const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth.middleware')
const { generateFeedback, getFeedback } = require('../controllers/feedback.controller')

router.post('/generate', protect, generateFeedback)
router.get('/:interviewId', protect, getFeedback)

module.exports = router