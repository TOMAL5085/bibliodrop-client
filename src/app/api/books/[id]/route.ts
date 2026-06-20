import { NextResponse } from "next/server";
import { listReviewsByBookId } from "@/lib/persistence";
import { getBookById, getSimilarBooks } from "@/lib/site-data";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: book,
    reviews: await listReviewsByBookId(id),
    similarBooks: getSimilarBooks(book),
  });
}
