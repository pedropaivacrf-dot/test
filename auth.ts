import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import db from "./db"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export interface Session {
  userId: string
  email: string
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, secret)
    return verified.payload as Session
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      balance: true,
      isActive: true,
      isAdmin: true,
    },
  })

  return user
}
