"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  videoUrl: string
  question: string
  options: string[]
  correctAnswer: string
  rewardAmount: number
  order: number
}

export default function TaskDetail({ task, userId }: { task: Task; userId: string }) {
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      setError("Please select an answer")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tasks/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          userAnswer: selectedAnswer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit answer")
        return
      }

      if (data.isCorrect) {
        router.push(`/task-result?correct=true&reward=${task.rewardAmount}`)
      } else {
        router.push(`/task-result?correct=false`)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => router.back()} variant="ghost" className="mb-6 text-purple-300 hover:text-purple-200">
          ← Back to Dashboard
        </Button>

        <Card className="border-purple-500/20 bg-slate-800/50 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Task {task.order}</h1>
            <div className="text-right">
              <p className="text-purple-300 text-sm">Reward</p>
              <p className="text-3xl font-bold text-green-400">${task.rewardAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-8 bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              src={task.videoUrl}
              title="Task Video"
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </Card>

        {/* Question and Answers */}
        <Card className="border-purple-500/20 bg-slate-800/50 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">{task.question}</h2>

          <div className="space-y-3 mb-6">
            {task.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border-2 border-purple-500/20 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors"
                style={{
                  borderColor: selectedAnswer === option ? "rgb(147, 51, 234)" : "rgba(168, 85, 247, 0.2)",
                  backgroundColor: selectedAnswer === option ? "rgba(147, 51, 234, 0.1)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 text-white">{option}</span>
              </label>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm mb-4">{error}</div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedAnswer}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
