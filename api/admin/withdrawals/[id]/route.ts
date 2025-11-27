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

    const { status } = await request.json()

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const withdrawal = await db.withdrawal.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(withdrawal)
  } catch (error) {
    console.error("Error updating withdrawal:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
