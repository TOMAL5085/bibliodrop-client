import { NextRequest, NextResponse } from "next/server";
import { getBooksFromApi, createBook } from "@/lib/persistence";

export async function GET(request: NextRequest) {
  const filters = {
    query: request.nextUrl.searchParams.get("query") ?? "",
    category: request.nextUrl.searchParams.get("category") ?? "",
    status: request.nextUrl.searchParams.get("status") ?? "",
    fee: request.nextUrl.searchParams.get("fee") ?? "",
    sort: request.nextUrl.searchParams.get("sort") ?? "",
  };

  return NextResponse.json({ data: await getBooksFromApi(filters) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.author || !body?.providerEmail) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const book = await createBook({
    title: body.title,
    author: body.author,
    description: body.description ?? "",
    deliveryFee: Number(body.deliveryFee ?? 0),
    category: body.category ?? "Fiction",
    coverImage: body.coverImage ?? "",
    provider: body.provider ?? "Librarian",
    providerEmail: body.providerEmail,
  });

  return NextResponse.json({ data: book }, { status: 201 });
}
