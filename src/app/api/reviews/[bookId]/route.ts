import { NextResponse } from "next/server";
import { reviews } from "@/lib/server-state";

type Params = {
  params: Promise<{ bookId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { bookId } = await params;
  return NextResponse.json({ data: reviews.filter((review) => review.bookId === bookId) });
}
