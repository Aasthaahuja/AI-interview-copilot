const User = require('../models/User.Model')
const pdfParse = require('pdf-parse')
const { extractResumeData } = require('../utils/gemini')

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const pdfData = await pdfParse(req.file.buffer)
    const rawText = pdfData.text

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' })
    }

    const resumeData = await extractResumeData(rawText)

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        resume: {
          rawText,
          skills: resumeData.skills,
          experience: resumeData.experience,
          role: resumeData.role
        }
      },
      { new: true }
    )

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume: {
        skills: user.resume.skills,
        experience: user.resume.experience,
        role: user.resume.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { uploadResume }
