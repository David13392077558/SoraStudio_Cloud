import Link from "next/link";
import TaskStatusClient from "@/app/components/TaskStatusClient";


interface TaskPageProps {
  params: {
    taskId: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  const taskId = params.taskId;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">任务状态</h1>
        <p className="text-sm text-white/60">
          任务 ID：<span className="font-mono text-white/70">{taskId}</span>
        </p>
        <div className="text-xs text-white/50">
          <Link href="/analyze" className="hover:underline">
            返回视频分析
          </Link>
        </div>
      </header>

      <TaskStatusClient taskId={taskId} />
    </div>
  );
}
