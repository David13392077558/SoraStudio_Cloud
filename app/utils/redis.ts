type UpstashResult<T> = { result: T } | { error: string };

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function upstashBaseUrl(): string {
  // Example: https://xxxx.upstash.io
  return requiredEnv("UPSTASH_REDIS_REST_URL").replace(/\/+$/, "");
}

function upstashToken(): string {
  return requiredEnv("UPSTASH_REDIS_REST_TOKEN");
}

async function upstash<T>(command: string, ...args: Array<string | number>) {
  const url =
    `${upstashBaseUrl()}/${command}` +
    (args.length ? `/${args.map((a) => encodeURIComponent(String(a))).join("/")}` : "");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashToken()}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash REST error ${res.status}: ${text || res.statusText}`);
  }

  const json = (await res.json()) as UpstashResult<T>;
  if ("error" in json) throw new Error(`Upstash REST error: ${json.error}`);
  return json.result;
}

export type TaskStatus = "queued" | "running" | "done" | "failed";

export type TaskRecord = {
  id: string;
  type: string;
  status: TaskStatus;
  progress: number;
  payload?: unknown;
  result?: unknown;
  error?: string;
  createdAt: number;
  updatedAt: number;
};

export function taskKey(taskId: string) {
  return `task:${taskId}`;
}

export async function pushTask(taskId: string) {
  // FIFO: producer RPUSH, worker LPOP
  await upstash<number>("rpush", "tasks:queue", taskId);
}

export async function setTask(task: TaskRecord) {
  await upstash<string>("set", taskKey(task.id), JSON.stringify(task));
}

export async function getTask(taskId: string): Promise<TaskRecord | null> {
  const raw = await upstash<string | null>("get", taskKey(taskId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TaskRecord;
  } catch {
    return null;
  }
}

export async function getStatus(taskId: string) {
  const task = await getTask(taskId);
  return task ? { status: task.status, progress: task.progress } : null;
}

export async function setStatus(taskId: string, status: TaskStatus, progress?: number) {
  const existing = (await getTask(taskId)) ?? null;
  const now = Date.now();

  const next: TaskRecord = existing
    ? { ...existing, status, updatedAt: now }
    : {
        id: taskId,
        type: "unknown",
        status,
        progress: progress ?? 0,
        createdAt: now,
        updatedAt: now,
      };

  if (typeof progress === "number") next.progress = progress;
  await setTask(next);
}

export async function setResult(taskId: string, result: unknown) {
  const existing = (await getTask(taskId)) ?? null;
  const now = Date.now();
  const next: TaskRecord = existing
    ? { ...existing, result, updatedAt: now }
    : {
        id: taskId,
        type: "unknown",
        status: "done",
        progress: 100,
        result,
        createdAt: now,
        updatedAt: now,
      };
  await setTask(next);
}

