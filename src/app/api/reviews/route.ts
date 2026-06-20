import { NextResponse } from "next/server";
import { createReview } from "@/lib/persistence";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string; rating?: number; comment?: string }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";
  const rating = Number(body?.rating ?? 0);
  const comment = body?.comment?.trim() ?? "";

  const review = await createReview({
    bookId,
    userEmail,
    rating,
    comment,
  });

  if (!review) {
    return NextResponse.json(
      { message: "Delivered order required before review" },
      { status: 403 }
    );
  }

  return NextResponse.json({ data: review }, { status: 201 });
}
