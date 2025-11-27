import { type NextRequest, NextResponse } from "next/server"
import { getSession, getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getCurrentUser()

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { videoUrl, question, options, correctAnswer, rewardAmount } = await request.json()

    if (rewardAmount && rewardAmount < 10) {
      return NextResponse.json({ error: "Reward amount must be at least $10" }, { status: 400 })
    }

    const task = await db.task.update({
      where: { id: params.id },
      data: {
        videoUrl: videoUrl || undefined,
        question: question || undefined,
        options: options || undefined,
        correctAnswer: correctAnswer || undefined,
        rewardAmount: rewardAmount || undefined,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
