import Link from "next/link";
import { listHistory, type TaskRecord } from "@/app/utils/redis";

function groupByType(tasks: TaskRecord[]) {
  const map = new Map<string, TaskRecord[]>();
  for (const t of tasks) {
    const key = t.type || "unknown";
    const arr = map.get(key) ?? [];
    arr.push(t);
    map.set(key, arr);
  }
  return Array.from(map.entries());
}

export default async function ProjectsPage() {
  // 当前版本：以「历史任务」作为项目列表来源（后续可改为独立 projects 表/集合）
  const tasks = await listHistory(50);
  const grouped = groupByType(tasks);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">项目管理</h1>
        <p className="text-sm text-white/60">
          当前以任务历史聚合作为“项目”视图（最近 50 条）。后续可接入真正的项目实体与标签/搜索。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-white/90">快速入口</h2>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            <Link className="glass-dark border border-white/10 rounded-xl p-4 hover:bg-white/5 transition" href="/analyze">
              <div className="text-white/85 font-medium">视频分析</div>
              <div className="text-xs text-white/50 mt-1">创建任务并查看结果</div>
            </Link>
            <Link className="glass-dark border border-white/10 rounded-xl p-4 hover:bg-white/5 transition" href="/sora">
              <div className="text-white/85 font-medium">Sora 提示词</div>
              <div className="text-xs text-white/50 mt-1">占位页（待完善）</div>
            </Link>
            <Link className="glass-dark border border-white/10 rounded-xl p-4 hover:bg-white/5 transition" href="/studio">
              <div className="text-white/85 font-medium">数字人工作台</div>
              <div className="text-xs text-white/50 mt-1">占位页（待完善）</div>
            </Link>
            <Link className="glass-dark border border-white/10 rounded-xl p-4 hover:bg-white/5 transition" href="/ecommerce">
              <div className="text-white/85 font-medium">电商带货</div>
              <div className="text-xs text-white/50 mt-1">占位页（待完善）</div>
            </Link>
          </div>
        </div>

        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-white/90">按类型分组</h2>
          {tasks.length === 0 ? (
            <div className="text-sm text-white/60">暂无项目数据（先创建一个任务）。</div>
          ) : (
            <div className="space-y-3">
              {grouped.map(([type, items]) => (
                <div key={type} className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-black/20 flex items-center justify-between">
                    <div className="text-sm text-white/80">{type}</div>
                    <div className="text-xs text-white/50">{items.length} 条</div>
                  </div>
                  <div className="divide-y divide-white/10">
                    {items.slice(0, 5).map((t) => (
                      <div key={t.id} className="px-4 py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm text-white/85 truncate">
                            {t.status} · {t.progress}%
                          </div>
                          <div className="text-xs text-white/45 font-mono truncate">{t.id}</div>
                        </div>
                        <Link href={`/task/${t.id}`} className="text-xs text-white/70 hover:text-white hover:underline">
                          查看
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

