"use client";

import { useState } from "react";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { BetFormModal } from "@/components/dashboard/BetFormModal";
import { useBets } from "@/lib/bets/store";
import type { Bet, BetInput } from "@/lib/bets/types";
import { formatBRL, formatPct, formatSignedBRL } from "@/lib/format";

export default function DashboardPage() {
  const { bets, stats, addBet, updateBet } = useBets();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bet | null>(null);

  const greens = bets.filter((b) => b.status === "green").length;
  const reds = bets.filter((b) => b.status === "red").length;
  const roiBar = Math.max(0, Math.min(100, stats.roi));

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(bet: Bet) {
    setEditing(bet);
    setModalOpen(true);
  }

  function handleSubmit(input: BetInput) {
    if (editing) updateBet(editing.id, input);
    else addBet(input);
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight md:text-[32px]">
            Dashboard de Performance
          </h1>
          <p className="mt-1.5 text-[15px] text-muted">
            Painel de controle analítico para gestão profissional de banca.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BancaControl />
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-[6px] bg-green-bright px-4 py-3 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90"
          >
            <PlusIcon /> Novo Registro
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Investimento Total" value={formatBRL(stats.totalInvestido)}>
          <span className="font-mono text-[12px] text-muted">
            {stats.pendentes} pendente{stats.pendentes === 1 ? "" : "s"} ·{" "}
            {formatBRL(stats.stakePendente)}
          </span>
        </Kpi>

        <div className="rounded-[6px] border border-border border-l-2 border-l-yellow bg-surface p-5">
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[1.2px] text-muted">
            Lucro Líquido
          </div>
          <div
            className={`text-[26px] font-bold ${
              stats.lucroLiquido > 0
                ? "text-green"
                : stats.lucroLiquido < 0
                  ? "text-red"
                  : "text-fg"
            }`}
          >
            {formatSignedBRL(stats.lucroLiquido)}
          </div>
          <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-yellow transition-all"
              style={{ width: `${roiBar}%` }}
            />
          </div>
        </div>

        <Kpi
          label="Yield / ROI"
          value={formatPct(stats.roi)}
          valueClass={stats.roi >= 0 ? "text-green" : "text-red"}
        >
          <span className="font-mono text-[12px] text-muted">
            sobre apostas resolvidas
          </span>
        </Kpi>

        <Kpi label="Win Rate" value={formatPct(stats.winRate)}>
          <span className="font-mono text-[12px] text-muted">
            {greens} Wins / {reds} Losses
          </span>
        </Kpi>

        <Kpi
          label="Odds Médias"
          value={stats.oddsMedia.toFixed(2)}
          valueClass="text-lavender"
        >
          <span className="font-mono text-[12px] text-muted">
            {stats.totalApostas} aposta{stats.totalApostas === 1 ? "" : "s"}
          </span>
        </Kpi>
      </div>

      <HistoryTable onEdit={openEdit} />

      {modalOpen && (
        <BetFormModal
          key={editing?.id ?? "new"}
          editing={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function BancaControl() {
  const { bancaInicial, stats, setBancaInicial } = useBets();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function start() {
    setDraft(bancaInicial ? String(bancaInicial) : "");
    setEditing(true);
  }

  function save() {
    setBancaInicial(Number(draft.replace(",", ".")) || 0);
    setEditing(false);
  }

  return (
    <div className="flex items-stretch divide-x divide-border rounded-[6px] border border-border bg-surface">
      <div className="px-4 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[1px] text-muted-2">
          Banca Inicial
        </div>
        {editing ? (
          <div className="mt-0.5 flex items-center gap-1.5">
            <input
              autoFocus
              inputMode="decimal"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
              placeholder="0"
              className="w-24 rounded-[4px] border border-border bg-bg px-2 py-1 font-mono text-[14px] text-fg outline-none focus:border-muted"
            />
            <button
              onClick={save}
              className="font-mono text-[12px] font-bold text-green hover:opacity-80"
              title="Salvar banca"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={start}
            className="flex items-center gap-1.5 font-mono text-[15px] font-bold text-fg hover:text-muted"
            title="Definir banca inicial"
          >
            {formatBRL(bancaInicial)}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-2">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
        )}
      </div>
      <div className="px-4 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[1px] text-muted-2">
          Saldo Disponível
        </div>
        <div
          className={`font-mono text-[15px] font-bold ${
            stats.saldoDisponivel >= bancaInicial ? "text-green" : "text-red"
          }`}
        >
          {formatBRL(stats.saldoDisponivel)}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  valueClass = "text-fg",
  children,
}: {
  label: string;
  value: string;
  valueClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[6px] border border-border bg-surface p-5">
      <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[1.2px] text-muted">
        {label}
      </div>
      <div className={`text-[26px] font-bold ${valueClass}`}>{value}</div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
