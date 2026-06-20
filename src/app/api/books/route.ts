import { NextRequest, NextResponse } from "next/server";
import { getBooksFromApi } from "@/lib/server-state";

export function GET(request: NextRequest) {
  const filters = {
    query: request.nextUrl.searchParams.get("query") ?? "",
    category: request.nextUrl.searchParams.get("category") ?? "",
    status: request.nextUrl.searchParams.get("status") ?? "",
    fee: request.nextUrl.searchParams.get("fee") ?? "",
    sort: request.nextUrl.searchParams.get("sort") ?? "",
  };

  return NextResponse.json({ data: getBooksFromApi(filters) });
}
