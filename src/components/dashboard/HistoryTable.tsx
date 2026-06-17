"use client";

import { useMemo, useState } from "react";
import { useBets } from "@/lib/bets/store";
import {
  betDate,
  betProfit,
  isMultipla,
  type Bet,
  type BetStatus,
} from "@/lib/bets/types";
import { formatDate, formatSignedBRL } from "@/lib/format";
import { splitMatch } from "@/data/flags";
import { MatchFlags } from "@/components/TeamFlag";

const COLS =
  "minmax(110px,1fr) minmax(200px,2fr) minmax(90px,1fr) minmax(90px,1fr) minmax(90px,1fr) minmax(100px,1fr)";

const HEADERS = ["DIA DO JOGO", "CONFRONTO", "ODD", "STAKE (R$)", "STATUS", "RESULTADO"];

// Alinhamento do CABEÇALHO de cada coluna.
const ALIGN = [
  "justify-center", // DIA
  "justify-center", // CONFRONTO
  "justify-center", // ODD
  "justify-center", // STAKE
  "justify-center", // STATUS
  "justify-end", // RESULTADO
];

const statusTone: Record<BetStatus, string> = {
  pendente: "border-line text-muted",
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

const PAGE_SIZE = 4;

export function HistoryTable({ onEdit }: { onEdit: (bet: Bet) => void }) {
  const { bets, hydrated } = useBets();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      // Ordem de chegada: o store guarda a mais recente no início (prepend),
      // então invertemos para a primeira aposta registrada aparecer primeiro.
      bets
        .filter((b) =>
          b.legs
            .map((l) => `${l.match} ${l.date}`)
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
        .reverse(),
    [bets, query],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages); // clampa se a lista encolher
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function exportCsv() {
    const header = ["Data", "Tipo", "Confrontos", "Odd", "Stake", "Status", "Resultado"];
    const lines = bets.map((b) =>
      [
        betDate(b),
        isMultipla(b) ? "Múltipla" : "Simples",
        b.legs.map((l) => l.match).join(" + "),
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
    <section className="overflow-hidden rounded-[6px] border border-line bg-[#1a1c1c]">
      {/* Card header */}
      <div className="flex flex-col gap-4 border-b border-line p-5 lg:flex-row lg:items-center lg:justify-between">
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por seleção..."
              className="w-full rounded-[5px] border border-line bg-bg py-2.5 pl-9 pr-3 font-mono text-[13px] text-fg outline-none placeholder:text-muted-2 focus:border-muted"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={bets.length === 0}
            className="flex shrink-0 items-center gap-2 rounded-[5px] border border-line bg-surface-2 px-3.5 py-2.5 font-mono text-[13px] text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <DownloadIcon /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#0c0f0f]">
        <div className="min-w-[860px]">
          {/* Head */}
          <div
            className="grid items-stretch divide-x divide-line border-b border-line bg-[#1e2020]"
            style={{ gridTemplateColumns: COLS }}
          >
            {HEADERS.map((h, i) => (
              <div key={h} className={`flex items-center px-4 py-3.5 ${ALIGN[i]}`}>
                <span className="font-mono text-[11px] tracking-[1px] text-muted-2">
                  {h}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {pageRows.map((b) => {
            const profit = betProfit(b);
            return (
              <div
                key={b.id}
                onClick={() => onEdit(b)}
                title="Editar aposta"
                className="grid cursor-pointer items-stretch divide-x divide-line border-b border-line transition-colors last:border-b-0 hover:bg-surface-2/30"
                style={{ gridTemplateColumns: COLS }}
              >
                <Cell align="justify-center">
                  <span className="font-mono text-[13px] text-muted">
                    {formatDate(betDate(b))}
                  </span>
                </Cell>

                <Cell align="justify-center">
                  <div className="min-w-0">
                    {isMultipla(b) && (
                      <span className="mb-1.5 inline-block rounded-[4px] border border-lavender/45 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.5px] text-lavender">
                        MÚLTIPLA · {b.legs.length} JOGOS
                      </span>
                    )}
                    <div className="space-y-1">
                      {b.legs.map((l) => (
                        <div
                          key={`${l.date}-${l.match}`}
                          className="flex items-center gap-2.5"
                        >
                          <MatchFlags home={splitMatch(l.match)[0]} away={splitMatch(l.match)[1]} />
                          <span className="truncate text-[14px] font-semibold text-fg">
                            {l.match}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Cell>

                <Cell align="justify-center">
                  <span className="font-mono text-[13px] font-medium text-yellow">
                    {b.odds.toFixed(2)}
                  </span>
                </Cell>

                <Cell align="justify-center">
                  <span className="font-mono text-[13px] text-fg">
                    {b.stake.toFixed(2)}
                  </span>
                </Cell>

                <Cell align="justify-center">
                  <span className={`inline-block rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.5px] ${statusTone[b.status]}`}>
                    {statusLabel[b.status]}
                  </span>
                </Cell>

                <Cell align="justify-end">
                  <span className={`font-mono text-[13px] font-medium ${resultTone[b.status]}`}>
                    {b.status === "pendente" ? "---" : formatSignedBRL(profit)}
                  </span>
                </Cell>
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

      {/* Paginação */}
      {rows.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[12px] tracking-[0.5px] text-muted-2">
            PÁGINA {current} DE {totalPages} ({rows.length}{" "}
            {rows.length === 1 ? "REGISTRO" : "REGISTROS"})
          </span>
          <div className="flex items-center gap-1.5">
            <PageBtn disabled={current === 1} onClick={() => setPage(current - 1)}>
              Anterior
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn key={p} active={p === current} onClick={() => setPage(p)}>
                {p}
              </PageBtn>
            ))}
            <PageBtn
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
            >
              Próximo
            </PageBtn>
          </div>
        </div>
      )}
    </section>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[34px] rounded-[5px] border px-3 py-1.5 font-mono text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-green bg-green/15 text-green"
          : "border-line bg-surface-2 text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Cell({
  align = "justify-start",
  children,
}: {
  align?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-center px-4 py-4 ${align}`}>{children}</div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[4px] border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.5px] text-muted-2">
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
