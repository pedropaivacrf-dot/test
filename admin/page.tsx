import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession, getCurrentUser } from "@/lib/auth"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Admin Panel - Task Platform",
}

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/dashboard")
  }

  return <AdminLayout />
}
