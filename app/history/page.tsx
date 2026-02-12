import Link from "next/link";
import { listHistory } from "@/app/utils/redis";

export default async function HistoryPage() {
  const tasks = await listHistory(20);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">历史记录</h1>
        <p className="text-sm text-white/60">
          最近创建的任务会自动写入历史列表（Redis 列表），这里展示最近 20 条。
        </p>
      </header>

      <section className="glass-dark border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>时间线</span>
          <span>共 {tasks.length} 条</span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-sm text-white/60">暂无历史记录。去「视频分析」创建一个任务吧。</div>
        ) : (
          <div className="divide-y divide-white/10">
            {tasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-white/85 truncate">
                    {t.type} · <span className="text-white/60">{t.status}</span>
                  </div>
                  <div className="text-xs text-white/45 font-mono truncate">{t.id}</div>
                </div>
                <Link
                  href={`/task/${t.id}`}
                  className="shrink-0 text-xs text-white/70 hover:text-white hover:underline"
                >
                  查看
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

