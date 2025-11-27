"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WithdrawalForm({ userId, balance }: { userId: string; balance: number }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    bankName: "",
    accountNumber: "",
    swiftBic: "",
    email: "",
    amount: balance.toFixed(2),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/withdrawals/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit withdrawal request")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8 border-green-500/20 bg-slate-800/50 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">Request Submitted</h2>
        <p className="text-purple-300 mb-4">
          Your withdrawal request has been submitted and will be processed within 7 days.
        </p>
        <p className="text-sm text-purple-400">Redirecting to dashboard...</p>
      </Card>
    )
  }

  return (
    <Card className="border-purple-500/20 bg-slate-800/50 p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Request Withdrawal</h2>
      <p className="text-purple-300 text-sm mb-6">
        Available Balance: <span className="font-bold text-green-400">${balance.toFixed(2)}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Full Name</label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md border border-purple-500/30 bg-slate-900/50 text-white"
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
            <option value="BR">Brazil</option>
            <option value="MX">Mexico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Bank Name</label>
          <Input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Account Number / IBAN</label>
          <Input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">SWIFT / BIC Code</label>
          <Input
            type="text"
            name="swiftBic"
            value={formData.swiftBic}
            onChange={handleChange}
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Email Address</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Withdrawal Amount</label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            max={balance}
            step="0.01"
            required
            className="bg-slate-900/50 border-purple-500/30 text-white"
          />
          <p className="text-xs text-purple-400 mt-1">Max: ${balance.toFixed(2)}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
        >
          {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
        </Button>
      </form>
    </Card>
  )
}
