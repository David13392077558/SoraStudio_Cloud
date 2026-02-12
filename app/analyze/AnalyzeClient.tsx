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

  // ⭐ 上传到 Vercel Blob
  async function uploadToVercelBlob(file: File) {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: file,
    });

    const data = await res.json();
    return data.url; // Worker 可访问的公共 URL
  }

  async function createTask() {
    setError(null);
    setLoading(true);

    try {
      if (!videoFile) {
        throw new Error("请先选择视频文件");
      }

      // ⭐ 1. 上传文件到 Vercel Blob
      const videoUrl = await uploadToVercelBlob(videoFile);

      // ⭐ 2. 创建任务（只传 URL）
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video_analysis",
          payload: {
            videoUrl, // Worker 就能下载了
          },
        }),
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
          当前版本将视频上传到 Vercel Blob，并将 URL 写入任务队列。Worker 会下载并处理视频，任务页会自动轮询展示状态与结果。
        </p>
        <div className="text-xs text-white/50 space-y-1">
          <div>API：POST /api/task</div>
          <div>轮询：GET /api/status?taskId=…</div>
        </div>
      </div>
    </div>
  );
}
