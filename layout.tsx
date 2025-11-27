import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Earn Money Completing Tasks",
  description: "Complete video tasks and earn up to $45 in rewards. Easy withdrawals via bank transfer.",
  keywords: "tasks, earn money, rewards, online work, gig economy",
  authors: [{ name: "TaskFlow" }],
  creator: "TaskFlow",
  openGraph: {
    title: "TaskFlow - Earn Money Completing Tasks",
    description: "Complete video tasks and earn up to $45 in rewards.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow",
    description: "Earn money by completing tasks",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
