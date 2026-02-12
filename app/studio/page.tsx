export default function StudioPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          数字人工作台
        </h1>
        <p className="text-sm text-white/60">
          构建你的虚拟数字人：形象、声音与脚本编排。当前页面仅为 UI 占位，后续会接入数字人任务类型与配置向导。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-2 md:col-span-2">
          <h2 className="text-base font-semibold text-white/90">场景设置（占位）</h2>
          <p className="text-sm text-white/70">
            比如：直播带货、课程讲解、品牌 IP 形象等场景预设。
          </p>
        </div>

        <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-2">
          <h2 className="text-base font-semibold text-white/90">输出预览（占位）</h2>
          <p className="text-sm text-white/70">
            将来会展示数字人视频预览截图、基础参数等。
          </p>
        </div>
      </section>
    </div>
  );
}

