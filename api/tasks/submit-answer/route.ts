import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskId, userAnswer } = await request.json()

    const task = await db.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const isCorrect = userAnswer === task.correctAnswer

    const completion = await db.taskCompletion.create({
      data: {
        userId: session.userId,
        taskId,
        userAnswer,
        isCorrect,
      },
    })

    if (isCorrect) {
      await db.user.update({
        where: { id: session.userId },
        data: {
          balance: {
            increment: task.rewardAmount,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      reward: isCorrect ? task.rewardAmount : 0,
    })
  } catch (error) {
    console.error("Submit answer error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
