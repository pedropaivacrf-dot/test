import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 border-green-500/20 bg-slate-800/50 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h1>
        <p className="text-purple-300 mb-6">Your account has been created. Check your email for login credentials.</p>

        <Link href="/login">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Go to Login
          </Button>
        </Link>
      </Card>
    </div>
  )
}
