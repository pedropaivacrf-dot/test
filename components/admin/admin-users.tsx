"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  email: string
  name: string
  balance: number
  isActive: boolean
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserData, setNewUserData] = useState({ name: "", email: "" })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/create-paid-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      })

      if (res.ok) {
        setNewUserData({ name: "", email: "" })
        setShowCreateForm(false)
        fetchUsers()
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  if (loading) {
    return <div className="text-center text-purple-300">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      {showCreateForm && (
        <Card className="p-6 border-purple-500/20 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
              <Input
                type="text"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                required
                className="bg-slate-900/50 border-purple-500/30 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
              <Input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                required
                className="bg-slate-900/50 border-purple-500/30 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create User
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="border-purple-500/50 text-purple-300 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!showCreateForm && (
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Create New User
        </Button>
      )}

      {/* Users Table */}
      <Card className="border-purple-500/20 bg-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">Email</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-purple-300">Balance</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-purple-300">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-purple-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-purple-300 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-right text-green-400 font-semibold">${user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      variant="outline"
                      size="sm"
                      className={`border-purple-500/50 ${
                        user.isActive ? "text-red-400 hover:bg-red-500/10" : "text-green-400 hover:bg-green-500/10"
                      } bg-transparent`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
