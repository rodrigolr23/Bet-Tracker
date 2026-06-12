"use client";

import { useMemo, useState } from "react";
import { useBets } from "@/lib/bets/store";
import { betProfit, type Bet, type BetStatus } from "@/lib/bets/types";
import { formatDate, formatSignedBRL } from "@/lib/format";
import { splitMatch } from "@/data/flags";
import { MatchFlags } from "@/components/TeamFlag";

const COLS =
  "minmax(120px,1fr) minmax(200px,1.8fr) 80px 110px 100px 120px 130px";

const statusTone: Record<BetStatus, string> = {
  pendente: "border-border text-muted",
  green: "border-green/45 text-green",
  red: "border-red/45 text-red",
};

const statusLabel: Record<BetStatus, string> = {
  pendente: "PENDENTE",
  green: "GREEN",
  red: "RED",
};

const resultTone: Record<BetStatus, string> = {
  pendente: "text-muted-2",
  green: "text-green",
  red: "text-red",
};

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function HistoryTable({ onEdit }: { onEdit: (bet: Bet) => void }) {
  const { bets, setStatus, removeBet, hydrated } = useBets();
  const [query, setQuery] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      bets.filter((b) =>
        `${b.match} ${b.date}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [bets, query],
  );

  function settle(id: string, status: BetStatus) {
    setStatus(id, status);
    setFlashId(id);
  }

  function exportCsv() {
    const header = ["Data", "Confronto", "Odd", "Stake", "Status", "Resultado"];
    const lines = bets.map((b) =>
      [
        b.date,
        b.match,
        b.odds.toFixed(2),
        b.stake.toFixed(2),
        statusLabel[b.status],
        betProfit(b).toFixed(2),
      ]
        .map((c) => csvEscape(String(c)))
        .join(","),
    );
    const csv = [header.map(csvEscape).join(","), ...lines].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "bet-tracker.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-[6px] border border-border bg-surface">
      {/* Card header */}
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-[15px] font-bold tracking-[1px] text-fg">
            HISTÓRICO ANALÍTICO
          </h2>
          <Chip>{bets.length} REGISTROS</Chip>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-[280px] lg:flex-none">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por seleção..."
              className="w-full rounded-[5px] border border-border bg-bg py-2.5 pl-9 pr-3 font-mono text-[13px] text-fg outline-none placeholder:text-muted-2 focus:border-muted"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={bets.length === 0}
            className="flex shrink-0 items-center gap-2 rounded-[5px] border border-border bg-surface-2 px-3.5 py-2.5 font-mono text-[13px] text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <DownloadIcon /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          {/* Head */}
          <div
            className="grid items-center gap-3 border-b border-border bg-surface-2/40 px-5 py-3.5"
            style={{ gridTemplateColumns: COLS }}
          >
            {["DIA DO JOGO", "CONFRONTO", "ODD", "STAKE (R$)", "STATUS", "RESULTADO", "AÇÕES"].map(
              (h, i) => (
                <span
                  key={h}
                  className={`font-mono text-[11px] tracking-[1px] text-muted-2 ${
                    i === 2 || i === 3 || i === 5 ? "text-right" : ""
                  }`}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* Rows */}
          {rows.map((b) => {
            const profit = betProfit(b);
            return (
              <div
                key={b.id}
                onAnimationEnd={() => flashId === b.id && setFlashId(null)}
                className={`grid items-center gap-3 border-b border-border-soft px-5 py-4 last:border-b-0 hover:bg-surface-2/30 ${
                  flashId === b.id ? "animate-flash" : ""
                }`}
                style={{ gridTemplateColumns: COLS }}
              >
                <span className="font-mono text-[13px] text-muted">
                  {formatDate(b.date)}
                </span>

                <div className="flex items-center gap-3">
                  <MatchFlags home={splitMatch(b.match)[0]} away={splitMatch(b.match)[1]} />
                  <span className="text-[14px] font-semibold text-fg">
                    {b.match}
                  </span>
                </div>

                <span className="text-right font-mono text-[13px] font-medium text-yellow">
                  {b.odds.toFixed(2)}
                </span>

                <span className="text-right font-mono text-[13px] text-fg">
                  {b.stake.toFixed(2)}
                </span>

                <div>
                  <span className={`inline-block rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.5px] ${statusTone[b.status]}`}>
                    {statusLabel[b.status]}
                  </span>
                </div>

                <span className={`text-right font-mono text-[13px] font-medium ${resultTone[b.status]}`}>
                  {b.status === "pendente" ? "---" : formatSignedBRL(profit)}
                </span>

                <div className="flex items-center gap-1.5">
                  {b.status !== "green" && (
                    <SettleBtn label="G" tone="green" title="Marcar Green" onClick={() => settle(b.id, "green")} />
                  )}
                  {b.status !== "red" && (
                    <SettleBtn label="R" tone="red" title="Marcar Red" onClick={() => settle(b.id, "red")} />
                  )}
                  {b.status !== "pendente" && (
                    <SettleBtn label="•" tone="muted" title="Voltar a pendente" onClick={() => settle(b.id, "pendente")} />
                  )}
                  <IconBtn title="Editar" onClick={() => onEdit(b)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                    </svg>
                  </IconBtn>
                  <IconBtn title="Excluir" danger onClick={() => removeBet(b.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                    </svg>
                  </IconBtn>
                </div>
              </div>
            );
          })}

          {hydrated && bets.length === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="font-mono text-[13px] text-muted">
                Nenhuma aposta registrada ainda.
              </div>
              <div className="mt-1.5 font-mono text-[12px] text-muted-2">
                Use “Novo Registro” para começar a gerenciar sua banca.
              </div>
            </div>
          )}

          {bets.length > 0 && rows.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-[13px] text-muted-2">
              Nenhum registro encontrado para a busca.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SettleBtn({
  label,
  tone,
  title,
  onClick,
}: {
  label: string;
  tone: "green" | "red" | "muted";
  title: string;
  onClick: () => void;
}) {
  const tones = {
    green: "border-green/40 text-green hover:bg-green/15",
    red: "border-red/40 text-red hover:bg-red/15",
    muted: "border-border text-muted-2 hover:text-fg",
  };
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-[5px] border font-mono text-[12px] font-bold transition-colors ${tones[tone]}`}
    >
      {label}
    </button>
  );
}

function IconBtn({
  title,
  danger,
  onClick,
  children,
}: {
  title: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-[5px] border border-border text-muted transition-colors hover:text-fg ${
        danger ? "hover:border-red/40 hover:text-red" : "hover:border-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[4px] border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.5px] text-muted-2">
      {children}
    </span>
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
