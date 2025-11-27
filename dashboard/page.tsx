import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession, getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export const metadata: Metadata = {
  title: "Dashboard - Task Platform",
  description: "Your task dashboard",
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardLayout user={user} />
}
