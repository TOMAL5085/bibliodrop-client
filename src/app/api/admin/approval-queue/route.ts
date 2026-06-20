import { NextResponse } from "next/server";
import { getApprovalQueue } from "@/lib/persistence";

export function GET() {
  return NextResponse.json({ data: getApprovalQueue() });
}
