const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const cleanJsonResponse = (text) => { return text.replace(/```json/gi, '').replace(/```/g, '').trim() }


const extractResumeData = async (resumeText) => {
  const prompt = `
    Analyze this resume text and extract the following information.
    Return ONLY a JSON object, no explanation, no markdown, no backticks.

    {
      "skills": ["skill1", "skill2", "skill3"],
      "experience": "fresher / 1 year / 2 years etc",
      "role": "the most suitable job role for this person e.g. Frontend Developer, Full Stack Developer, Data Scientist"
    }

    Resume text:
    ${resumeText}
  `

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const cleaned = cleanJsonResponse(response) 
  const parsed = JSON.parse(cleaned)

  return parsed
}

const generateInterviewQuestions = async (role, skills) => {
  const prompt = `
    Generate 5 interview questions for a ${role} position.
    The candidate has these skills: ${skills.join(', ')}.
    Return ONLY a JSON array, no explanation, no markdown, no backticks.

    ["question1", "question2", "question3", "question4", "question5"]
  `

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const cleaned = cleanJsonResponse(response) 
  const parsed = JSON.parse(cleaned)
  return parsed
}

const evaluateAnswers = async (questions, answers, role) => {
  const prompt = `
    Evaluate these interview answers for a ${role} position.
    Return ONLY a JSON object, no explanation, no markdown, no backticks.

    {
      "overallScore": number out of 10,
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "perQuestion": [
        {
          "question": "question text",
          "answer": "candidate answer",
          "score": number out of 10,
          "feedback": "specific feedback"
        }
      ]
    }

    Questions and Answers:
    ${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`).join('\n\n')}
  `

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  const cleaned = cleanJsonResponse(response) 
  const parsed = JSON.parse(cleaned)
  return parsed
}

module.exports = { extractResumeData, generateInterviewQuestions, evaluateAnswers }