"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { email, password, name }
        ),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error || "认证失败");
      router.replace("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "认证失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" ? (
        <div className="space-y-2">
          <label className="text-xs text-white/70">昵称（可选）</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="SoraStudio User"
            className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-xs text-white/70">邮箱</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-white/70">密码</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />
      </div>

      {error ? (
        <div className="text-sm text-red-200/90 border border-red-500/30 bg-red-500/10 rounded-xl p-3">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50"
      >
        {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
      </button>

      <div className="text-xs text-white/60 text-center">
        {mode === "login" ? (
          <>
            还没有账号？{" "}
            <Link href="/register" className="text-white hover:underline">
              去注册
            </Link>
          </>
        ) : (
          <>
            已有账号？{" "}
            <Link href="/login" className="text-white hover:underline">
              去登录
            </Link>
          </>
        )}
      </div>
    </form>
  );
}

