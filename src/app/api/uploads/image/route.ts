import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ message: "IMGBB_API_KEY is missing" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadData = new FormData();
  uploadData.append("image", buffer.toString("base64"));

  const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: uploadData,
  });

  if (!uploadResponse.ok) {
    return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
  }

  const payload = (await uploadResponse.json()) as {
    data?: { url?: string };
  };

  if (!payload.data?.url) {
    return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
  }

  return NextResponse.json({ url: payload.data.url });
}
