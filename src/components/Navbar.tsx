"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/planejamento", label: "Planejamento" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 border-b border-border-soft bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-10">
        <div className="flex items-center gap-8 md:gap-11">
          <Link
            href="/"
            className="text-[22px] font-black tracking-tight text-yellow"
          >
            MundialBet
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b-2 py-1 text-[15px] font-semibold transition-colors ${
                    active
                      ? "border-yellow text-yellow"
                      : "border-transparent text-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-green/35 bg-green/10 px-4 py-2 font-mono text-sm font-bold text-green-bright">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            R$ 250,00
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface-2 text-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
