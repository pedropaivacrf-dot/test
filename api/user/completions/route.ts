import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const completions = await db.taskCompletion.findMany({
      where: { userId: session.userId },
      select: { id: true, taskId: true, isCorrect: true },
    })

    return NextResponse.json(completions)
  } catch (error) {
    console.error("Error fetching completions:", error)
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 })
  }
}
