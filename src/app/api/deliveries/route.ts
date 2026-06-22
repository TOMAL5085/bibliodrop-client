import { NextResponse } from "next/server";
import { createDeliveryRequest, listDeliveries, updateDeliveryStatus } from "@/lib/persistence";

export async function GET() {
  const data = await listDeliveries();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";

  if (!bookId || !userEmail) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const requestItem = await createDeliveryRequest({ bookId, userEmail });
  if (!requestItem) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({ data: requestItem }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { id?: string; status?: "Pending" | "Dispatched" | "Delivered" }
    | null;

  const id = body?.id ?? "";
  const status = body?.status ?? "";

  if (!id || !status) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const updated = await updateDeliveryStatus(id, status);
  if (!updated) {
    return NextResponse.json({ message: "Delivery not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
