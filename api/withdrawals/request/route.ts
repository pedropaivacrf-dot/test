import { type NextRequest, NextResponse } from "next/server"
import { getSession, getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { fullName, country, bankName, accountNumber, swiftBic, email, amount } = await request.json()

    const withdrawalAmount = Number.parseFloat(amount)

    if (withdrawalAmount <= 0 || withdrawalAmount > user.balance) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 })
    }

    const withdrawal = await db.withdrawal.create({
      data: {
        userId: user.id,
        fullName,
        country,
        bankName,
        accountNumber,
        swiftBic,
        email,
        amount: withdrawalAmount,
        status: "pending",
      },
    })

    await db.user.update({
      where: { id: user.id },
      data: {
        balance: {
          decrement: withdrawalAmount,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        withdrawalId: withdrawal.id,
        message: "Withdrawal request submitted successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
