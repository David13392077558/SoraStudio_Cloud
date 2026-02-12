import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const file = await req.blob();
  const filename = `video-${Date.now()}.mp4`;

  const { url } = await put(filename, file, {
    access: "public",
  });

  return NextResponse.json({ url });
}
