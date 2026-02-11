# SoraStudio Cloud — 全云端 AI 视频生成平台（Vercel + Supabase + Upstash + HF Worker）

SoraStudio Cloud 是一个 **全云端、无服务器、可扩展的 AI 视频任务平台** 示例项目：

- 前端/接口：Next.js（App Router）部署在 Vercel
- 用户系统：Supabase Auth
- 队列与状态：Upstash Redis（REST）
- 计算执行：HuggingFace Spaces Worker（Python，轮询队列并写回结果）

> 当前仓库里也可能存在旧实现（如 `sorastudavid-frontend/`、`sorastudavid-worker/`）。本目录 `SoraStudio_Cloud/` 是新的云端架构版本。

---

## 🌟 架构总览

```
Browser (Next.js UI)
   │
   ├─ POST /api/task  ───────────────┐
   │                                  │
   │                         Upstash Redis (REST)
   │                                  │
   │                     - tasks:queue  (List)
   │                     - task:<id>   (String JSON)
   │                                  │
   └─ GET  /api/status?taskId=<id> ◄──┘
                                       ▲
                                       │
                                HF Worker (Python)
                                - LPOP tasks:queue
                                - SET task:<id> status/result
```

---

## 🧩 技术栈

| 模块 | 技术 | 作用 |
|------|------|------|
| 前端 | Next.js + Tailwind | UI、任务提交、状态展示 |
| API | Next.js Route Handlers | 创建任务 / 查询状态 / 登录注册 |
| 用户系统 | Supabase Auth | 登录 / 注册 |
| 队列/状态 | Upstash Redis（REST） | 队列 + 任务状态/结果 |
| Worker | HuggingFace Spaces（Python） | 轮询队列并处理任务 |

---

## 📁 项目结构

```
SoraStudio_Cloud/
├── app/
│   ├── api/
│   │   ├── task/route.ts
│   │   ├── status/route.ts
│   │   ├── auth/login/route.ts
│   │   └── auth/register/route.ts
│   ├── components/
│   │   ├── TaskStatusCard.tsx
│   │   └── VideoUploader.tsx
│   ├── utils/
│   │   ├── redis.ts
│   │   └── supabase.ts
│   ├── page.tsx
│   └── layout.tsx
│
├── hf-worker/
│   ├── worker.py
│   ├── requirements.txt
│   └── .env.example
│
├── supabase/
│   └── schema.sql
│
├── .env.example
└── README.md
```

---

## 🚀 快速开始（本地开发）

### 1) 配置环境变量

复制并填写：

```bash
cp .env.example .env
```

需要的变量：

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### 2) 启动前端（Next.js）

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

### 3) 启动 Worker（Python）

```bash
cd hf-worker
cp .env.example .env
pip install -r requirements.txt
python worker.py
```

Worker 会每 1 秒轮询一次 `tasks:queue`，并把处理结果写回 `task:<id>`。

---

## 🔌 API 说明（最小可用）

### `POST /api/task`

请求体：

```json
{ "type": "video_analysis", "payload": { "videoUrl": "https://..." } }
```

返回：

- `taskId`
- `task`（已写入 Redis，状态 `queued`）

### `GET /api/status?taskId=<id>`

返回：

- `task`（包含 `status/progress/result/error` 等字段）

---

## 🧠 任务数据格式（Redis）

- 队列：`tasks:queue`（List，生产端 `RPUSH`，Worker `LPOP`）
- 任务：`task:<id>`（String，JSON）

---

## 🧪 测试/验证建议

- 本地跑起 Next.js + Worker
- 页面点击「创建任务」
- 观察 Worker 日志
- 页面右侧状态卡片应从 `queued → running → done`，并展示 `result`

---

## 📄 许可证

MIT
