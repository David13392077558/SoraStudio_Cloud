"use client";

import Link from "next/link";
import {
  BarChart3,
  FolderOpen,
  History,
  LogOut,
  ShoppingBag,
  User,
  UserCircle,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/app/components/BrandLogo";
import { LogoutButton } from "@/app/components/LogoutButton";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl px-6 py-8 flex flex-col">
      {/* Logo */}
      <div className="mb-10">
        <BrandLogo />
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 text-sm text-white/80">
        <SidebarItem href="/projects" icon={FolderOpen} label="项目管理" iconHoverClass="group-hover:text-blue-400" />
        <SidebarItem href="/history" icon={History} label="历史记录" iconHoverClass="group-hover:text-purple-400" />
        <SidebarItem href="/sora" icon={Video} label="Sora 提示词" iconHoverClass="group-hover:text-pink-400" />
        <SidebarItem href="/analyze" icon={BarChart3} label="视频分析" iconHoverClass="group-hover:text-cyan-400" />
        <SidebarItem href="/studio" icon={UserCircle} label="数字人工作台" iconHoverClass="group-hover:text-green-400" />
        <SidebarItem href="/ecommerce" icon={ShoppingBag} label="电商带货" iconHoverClass="group-hover:text-yellow-400" />
      </nav>

      {/* User / auth section */}
      <div className="mt-6 border-t border-white/10 pt-4 space-y-1 text-sm">
        <SidebarItem href="/profile" icon={User} label="个人资料" iconHoverClass="group-hover:text-blue-400" />

        <LogoutButton
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-200/80 hover:text-red-100 hover:bg-red-500/15 transition-all w-full"
          iconClassName="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-300 group-hover:bg-red-500/25"
          labelClassName="group-hover:translate-x-0.5 transition-transform"
        >
          <LogOut className="h-4 w-4" />
        </LogoutButton>
      </div>
    </aside>
  );
}

type ItemProps = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  iconHoverClass: string;
};

function SidebarItem({ href, icon: Icon, label, iconHoverClass }: ItemProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 group-hover:bg-white/10">
        <Icon className={`h-4 w-4 transition-colors ${iconHoverClass}`} />
      </span>
      <span className="group-hover:translate-x-0.5 transition-transform">
        {label}
      </span>
    </Link>
  );
}

