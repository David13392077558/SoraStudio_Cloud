export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          个人资料
        </h1>
        <p className="text-sm text-white/60">
          查看与管理你的账户信息。当前页面仅为 UI 占位，后续会接入 Supabase Auth 与用户资料表。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-white/90">基本信息</h2>
          <div className="text-sm text-white/70 space-y-1">
            <div>邮箱：placeholder@example.com</div>
            <div>昵称：SoraStudio User</div>
          </div>
        </div>

        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-white/90">使用统计</h2>
          <p className="text-sm text-white/70">
            未来会展示「总任务数 / 已完成任务 / 最近活跃时间」等数据，目前为占位文本。
          </p>
        </div>
      </section>
    </div>
  );
}

