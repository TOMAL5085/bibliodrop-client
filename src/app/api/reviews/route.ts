import { NextResponse } from "next/server";
import { deliveries, reviews } from "@/lib/server-state";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string; rating?: number; comment?: string }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";
  const rating = Number(body?.rating ?? 0);
  const comment = body?.comment?.trim() ?? "";

  const delivery = deliveries.find(
    (item) => item.bookId === bookId && item.userEmail === userEmail && item.status === "Delivered"
  );

  if (!delivery) {
    return NextResponse.json(
      { message: "Delivered order required before review" },
      { status: 403 }
    );
  }

  const review = {
    id: `r${reviews.length + 1}`,
    bookId,
    userEmail,
    rating,
    comment,
    verified: true,
  };

  reviews.push(review);
  return NextResponse.json({ data: review }, { status: 201 });
}
