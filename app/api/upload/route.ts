export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const file = await req.blob();
    const filename = `video-${Date.now()}.mp4`;

    const { url } = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "upload failed", detail: String(err) },
      { status: 500 }
    );
  }
}
