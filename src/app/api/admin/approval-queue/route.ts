import { NextResponse } from "next/server";
import { getApprovalQueue } from "@/lib/persistence";

export async function GET() {
  return NextResponse.json({ data: await getApprovalQueue() });
}
