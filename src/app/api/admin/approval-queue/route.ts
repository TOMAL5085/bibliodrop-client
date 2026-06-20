import { NextResponse } from "next/server";
import { getApprovalQueue } from "@/lib/server-state";

export function GET() {
  return NextResponse.json({ data: getApprovalQueue() });
}
