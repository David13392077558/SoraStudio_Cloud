import json
import os
import time
from typing import Any, Dict, Optional

import requests
from dotenv import load_dotenv


load_dotenv()


def required_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env: {name}")
    return v


UPSTASH_URL = required_env("UPSTASH_REDIS_REST_URL").rstrip("/")
UPSTASH_TOKEN = required_env("UPSTASH_REDIS_REST_TOKEN")


def upstash(command: str, *args: str) -> Any:
    url = f"{UPSTASH_URL}/{command}"
    if args:
        url += "/" + "/".join([requests.utils.quote(str(a), safe="") for a in args])

    res = requests.post(url, headers={"Authorization": f"Bearer {UPSTASH_TOKEN}"}, timeout=30)
    res.raise_for_status()
    data = res.json()
    if "error" in data:
        raise RuntimeError(data["error"])
    return data.get("result")

def set_heartbeat() -> None:
    # milliseconds
    upstash("set", "worker:heartbeat", str(int(time.time() * 1000)))


def task_key(task_id: str) -> str:
    return f"task:{task_id}"


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    raw = upstash("get", task_key(task_id))
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return None


def set_task(task: Dict[str, Any]) -> None:
    upstash("set", task_key(task["id"]), json.dumps(task, ensure_ascii=False))


def set_status(task_id: str, status: str, progress: Optional[int] = None) -> None:
    now = int(time.time() * 1000)
    task = get_task(task_id) or {
        "id": task_id,
        "type": "unknown",
        "status": status,
        "progress": 0,
        "createdAt": now,
        "updatedAt": now,
    }
    task["status"] = status
    task["updatedAt"] = now
    if progress is not None:
        task["progress"] = int(progress)
    set_task(task)


def set_result(task_id: str, result: Any) -> None:
    now = int(time.time() * 1000)
    task = get_task(task_id) or {"id": task_id, "type": "unknown", "createdAt": now}
    task["status"] = "done"
    task["progress"] = 100
    task["result"] = result
    task["updatedAt"] = now
    set_task(task)


def fail_task(task_id: str, error: str) -> None:
    now = int(time.time() * 1000)
    task = get_task(task_id) or {"id": task_id, "type": "unknown", "createdAt": now}
    task["status"] = "failed"
    task["error"] = error
    task["updatedAt"] = now
    set_task(task)


def simulate_task(task: Dict[str, Any]) -> Any:
    task_type = task.get("type") or "unknown"
    payload = task.get("payload") or {}

    # Demo: keep it deterministic + fast
    if task_type == "video_analysis":
        time.sleep(2)
        video_url = payload.get("videoUrl")
        return {
            "style_tags": ["明亮", "动态"],
            "source": "demo-worker",
            "video_url": video_url,
        }

    if task_type == "video_generation":
        time.sleep(3)
        return {"video_url": f"/generated/{task['id']}.mp4", "source": "demo-worker"}

    if task_type == "digital_human":
        time.sleep(3)
        return {"video_url": f"/digital_human/{task['id']}.mp4", "source": "demo-worker"}

    if task_type == "generate_script":
        time.sleep(1)
        desc = (payload.get("productDescription") or "").strip()
        return {
            "script": f"【Demo脚本】{desc or '这是一段示例带货口播脚本。'}",
            "highlights": "卖点清单（示例）",
            "source": "demo-worker",
        }

    time.sleep(1)
    return {"message": f"Unknown task type: {task_type}", "source": "demo-worker"}


def run() -> None:
    print("🚀 HF Worker started. Polling Upstash queue: tasks:queue")
    while True:
        try:
            # heartbeat on every loop
            set_heartbeat()
            task_id = upstash("lpop", "tasks:queue")
            if not task_id:
                time.sleep(1)
                continue

            if isinstance(task_id, (bytes, bytearray)):
                task_id = task_id.decode("utf-8")

            task = get_task(task_id)
            if not task:
                print(f"⚠️ task not found in redis: {task_id}")
                continue

            print(f"🟡 running task: {task_id} ({task.get('type')})")
            set_status(task_id, "running", progress=50)

            result = simulate_task(task)
            set_result(task_id, result)
            print(f"✅ done: {task_id}")

        except Exception as e:
            # Best-effort: if we have task id, mark failed
            msg = str(e)
            print(f"❌ worker error: {msg}")
            try:
                if "task_id" in locals() and task_id:
                    fail_task(str(task_id), msg)
            except Exception:
                pass
            time.sleep(2)


if __name__ == "__main__":
    run()

