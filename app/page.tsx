"use client";

import { useEffect, useMemo, useState } from "react";
import { VideoUploader } from "@/app/components/VideoUploader";
import { TaskStatusCard } from "@/app/components/TaskStatusCard";
import type { TaskRecord } from "@/app/utils/redis";

type CreateTaskResponse =
  | { success: true; taskId: string; task: TaskRecord }
  | { success: false; error: string };

type StatusResponse =
  | { success: true; task: TaskRecord }
  | { success: false; error: string };

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [taskType, setTaskType] = useState("video_analysis");

  const [creating, setCreating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [task, setTask] = useState<TaskRecord | null>(null);
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

  // 轮询任务状态
  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/status?taskId=${encodeURIComponent(taskId)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as StatusResponse;
        if (!data.success) return;
        if (!cancelled) setTask(data.task);
      } catch {
        // ignore
      }
    };

    tick();
    const timer = setInterval(tick, 1500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [taskId]);

  async function createTask() {
    setCreating(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        videoUrl: videoUrl.trim() || undefined,
        localFileName: videoFile?.name || undefined,
      };

      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: taskType, payload }),
      });

      const data = (await res.json()) as CreateTaskResponse;
      if (!data.success) throw new Error(data.error);

      setTaskId(data.taskId);
      setTask(data.task);
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建任务失败");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-3">
            <div className="text-3xl font-bold gradient-text">SoraStudio Cloud</div>
            <span className="text-xs text-white/60 border border-white/15 rounded-full px-3 py-1 glass-dark">
              Serverless + Queue + Worker
            </span>
          </div>
          <p className="text-white/70 max-w-2xl">
            提交任务 → 写入 Upstash Redis 队列 → Worker 消费 → 写回结果 → 前端轮询展示。
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="space-y-1">
              <div className="text-white font-semibold">1) 选择视频（Demo UI）</div>
              <div className="text-white/60 text-sm">
                说明：本示例页面只提交任务元数据；如需真正上传文件，可后续接入 Vercel Blob / Supabase
                Storage。
              </div>
            </div>

            <VideoUploader
              preview={preview || undefined}
              onVideoSelect={(f) => setVideoFile(f)}
              isLoading={creating}
            />

            <div className="space-y-2">
              <label className="text-xs text-white/70">可选：公共视频 URL（Worker 才能下载）</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-white/70">任务类型</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="video_analysis">video_analysis</option>
                  <option value="video_generation">video_generation</option>
                  <option value="digital_human">digital_human</option>
                  <option value="generate_script">generate_script</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70">提交</label>
                <button
                  type="button"
                  onClick={createTask}
                  disabled={creating}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50"
                >
                  {creating ? "创建中..." : "创建任务"}
                </button>
              </div>
            </div>

            {error ? (
              <div className="text-sm text-red-200/90 border border-red-500/30 bg-red-500/10 rounded-xl p-4">
                {error}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="text-white font-semibold">2) 任务状态</div>
            {task ? (
              <TaskStatusCard task={task} />
            ) : (
              <div className="glass-dark border border-white/10 rounded-2xl p-6 text-white/65">
                还没有任务。点击左侧「创建任务」开始。
              </div>
            )}

            {taskId ? (
              <div className="text-xs text-white/60">
                轮询接口：<span className="font-mono">/api/status?taskId={taskId}</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
