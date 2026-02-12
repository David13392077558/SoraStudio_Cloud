"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VideoUploader } from "@/app/components/VideoUploader";

type CreateTaskResponse =
  | { success: true; taskId: string }
  | { success: false; error: string };

export function AnalyzeClient() {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (!videoFile) return "";
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function createTask() {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        videoUrl: videoUrl.trim() || undefined,
        localFileName: videoFile?.name || undefined,
      };

      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "video_analysis", payload }),
      });
      const data = (await res.json()) as CreateTaskResponse;
      if (!data.success) throw new Error(data.error);

      router.push(`/task/${data.taskId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建任务失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
      <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-white/90">上传视频</h2>

        <VideoUploader
          preview={preview || undefined}
          onVideoSelect={(f) => setVideoFile(f)}
          isLoading={loading}
        />

        <div className="space-y-2">
          <label className="text-xs text-white/70">可选：公共视频 URL（Worker 可下载）</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>

        {error ? (
          <div className="text-sm text-red-200/90 border border-red-500/30 bg-red-500/10 rounded-xl p-3">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          disabled={loading}
          onClick={createTask}
          className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "创建中..." : "创建分析任务"}
        </button>
      </div>

      <div className="glass-dark border border-white/10 rounded-2xl p-5 space-y-3">
        <h2 className="text-base font-semibold text-white/90">说明</h2>
        <p className="text-sm text-white/70">
          当前版本将视频信息写入任务队列（Upstash Redis），Worker 消费后把结果写回，任务页会自动轮询展示状态与结果。
        </p>
        <div className="text-xs text-white/50 space-y-1">
          <div>API：POST /api/task</div>
          <div>轮询：GET /api/status?taskId=…</div>
        </div>
      </div>
    </div>
  );
}

