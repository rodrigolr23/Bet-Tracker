"use client";

import { useEffect, useMemo, useState } from "react";
import { days, matches, type Match, type OddKey } from "@/data/matches";
import type { Bet, BetInput, BetStatus } from "@/lib/bets/types";

const STATUS_OPTIONS: { value: BetStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
];

const ODD_KEYS: { key: OddKey; label: string }[] = [
  { key: "home", label: "1" },
  { key: "draw", label: "X" },
  { key: "away", label: "2" },
];

export function BetFormModal({
  editing,
  onClose,
  onSubmit,
}: {
  editing: Bet | null;
  onClose: () => void;
  onSubmit: (input: BetInput) => void;
}) {
  const [dayKey, setDayKey] = useState<string>(
    editing?.dayKey ?? days[0].key,
  );
  const [matchId, setMatchId] = useState<string>(editing?.matchId ?? "");
  const [odds, setOdds] = useState<string>(
    editing ? String(editing.odds) : "",
  );
  const [stake, setStake] = useState<string>(
    editing ? String(editing.stake) : "",
  );
  const [status, setStatus] = useState<BetStatus>(
    editing?.status ?? "pendente",
  );
  const [error, setError] = useState("");

  const dayMatches = useMemo(
    () => matches.filter((m) => m.day === dayKey),
    [dayKey],
  );
  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === matchId) ?? null,
    [matchId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function pickDay(key: string) {
    setDayKey(key);
    // Limpa a seleção de confronto se ele não pertence ao novo dia.
    if (!matches.some((m) => m.id === matchId && m.day === key)) {
      setMatchId("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const oddsNum = Number(odds.replace(",", "."));
    const stakeNum = Number(stake.replace(",", "."));

    if (!selectedMatch) return setError("Selecione o confronto.");
    if (!(oddsNum > 1)) return setError("Odds deve ser maior que 1.");
    if (!(stakeNum > 0)) return setError("Stake deve ser maior que zero.");

    const day = days.find((d) => d.key === selectedMatch.day);
    onSubmit({
      dayKey: selectedMatch.day,
      dayLabel: day?.label ?? selectedMatch.day,
      matchId: selectedMatch.id,
      home: selectedMatch.home,
      away: selectedMatch.away,
      stadium: selectedMatch.stadium,
      time: selectedMatch.time ?? selectedMatch.minute ?? "",
      odds: oddsNum,
      stake: stakeNum,
      status,
    });
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="animate-pop-in w-full max-w-[560px] rounded-[8px] border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-mono text-[15px] font-bold tracking-[1px] text-fg">
            {editing ? "EDITAR APOSTA" : "NOVA APOSTA"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[5px] p-1 text-muted-2 transition-colors hover:text-fg"
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Dia */}
          <div>
            <Label>Dia do jogo</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => {
                const active = d.key === dayKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => pickDay(d.key)}
                    className={`rounded-[6px] border px-3.5 py-2 font-mono text-[12px] font-bold tracking-[0.5px] transition-colors ${
                      active
                        ? "border-yellow bg-yellow text-bg"
                        : "border-border text-muted hover:border-muted hover:text-fg"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confronto */}
          <div>
            <Label>Confronto</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {dayMatches.map((m) => (
                <MatchOption
                  key={m.id}
                  match={m}
                  selected={m.id === matchId}
                  onSelect={() => {
                    setMatchId(m.id);
                    if (!odds) setOdds(String(m.odds.home));
                  }}
                />
              ))}
              {dayMatches.length === 0 && (
                <div className="col-span-full rounded-[6px] border border-dashed border-border px-3 py-4 text-center font-mono text-[12px] text-muted-2">
                  Sem jogos cadastrados neste dia.
                </div>
              )}
            </div>
          </div>

          {/* Odd + Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Odd</Label>
              <input
                inputMode="decimal"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="1.90"
                className={inputCls}
              />
              {selectedMatch && (
                <div className="mt-2 flex gap-1.5">
                  {ODD_KEYS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setOdds(String(selectedMatch.odds[key]))}
                      className="flex-1 rounded-[5px] border border-border bg-surface-2 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-muted hover:text-fg"
                      title={`Usar odd ${label}`}
                    >
                      {label} · {selectedMatch.odds[key].toFixed(2)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Stake (R$)</Label>
              <input
                inputMode="decimal"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="100"
                className={inputCls}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((o) => {
                const active = o.value === status;
                const tone =
                  o.value === "green"
                    ? "border-green bg-green/15 text-green"
                    : o.value === "red"
                      ? "border-red bg-red/15 text-red"
                      : "border-muted bg-surface-2 text-fg";
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setStatus(o.value)}
                    className={`flex-1 rounded-[6px] border py-2 font-mono text-[12px] font-bold tracking-[0.5px] transition-colors ${
                      active
                        ? tone
                        : "border-border text-muted hover:border-muted hover:text-fg"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="px-5 pb-1 font-mono text-[12px] text-red">{error}</div>
        )}

        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[5px] border border-border bg-surface-2 px-4 py-2.5 font-mono text-[13px] text-muted transition-colors hover:text-fg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-[5px] bg-green-bright px-4 py-2.5 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90"
          >
            {editing ? "Salvar" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MatchOption({
  match,
  selected,
  onSelect,
}: {
  match: Match;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between gap-3 rounded-[6px] border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-green bg-green/10"
          : "border-border bg-surface-2 hover:border-muted"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex -space-x-1.5">
          <Flag bg={match.home.flag} />
          <Flag bg={match.away.flag} />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-fg">
            {match.home.code} <span className="text-muted-2">vs</span>{" "}
            {match.away.code}
          </div>
          <div className="font-mono text-[10px] tracking-[0.5px] text-muted-2">
            {match.status === "live"
              ? `AO VIVO ${match.minute ?? ""}`
              : match.time}{" "}
            · {match.stadium}
          </div>
        </div>
      </div>
      {selected && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="2.5">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </button>
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

const inputCls =
  "w-full rounded-[5px] border border-border bg-bg px-3 py-2.5 font-mono text-[13px] text-fg outline-none placeholder:text-muted-2 focus:border-muted [color-scheme:dark]";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[11px] uppercase tracking-[1px] text-muted-2">
      {children}
    </div>
  );
}
