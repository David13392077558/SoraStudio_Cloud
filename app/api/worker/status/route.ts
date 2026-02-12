import { NextResponse } from "next/server";
import { getQueueDepth, getWorkerHeartbeatMs } from "@/app/utils/redis";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [queueDepth, hb] = await Promise.all([getQueueDepth(), getWorkerHeartbeatMs()]);
    const now = Date.now();
    const lastHeartbeatMs = hb ?? null;
    const ageMs = lastHeartbeatMs ? now - lastHeartbeatMs : null;
    const online = typeof ageMs === "number" ? ageMs >= 0 && ageMs < 30_000 : false;

    return NextResponse.json({
      success: true,
      worker: {
        online,
        lastHeartbeatMs,
        ageMs,
      },
      queue: {
        depth: queueDepth,
      },
      now,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

