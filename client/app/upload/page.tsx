'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Upload() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await api.post('/resume/upload', formData)
      setResult(res.data.resume)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white mb-6 block">
          ← Back to Dashboard
        </button>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Upload Your Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="text-slate-300 w-full"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-violet-600 hover:bg-violet-700 w-full"
            >
              {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </Button>
            {result && (
              <div className="mt-4 space-y-3">
                <p className="text-green-400 font-medium">✓ Resume analyzed successfully</p>
                <div>
                  <p className="text-slate-300 text-sm mb-1">Detected Role: <span className="text-violet-400">{result.role}</span></p>
                  <p className="text-slate-300 text-sm mb-2">Experience: <span className="text-violet-400">{result.experience}</span></p>
                  <p className="text-slate-300 text-sm mb-2">Skills detected:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill: string) => (
                      <span key={skill} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Button onClick={() => router.push('/interview')} className="w-full bg-violet-600 hover:bg-violet-700">
                  Start Interview →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}