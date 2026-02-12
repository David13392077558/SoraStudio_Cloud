export default function EcommercePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          电商带货助手
        </h1>
        <p className="text-sm text-white/60">
          生成直播带货脚本、商品话术与短视频文案。此页面暂为 UI 占位，后续会接入电商脚本任务与结果展示。
        </p>
      </header>

      <section className="glass-dark border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="text-sm text-white/70">
          未来这里会包含：
        </div>
        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
          <li>商品信息输入区域（标题、卖点、链接等）</li>
          <li>带货风格选择（专业主播、朋友聊天、剧情向等）</li>
          <li>生成的脚本与高亮卖点清单展示</li>
        </ul>
      </section>
    </div>
  );
}

