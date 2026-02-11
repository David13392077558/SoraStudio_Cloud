"use client";

import type { TaskRecord } from "@/app/utils/redis";

const statusMeta: Record<
  TaskRecord["status"],
  { label: string; className: string }
> = {
  queued: { label: "排队中", className: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30" },
  running: { label: "处理中", className: "bg-blue-500/15 text-blue-200 border-blue-500/30" },
  done: { label: "完成", className: "bg-green-500/15 text-green-200 border-green-500/30" },
  failed: { label: "失败", className: "bg-red-500/15 text-red-200 border-red-500/30" },
};

export function TaskStatusCard({ task }: { task: TaskRecord }) {
  const meta = statusMeta[task.status];

  return (
    <div className="glass-dark border border-white/10 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-white/60 text-xs">Task ID</div>
          <div className="text-white font-mono text-xs break-all">{task.id}</div>
        </div>
        <span className={`text-xs border rounded-full px-3 py-1 ${meta.className}`}>
          {meta.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>进度</span>
          <span>{Math.max(0, Math.min(100, task.progress ?? 0))}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${Math.max(0, Math.min(100, task.progress ?? 0))}%` }}
          />
        </div>
      </div>

      {task.error ? (
        <div className="text-sm text-red-200/90 border border-red-500/30 bg-red-500/10 rounded-lg p-3">
          {task.error}
        </div>
      ) : null}

      {task.status === "done" && task.result ? (
        <pre className="text-xs text-white/80 bg-black/30 border border-white/10 rounded-lg p-3 overflow-auto">
          {JSON.stringify(task.result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

