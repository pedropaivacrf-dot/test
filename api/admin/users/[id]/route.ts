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

    const { isActive } = await request.json()

    const user = await db.user.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
