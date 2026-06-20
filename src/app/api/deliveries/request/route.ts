import { NextResponse } from "next/server";
import { deliveries, transactions } from "@/lib/server-state";
import { getBookById } from "@/lib/site-data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";
  const book = getBookById(bookId);

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  if (!userEmail) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const requestDate = new Date().toISOString().slice(0, 10);
  const requestItem = {
    id: `d${deliveries.length + 1}`,
    userEmail,
    librarianEmail: book.provider,
    bookId,
    status: "Pending" as const,
    amount: book.deliveryFee,
    date: requestDate,
  };

  deliveries.push(requestItem);
  transactions.push({
    id: `txn_${transactions.length + 1}`,
    userEmail,
    librarianEmail: book.provider,
    amount: book.deliveryFee,
    date: requestDate,
  });

  return NextResponse.json({ data: requestItem }, { status: 201 });
}
