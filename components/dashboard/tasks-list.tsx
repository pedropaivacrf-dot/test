"use client"

import { useEffect, useState } from "react"
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

interface TaskCompletion {
  id: string
  taskId: string
  isCorrect: boolean
}

export default function TasksList({
  userId,
  balance,
}: {
  userId: string
  balance: number
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completions, setCompletions] = useState<TaskCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, completionsRes] = await Promise.all([fetch("/api/tasks"), fetch("/api/user/completions")])

        const tasksData = await tasksRes.json()
        const completionsData = await completionsRes.json()

        setTasks(tasksData)
        setCompletions(completionsData)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center text-purple-300">Loading tasks...</div>
  }

  const completedCount = completions.length

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <Card className="p-4 border-purple-500/20 bg-slate-800/50">
        <div className="flex justify-between items-center mb-2">
          <p className="text-purple-300 font-medium">Task Progress</p>
          <p className="text-white font-bold">{completedCount}/3</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>
      </Card>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const isCompleted = completions.some((c) => c.taskId === task.id)
          return (
            <Card
              key={task.id}
              className={`p-6 border-purple-500/20 ${
                isCompleted ? "bg-slate-800/30 opacity-60" : "bg-slate-800/50 hover:bg-slate-800/70"
              } transition-colors`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">Task {task.order}</h3>
                  <p className="text-purple-300 text-sm">{task.question}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">${task.rewardAmount.toFixed(2)}</p>
                  {isCompleted && <p className="text-green-400 text-xs mt-1">✓ Completed</p>}
                </div>
              </div>

              {!isCompleted && (
                <Link href={`/dashboard/task/${task.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start Task
                  </Button>
                </Link>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

import Link from "next/link"
