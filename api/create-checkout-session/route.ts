import { type NextRequest, NextResponse } from "next/server"

// This endpoint creates a Stripe checkout session
// When called, it will redirect the user to Stripe's payment page

export async function POST(request: NextRequest) {
  try {
    const { email, name, productId } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // TODO: Create Stripe checkout session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   customer_email: email,
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: 'TaskFlow Premium Access',
    //         },
    //         unit_amount: 9900, // $99.00
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    //   metadata: {
    //     customer_name: name,
    //   },
    // });

    return NextResponse.json({
      message: "Stripe integration ready. Configure your Stripe keys to enable payments.",
      checkoutUrl: null,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
