import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import db from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({ message: "If email exists, reset link will be sent" }, { status: 200 })
    }

    const resetToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    })

    // TODO: Send email with reset link
    console.log(`Password reset link: /reset-password?token=${resetToken}`)

    return NextResponse.json({ message: "If email exists, reset link will be sent" }, { status: 200 })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
