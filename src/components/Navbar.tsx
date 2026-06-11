"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Gestão de Banca" },
  { href: "/calendario", label: "Calendário" },
  { href: "/relatorios", label: "Relatórios" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-[#0c0f0f]">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-3.5 md:px-8">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-green/15">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
              </svg>
            </span>
            <span className="text-[19px] font-bold tracking-tight">
              MundialBet <span className="font-mono text-xs font-normal tracking-[2px] text-muted-2">PRO</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b-2 py-4 font-mono text-[13px] transition-colors ${
                    active
                      ? "border-green text-fg"
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
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted-2">
              Saldo Disponível
            </div>
            <div className="font-mono text-[15px] font-medium text-green">R$ 250,00</div>
          </div>
          <div className="h-9 w-px bg-border" />
          <div className="h-9 w-9 overflow-hidden rounded-[6px] border border-border bg-gradient-to-br from-surface-2 to-surface">
            <svg viewBox="0 0 36 36" className="h-full w-full text-muted-2">
              <rect width="36" height="36" fill="currentColor" opacity="0.25" />
              <circle cx="18" cy="14" r="6" fill="currentColor" opacity="0.6" />
              <path d="M6 34c0-7 6-10 12-10s12 3 12 10z" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
