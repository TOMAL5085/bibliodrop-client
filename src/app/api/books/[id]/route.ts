import { NextResponse } from "next/server";
import { getBookDetailsFromApi } from "@/lib/server-state";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const payload = getBookDetailsFromApi(id);

  if (!payload) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: payload.book,
    reviews: payload.reviews,
    similarBooks: payload.similarBooks,
  });
}
