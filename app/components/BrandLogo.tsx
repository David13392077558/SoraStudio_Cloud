"use client";

import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <LogoMark />
      <div className="leading-tight">
        <div className="text-xl font-bold gradient-text">AlphaPilot</div>
        {!compact ? (
          <div className="text-[11px] text-white/50">Engineering Heritage</div>
        ) : null}
      </div>
    </Link>
  );
}

function LogoMark() {
  // Inline SVG (no binary assets needed)
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="drop-shadow"
    >
      <defs>
        <linearGradient id="ap_g" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FACFE" />
          <stop offset="1" stopColor="#00F2FE" />
        </linearGradient>
      </defs>

      {/* orbit */}
      <path
        d="M32 6C18.2 6 7 17.2 7 31s11.2 25 25 25 25-11.2 25-25S45.8 6 32 6Z"
        stroke="url(#ap_g)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* eye */}
      <path
        d="M12 32c5.2-8.2 12.5-12 20-12s14.8 3.8 20 12c-5.2 8.2-12.5 12-20 12s-14.8-3.8-20-12Z"
        stroke="url(#ap_g)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="7.5" stroke="url(#ap_g)" strokeWidth="5" />

      {/* sparkles */}
      <path d="M12 14l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill="#7DF9FF" opacity="0.9" />
      <path d="M52 44l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3Z" fill="#7DF9FF" opacity="0.9" />
    </svg>
  );
}

