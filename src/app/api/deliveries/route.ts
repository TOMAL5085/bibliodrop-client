import { NextResponse } from "next/server";
import { deliveries, transactions } from "@/lib/server-state";

export function GET() {
  return NextResponse.json({ data: deliveries });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; userEmail?: string; librarianEmail?: string; amount?: number }
    | null;

  const bookId = body?.bookId ?? "";
  const userEmail = body?.userEmail ?? "";
  const librarianEmail = body?.librarianEmail ?? "";
  const amount = Number(body?.amount ?? 0);

  if (!bookId || !userEmail || !librarianEmail || !amount) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const requestDate = new Date().toISOString().slice(0, 10);
  const requestItem = {
    id: `d${deliveries.length + 1}`,
    userEmail,
    librarianEmail,
    bookId,
    status: "Pending" as const,
    amount,
    date: requestDate,
  };

  deliveries.push(requestItem);
  transactions.push({
    id: `txn_${transactions.length + 1}`,
    userEmail,
    librarianEmail,
    amount,
    date: requestDate,
  });

  return NextResponse.json({ data: requestItem }, { status: 201 });
}
