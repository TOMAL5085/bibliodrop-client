import { NextResponse } from "next/server";
import { getBookDetails, listReviewsByBookId } from "@/lib/persistence";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const details = await getBookDetails(id);
  const book = details?.book;

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: book,
    reviews: await listReviewsByBookId(id),
    similarBooks: details?.similarBooks ?? [],
  });
}
