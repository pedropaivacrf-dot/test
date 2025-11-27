"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdminUsers from "./admin-users"
import AdminTasks from "./admin-tasks"
import AdminWithdrawals from "./admin-withdrawals"

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<"users" | "tasks" | "withdrawals">("users")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-purple-300 text-sm">Manage users, tasks, and withdrawals</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-purple-500/50 text-purple-300 bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "users"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-slate-800/50 text-purple-300 hover:bg-slate-800"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "tasks"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-slate-800/50 text-purple-300 hover:bg-slate-800"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "withdrawals"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-slate-800/50 text-purple-300 hover:bg-slate-800"
            }`}
          >
            Withdrawals
          </button>
        </div>

        {/* Content */}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "tasks" && <AdminTasks />}
        {activeTab === "withdrawals" && <AdminWithdrawals />}
      </main>
    </div>
  )
}
