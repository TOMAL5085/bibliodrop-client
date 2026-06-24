import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/request-auth";
import { findBookById } from "@/lib/persistence";
import {
  getAppBaseUrl,
  getStripeClient,
  isStripeConfigured,
  toStripeAmount,
} from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { message: "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel." },
      { status: 503 }
    );
  }

  const user = await getRequestUser(request);
  if (!user) {
    return NextResponse.json({ message: "Sign in to pay for delivery." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { bookId?: string } | null;
  const bookId = body?.bookId?.trim() ?? "";
  if (!bookId) {
    return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
  }

  const book = await findBookById(bookId);
  if (!book || book.status !== "published") {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  if (book.availability === "Checked Out") {
    return NextResponse.json({ message: "This book is currently checked out." }, { status: 409 });
  }

  const baseUrl = getAppBaseUrl();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "bdt",
          unit_amount: toStripeAmount(book.deliveryFee),
          product_data: {
            name: `Delivery: ${book.title}`,
            description: `${book.author} • ${book.category}`,
            images: book.coverImage.startsWith("http") ? [book.coverImage] : undefined,
          },
        },
      },
    ],
    metadata: {
      bookId: book.id,
      userEmail: user.email,
      userId: user.id,
      bookTitle: book.title,
    },
    success_url: `${baseUrl}/books/${book.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/books/${book.id}?payment=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ message: "Unable to start Stripe checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
