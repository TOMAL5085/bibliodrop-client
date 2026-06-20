import { NextResponse } from "next/server";
import { createDeliveryRequest } from "@/lib/persistence";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";

  if (!userEmail) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const requestItem = await createDeliveryRequest({ bookId, userEmail });

  return NextResponse.json({ data: requestItem }, { status: 201 });
}
