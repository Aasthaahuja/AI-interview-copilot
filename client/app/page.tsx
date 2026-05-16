import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          AI Interview Copilot
        </h1>
        <p className="text-slate-400 text-xl">
          Practice interviews with AI. Get real feedback. Land your internship.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}