"use client";

import { useEffect, useState } from "react";

type WorkerStatus =
  | {
      success: true;
      worker: { online: boolean; ageMs: number | null };
      queue: { depth: number };
    }
  | { success: false; error: string };

export function WorkerStatusLight({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<WorkerStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch("/api/worker/status", { cache: "no-store" });
        const json = (await res.json()) as WorkerStatus;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ success: false, error: "network" });
      }
    }
    tick();
    const t = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const online = data?.success ? data.worker.online : false;
  const depth = data?.success ? data.queue.depth : null;

  return (
    <div className="inline-flex items-center gap-2 text-xs text-white/60">
      <span
        className={[
          "h-2.5 w-2.5 rounded-full",
          online ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" : "bg-red-400",
        ].join(" ")}
        aria-label={online ? "worker online" : "worker offline"}
      />
      {!compact ? <span>Worker</span> : null}
      {typeof depth === "number" ? (
        <span className="text-white/50">队列 {depth}</span>
      ) : null}
    </div>
  );
}

