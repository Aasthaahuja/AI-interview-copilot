'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(stored))
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/interview/history')
      setInterviews(res.data.interviews)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">AI Interview Copilot</h1>
            <p className="text-slate-400">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout} className="border-slate-700 text-slate-300">
            Logout
          </Button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800 cursor-pointer hover:border-violet-500 transition-colors"
            onClick={() => router.push('/upload')}>
            <CardHeader>
              <CardTitle className="text-white text-lg">📄 Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">Upload your resume and let AI extract your skills</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 cursor-pointer hover:border-violet-500 transition-colors"
            onClick={() => router.push('/interview')}>
            <CardHeader>
              <CardTitle className="text-white text-lg">🎯 Start Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">Practice with AI-generated questions based on your skills</p>
            </CardContent>
          </Card>
        </div>

        {/* Interview History */}
        <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : interviews.length === 0 ? (
          <p className="text-slate-400">No interviews yet. Start your first one!</p>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <Card key={interview._id} className="bg-slate-900 border-slate-800">
                <CardContent className="flex justify-between items-center py-4">
                  <div>
                    <p className="text-white font-medium">{interview.role}</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-2 py-1 rounded ${
                      interview.status === 'completed'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {interview.status}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300"
                      onClick={() => router.push(`/feedback/${interview._id}`)}
                    >
                      View Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}