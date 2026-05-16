'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Interview() {
  const router = useRouter()
  const [stage, setStage] = useState<'start' | 'questions' | 'submitting'>('start')
  const [role, setRole] = useState('Full Stack Developer')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [interviewId, setInterviewId] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const startInterview = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/interview/start', { role })
      setQuestions(res.data.questions)
      setInterviewId(res.data.interviewId)
      setAnswers(new Array(res.data.questions.length).fill(''))
      setStage('questions')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start interview')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswers = async () => {
    setStage('submitting')
    setLoading(true)
    try {
      await api.post('/interview/submit', { interviewId, answers })
      const res = await api.post('/feedback/generate', { interviewId })
      router.push(`/feedback/${interviewId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed')
      setStage('questions')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'start') {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white mb-6 block">
            ← Back to Dashboard
          </button>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Start Mock Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">Select Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
                >
                  <option>Full Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Data Scientist</option>
                  <option>System Design</option>
                  <option>HR Round</option>
                </select>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                onClick={startInterview}
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {loading ? 'Generating questions...' : 'Start Interview'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (stage === 'submitting') {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-xl font-medium">Analyzing your answers...</p>
          <p className="text-slate-400">Gemini AI is generating your feedback</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">{role} Interview</h1>
          <span className="text-slate-400 text-sm">Question {currentQ + 1} of {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        <Card className="bg-slate-900 border-slate-800 mb-4">
          <CardContent className="pt-6">
            <p className="text-white text-lg leading-relaxed">{questions[currentQ]}</p>
          </CardContent>
        </Card>

        <textarea
          value={answers[currentQ]}
          onChange={e => {
            const updated = [...answers]
            updated[currentQ] = e.target.value
            setAnswers(updated)
          }}
          placeholder="Type your answer here..."
          rows={6}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded p-3 resize-none mb-4"
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQ(q => q - 1)}
            disabled={currentQ === 0}
            className="border-slate-700 text-slate-300"
          >
            Previous
          </Button>
          {currentQ < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQ(q => q + 1)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={submitAnswers}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit & Get Feedback
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}