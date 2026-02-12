import { AnalyzeClient } from "@/app/analyze/AnalyzeClient";

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">视频分析</h1>
        <p className="text-sm text-white/60">
          创建任务后会自动跳转到任务页，并通过 <span className="font-mono">/api/status</span> 轮询显示结果。
        </p>
      </header>

      <AnalyzeClient />
    </div>
  );
}

