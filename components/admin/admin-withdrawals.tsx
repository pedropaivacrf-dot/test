"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Withdrawal {
  id: string
  userId: string
  fullName: string
  country: string
  bankName: string
  accountNumber: string
  swiftBic: string
  email: string
  amount: number
  status: string
  createdAt: string
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/admin/withdrawals")
      const data = await res.json()
      setWithdrawals(data)
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (withdrawalId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchWithdrawals()
      }
    } catch (error) {
      console.error("Error updating withdrawal:", error)
    }
  }

  if (loading) {
    return <div className="text-center text-purple-300">Loading withdrawals...</div>
  }

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending")
  const approvedWithdrawals = withdrawals.filter((w) => w.status === "approved")
  const rejectedWithdrawals = withdrawals.filter((w) => w.status === "rejected")

  const renderWithdrawalsList = (items: Withdrawal[]) => (
    <div className="space-y-4">
      {items.map((withdrawal) => (
        <Card key={withdrawal.id} className="p-4 border-purple-500/20 bg-slate-800/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-purple-400 text-xs">Full Name</p>
              <p className="text-white font-semibold">{withdrawal.fullName}</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs">Amount</p>
              <p className="text-green-400 font-semibold">${withdrawal.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs">Country</p>
              <p className="text-white">{withdrawal.country}</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs">Date</p>
              <p className="text-white">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mb-4">
            <div>
              <p className="text-purple-400">Bank: {withdrawal.bankName}</p>
              <p className="text-purple-400">Account: {withdrawal.accountNumber}</p>
            </div>
            <div>
              <p className="text-purple-400">SWIFT: {withdrawal.swiftBic}</p>
              <p className="text-purple-400">Email: {withdrawal.email}</p>
            </div>
          </div>

          {withdrawal.status === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleUpdateStatus(withdrawal.id, "approved")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleUpdateStatus(withdrawal.id, "rejected")}
                variant="outline"
                className="border-red-500/50 text-red-300 bg-transparent text-sm"
              >
                Reject
              </Button>
            </div>
          )}
        </Card>
      ))}
      {items.length === 0 && <p className="text-purple-400 text-center py-8">No withdrawals in this category</p>}
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Pending ({pendingWithdrawals.length})</h3>
        {renderWithdrawalsList(pendingWithdrawals)}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Approved ({approvedWithdrawals.length})</h3>
        {renderWithdrawalsList(approvedWithdrawals)}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Rejected ({rejectedWithdrawals.length})</h3>
        {renderWithdrawalsList(rejectedWithdrawals)}
      </div>
    </div>
  )
}
