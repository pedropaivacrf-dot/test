"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TasksList from "./tasks-list"
import WithdrawalForm from "./withdrawal-form"

interface User {
  id: string
  name: string
  email: string
  balance: number
  isAdmin: boolean
}

export default function DashboardLayout({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<"tasks" | "withdraw">("tasks")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
            <p className="text-purple-300 text-sm">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="border-purple-500/50 text-purple-300 bg-transparent">
                  Admin Panel
                </Button>
              </Link>
            )}
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="outline" className="border-red-500/50 text-red-300 bg-transparent">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-8 p-6 border-purple-500/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-300 text-sm mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-white">${user.balance.toFixed(2)}</p>
            </div>
            {user.balance >= 35 && (
              <Button
                onClick={() => setActiveTab("withdraw")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Withdraw Now
              </Button>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
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
            onClick={() => setActiveTab("withdraw")}
            disabled={user.balance < 35}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "withdraw"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : user.balance < 35
                  ? "bg-slate-800/30 text-slate-500 cursor-not-allowed"
                  : "bg-slate-800/50 text-purple-300 hover:bg-slate-800"
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content */}
        {activeTab === "tasks" ? (
          <TasksList userId={user.id} balance={user.balance} />
        ) : (
          <WithdrawalForm userId={user.id} balance={user.balance} />
        )}
      </main>
    </div>
  )
}
