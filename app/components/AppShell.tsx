"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/app/components/Sidebar";
import { Footer } from "@/app/components/Footer";

const AUTH_ROUTES = new Set(["/login", "/register"]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname ? AUTH_ROUTES.has(pathname) : false;

  if (isAuth) {
    return (
      <div className="min-h-screen gradient-bg px-6 py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 px-6 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

