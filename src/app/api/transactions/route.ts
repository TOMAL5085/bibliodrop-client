import { NextResponse } from "next/server";
import { transactions } from "@/lib/server-state";

export function GET() {
  return NextResponse.json({ data: transactions });
}
