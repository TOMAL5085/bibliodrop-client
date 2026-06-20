import { NextResponse } from "next/server";
import { listReviewsByBookId } from "@/lib/persistence";

type Params = {
  params: Promise<{ bookId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { bookId } = await params;
  return NextResponse.json({ data: await listReviewsByBookId(bookId) });
}
