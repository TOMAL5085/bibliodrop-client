import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createDeliveryRequest } from "@/lib/persistence";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const bookId = session.metadata?.bookId ?? "";
      const userEmail = session.metadata?.userEmail ?? session.customer_email ?? "";

      if (bookId && userEmail) {
        await createDeliveryRequest({
          bookId,
          userEmail,
          stripeSessionId: session.id,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
