"use client";

import { useState } from "react";

export function AnalyzeClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!file) return;

    setLoading(true);

    // 1. 上传到 Vercel Blob
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: file,
    });

    const { url: videoUrl } = await uploadRes.json();

    // 2. 创建任务
    const taskRes = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "video_analysis",
        payload: { videoUrl },
      }),
    });

    const { taskId } = await taskRes.json();

    // 3. 跳转到任务页
    window.location.href = `/task/${taskId}`;
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "上传中..." : "开始分析"}
      </button>
    </div>
  );
}
