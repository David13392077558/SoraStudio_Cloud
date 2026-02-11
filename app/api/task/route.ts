import { NextResponse } from "next/server";
import { pushTask, setTask, type TaskRecord } from "@/app/utils/redis";

export const runtime = "nodejs";

type CreateTaskBody = {
  type: string;
  payload?: unknown;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateTaskBody;
    if (!body?.type) {
      return NextResponse.json(
        { success: false, error: "Missing field: type" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    const task: TaskRecord = {
      id,
      type: body.type,
      status: "queued",
      progress: 0,
      payload: body.payload,
      createdAt: now,
      updatedAt: now,
    };

    await setTask(task);
    await pushTask(id);

    return NextResponse.json({ success: true, taskId: id, task });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

