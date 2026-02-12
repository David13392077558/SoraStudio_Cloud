"use client";

import { useRouter } from "next/navigation";
import React from "react";

export function LogoutButton({
  children,
  className,
  iconClassName,
  labelClassName,
}: {
  children: React.ReactNode; // icon node
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}) {
  const router = useRouter();

  async function onLogout() {
    const ok = confirm("确定要退出登录吗？");
    if (!ok) return;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button type="button" onClick={onLogout} className={className}>
      <span className={iconClassName}>{children}</span>
      <span className={labelClassName}>退出登录</span>
    </button>
  );
}

