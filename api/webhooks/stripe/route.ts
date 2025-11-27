import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

// This is a webhook handler for Stripe payments
// When a user purchases a product, Stripe will send a webhook to this endpoint

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature") as string

    // TODO: Verify webhook signature with Stripe
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // );

    // For now, parse the event manually
    const event = JSON.parse(body)

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      // Extract customer data
      const { customer_email, metadata } = session

      // Call the create-paid-user endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/create-paid-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metadata?.customer_name || "Customer",
          email: customer_email,
        }),
      })

      if (!response.ok) {
        console.error("Failed to create user from webhook")
        return NextResponse.json({ error: "Failed to process payment" }, { status: 400 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
