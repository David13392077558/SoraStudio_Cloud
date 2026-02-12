export default function SoraPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          Sora 提示词工作台
        </h1>
        <p className="text-sm text-white/60">
          为 Sora 或其他视频生成模型设计高质量的提示词。此处暂为占位 UI，后续会接入真实提示词生成逻辑与历史记录。
        </p>
      </header>

      <section className="glass-dark border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="text-sm text-white/70">
          这里将包含：
        </div>
        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
          <li>视频风格、镜头语言、角色设定等参数输入区域</li>
          <li>一键生成多版本提示词的按钮</li>
          <li>提示词预览与复制功能</li>
        </ul>
      </section>
    </div>
  );
}

