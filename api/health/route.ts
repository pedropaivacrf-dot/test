import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    await db.user.count()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Database connection failed",
      },
      { status: 503 },
    )
  }
}
