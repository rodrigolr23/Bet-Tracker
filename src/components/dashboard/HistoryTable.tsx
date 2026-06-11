"use client";

import { useMemo, useState } from "react";
import { historyRows, type CasaTone, type StatusKind } from "@/data/dashboard";

const COLS = "minmax(150px,1.2fr) minmax(190px,1.7fr) minmax(150px,1.4fr) 96px 72px 110px 110px minmax(110px,1.1fr)";

const casaTone: Record<CasaTone, string> = {
  amber: "border-yellow/45 text-yellow",
  green: "border-green/45 text-green",
  lavender: "border-lavender/45 text-lavender",
};

const statusTone: Record<StatusKind, string> = {
  pendente: "border-border text-muted",
  green: "border-green/45 text-green",
  red: "border-red/45 text-red",
};

const resultTone: Record<StatusKind, string> = {
  pendente: "text-muted-2",
  green: "text-green",
  red: "text-red",
};

export function HistoryTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      historyRows.filter((r) =>
        r.match.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <section className="rounded-[6px] border border-border bg-surface">
      {/* Card header */}
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-[15px] font-bold tracking-[1px] text-fg">
            HISTÓRICO ANALÍTICO
          </h2>
          <Chip>FILTRO: 30 DIAS</Chip>
          <Chip>STATUS: TODOS</Chip>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-[280px] lg:flex-none">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por confronto..."
              className="w-full rounded-[5px] border border-border bg-bg py-2.5 pl-9 pr-3 font-mono text-[13px] text-fg outline-none placeholder:text-muted-2 focus:border-muted"
            />
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-3.5 py-2.5 font-mono text-[13px] text-muted transition-colors hover:text-fg">
            <DownloadIcon /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          {/* Head */}
          <div
            className="grid items-center gap-3 border-b border-border bg-surface-2/40 px-5 py-3.5"
            style={{ gridTemplateColumns: COLS }}
          >
            {["DATA DO JOGO", "CONFRONTO / COMPETIÇÃO", "TIPO / MERCADO", "CASA", "ODDS", "STAKE (R$)", "STATUS", "RESULTADO"].map(
              (h, i) => (
                <span
                  key={h}
                  className={`font-mono text-[11px] tracking-[1px] text-muted-2 ${
                    i >= 4 ? "text-right" : ""
                  } ${i === 3 || i === 6 ? "!text-left" : ""}`}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* Rows */}
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid items-center gap-3 border-b border-border-soft px-5 py-4 last:border-b-0 hover:bg-surface-2/30"
              style={{ gridTemplateColumns: COLS }}
            >
              <span className="font-mono text-[13px] text-muted">{r.date}</span>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <Flag bg={r.home.flag} />
                  <Flag bg={r.away.flag} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-fg">{r.match}</div>
                  <div className="font-mono text-[10px] tracking-[0.5px] text-muted-2">
                    {r.competition}
                  </div>
                </div>
              </div>

              <span className="text-[13px] text-muted">{r.market}</span>

              <div>
                <span className={`inline-block rounded-[4px] border px-2.5 py-1 font-mono text-[11px] ${casaTone[r.casaTone]}`}>
                  {r.casa}
                </span>
              </div>

              <span className="text-right font-mono text-[13px] font-medium text-yellow">
                {r.odds}
              </span>

              <span className="text-right font-mono text-[13px] text-fg">
                {r.stake}
              </span>

              <div className="text-right">
                <span className={`inline-block rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.5px] ${statusTone[r.status]}`}>
                  {r.statusLabel}
                </span>
              </div>

              <span className={`text-right font-mono text-[13px] font-medium ${resultTone[r.status]}`}>
                {r.result}
              </span>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-[13px] text-muted-2">
              Nenhum confronto encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[12px] tracking-[0.5px] text-muted-2">
          PÁGINA 1 DE 12 (124 REGISTROS TOTAIS)
        </span>
        <div className="flex items-center gap-2">
          <PageBtn>Anterior</PageBtn>
          <PageBtn active>1</PageBtn>
          <PageBtn>2</PageBtn>
          <PageBtn>Próximo</PageBtn>
        </div>
      </div>
    </section>
  );
}

function Flag({ bg }: { bg: string }) {
  return (
    <span
      className="h-[22px] w-[22px] rounded-full border border-bg ring-1 ring-white/10"
      style={{ background: bg }}
    />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[4px] border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.5px] text-muted-2">
      {children}
    </span>
  );
}

function PageBtn({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`min-w-[36px] rounded-[5px] border px-3 py-1.5 font-mono text-[12px] transition-colors ${
        active
          ? "border-green bg-green/15 text-green"
          : "border-border bg-surface-2 text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
