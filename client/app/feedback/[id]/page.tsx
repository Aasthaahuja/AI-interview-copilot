'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Feedback() {
  const router = useRouter()
  const params = useParams()
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/${params.id}`)
      setFeedback(res.data.feedback)
    } catch (err: any) {
      setError('Feedback not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p>Loading feedback...</p>
    </main>
  )

  if (error) return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white mb-6 block">
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Interview Feedback</h1>

        {/* Overall Score */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overall Score</p>
                <p className="text-5xl font-bold text-violet-400">{feedback.overallScore}<span className="text-2xl text-slate-400">/10</span></p>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-violet-500 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(feedback.overallScore * 10)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-lg">✓ Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-slate-300 text-sm">• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-red-400 text-lg">✗ Weaknesses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.weaknesses.map((w: string, i: number) => (
                  <li key={i} className="text-slate-300 text-sm">• {w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-lg">💡 Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.suggestions.map((s: string, i: number) => (
                <li key={i} className="text-slate-300 text-sm">• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Per Question Feedback */}
        <h2 className="text-xl font-semibold mb-4">Per Question Breakdown</h2>
        <div className="space-y-4">
          {feedback.perQuestion.map((q: any, i: number) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="pt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-white font-medium text-sm flex-1 mr-4">Q{i + 1}: {q.question}</p>
                  <span className={`text-sm font-bold px-2 py-1 rounded flex-shrink-0 ${
                    q.score >= 7 ? 'bg-green-900 text-green-300' :
                    q.score >= 4 ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>{q.score}/10</span>
                </div>
                <p className="text-slate-400 text-sm">Your answer: {q.answer}</p>
                <p className="text-slate-300 text-sm border-l-2 border-violet-500 pl-3">{q.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => router.push('/interview')}
          className="w-full bg-violet-600 hover:bg-violet-700 mt-6"
        >
          Practice Again
        </Button>
      </div>
    </main>
  )
}