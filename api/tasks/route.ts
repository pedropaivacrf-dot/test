import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const tasks = await db.task.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
