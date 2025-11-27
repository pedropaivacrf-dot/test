import type { Metadata } from "next"
import LoginForm from "@/components/login-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login - Task Platform",
  description: "Login to your task account",
}

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">TaskFlow</h1>
          <p className="text-purple-200">Complete tasks and earn rewards</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
