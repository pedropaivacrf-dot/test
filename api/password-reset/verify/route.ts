import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import db from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    const resetRecord = await db.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetRecord) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if (resetRecord.expiresAt < new Date()) {
      await db.passwordReset.delete({ where: { token } })
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    const hashedPassword = await hash(newPassword, 10)

    await db.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    })

    await db.passwordReset.delete({ where: { token } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
