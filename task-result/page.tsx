import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Task Result - Task Platform",
}

export default async function TaskResultPage({
  searchParams,
}: {
  searchParams: { correct?: string; reward?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const isCorrect = searchParams.correct === "true"
  const reward = searchParams.reward ? Number.parseFloat(searchParams.reward) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-purple-500/20 bg-slate-800/50 p-8 text-center">
        {isCorrect ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">Correct!</h1>
            <p className="text-purple-300 mb-6">You earned a reward!</p>
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm mb-1">Reward Amount</p>
              <p className="text-3xl font-bold text-green-400">+${reward.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">Incorrect</h1>
            <p className="text-purple-300 mb-6">Try another task or come back later.</p>
          </>
        )}

        <Link href="/dashboard" className="block">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  )
}
