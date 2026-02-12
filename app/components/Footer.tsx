"use client";

import { WorkerStatusLight } from "@/app/components/WorkerStatusLight";

export function Footer() {
  return (
    <footer className="pt-6 border-t border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-white/50">
          © {new Date().getFullYear()} <span className="text-white/70">AlphaPilot</span> · Engineering Heritage
        </div>
        <WorkerStatusLight />
      </div>
    </footer>
  );
}

