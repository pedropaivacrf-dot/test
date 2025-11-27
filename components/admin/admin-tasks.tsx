"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  order: number
  videoUrl: string
  question: string
  options: string[]
  correctAnswer: string
  rewardAmount: number
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Task>>({})

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setEditData(task)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/tasks/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      if (res.ok) {
        setEditingId(null)
        fetchTasks()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  if (loading) {
    return <div className="text-center text-purple-300">Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <Card key={task.id} className="p-6 border-purple-500/20 bg-slate-800/50">
          {editingId === task.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Video URL</label>
                <Input
                  type="url"
                  value={editData.videoUrl || ""}
                  onChange={(e) => setEditData({ ...editData, videoUrl: e.target.value })}
                  className="bg-slate-900/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Question</label>
                <Input
                  type="text"
                  value={editData.question || ""}
                  onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                  className="bg-slate-900/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Options (comma-separated)</label>
                <Input
                  type="text"
                  value={(editData.options || []).join(", ")}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      options: e.target.value.split(",").map((o) => o.trim()),
                    })
                  }
                  className="bg-slate-900/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Correct Answer</label>
                <Input
                  type="text"
                  value={editData.correctAnswer || ""}
                  onChange={(e) => setEditData({ ...editData, correctAnswer: e.target.value })}
                  className="bg-slate-900/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Reward Amount (minimum $10)</label>
                <Input
                  type="number"
                  value={editData.rewardAmount || 10}
                  onChange={(e) => setEditData({ ...editData, rewardAmount: Number.parseFloat(e.target.value) })}
                  min="10"
                  step="0.01"
                  className="bg-slate-900/50 border-purple-500/30 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Task {task.order}</h3>
                  <p className="text-purple-300 mb-2">{task.question}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-purple-400">
                      <span className="text-purple-300">Video:</span> {task.videoUrl}
                    </p>
                    <p className="text-sm text-purple-400">
                      <span className="text-purple-300">Correct Answer:</span> {task.correctAnswer}
                    </p>
                    <p className="text-sm text-purple-400">
                      <span className="text-purple-300">Options:</span> {task.options.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">${task.rewardAmount.toFixed(2)}</p>
                </div>
              </div>

              <Button
                onClick={() => handleEdit(task)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Edit Task
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
