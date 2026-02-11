import { NextResponse } from "next/server";
import { getTask } from "@/app/utils/redis";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId") || "";
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "Missing query param: taskId" },
        { status: 400 }
      );
    }

    const task = await getTask(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, task });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

