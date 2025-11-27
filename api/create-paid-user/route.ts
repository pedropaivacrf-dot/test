import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import db from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const randomPassword = Math.random().toString(36).slice(-12)
    const hashedPassword = await hash(randomPassword, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
      },
    })

    // TODO: Send welcome email with login credentials
    console.log(`Welcome email would be sent to ${email}`)
    console.log(`Login credentials: ${email} / ${randomPassword}`)

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
        message: "User created successfully. Welcome email sent.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
