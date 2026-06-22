import { NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/persistence";

type Params = {
  params: Promise<{ role: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { role } = await params;
  const data = getDashboardPayload(role);

  if (!data) {
    return NextResponse.json({ message: "Dashboard role not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
