"use client";

import { useEffect, useState } from "react";
import { TaskStatusCard } from "@/app/components/TaskStatusCard";
import type { TaskRecord } from "@/app/utils/redis";

type StatusResponse =
  | { success: true; task: TaskRecord }
  | { success: false; error: string };

export function TaskStatusClient({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`/api/status?taskId=${encodeURIComponent(taskId)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as StatusResponse;
        if (!data.success) throw new Error(data.error);
        if (!cancelled) setTask(data.task);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "查询失败");
      }
    }

    tick();
    const t = setInterval(tick, 1500);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [taskId]);

  if (error) {
    return (
      <div className="glass-dark border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-200/90">
        {error}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="glass-dark border border-white/10 rounded-2xl p-5 text-white/60">
        加载中…
      </div>
    );
  }

  return <TaskStatusCard task={task} />;
}

