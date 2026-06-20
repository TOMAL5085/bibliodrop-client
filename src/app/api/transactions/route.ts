import { NextResponse } from "next/server";
import { listTransactions } from "@/lib/persistence";

export async function GET() {
  return NextResponse.json({ data: await listTransactions() });
}
