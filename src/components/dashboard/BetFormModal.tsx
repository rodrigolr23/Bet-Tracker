"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cupDays } from "@/data/calendar";
import { splitMatch } from "@/data/flags";
import { MatchFlags } from "@/components/TeamFlag";
import type { Bet, BetInput, BetLeg, BetStatus } from "@/lib/bets/types";
import { formatDate, isPastDate } from "@/lib/format";

const firstOpenDate =
  cupDays.find((d) => !isPastDate(d.date))?.date ?? cupDays[0]?.date ?? "";

const STATUS_OPTIONS: { value: BetStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
];

export function BetFormModal({
  editing,
  initialLegs,
  onClose,
  onSubmit,
  onDelete,
}: {
  editing: Bet | null;
  initialLegs?: BetLeg[];
  onClose: () => void;
  onSubmit: (input: BetInput) => void;
  onDelete?: () => void;
}) {
  const [date, setDate] = useState<string>(
    editing?.legs[0]?.date ?? initialLegs?.[0]?.date ?? firstOpenDate,
  );
  const [legs, setLegs] = useState<BetLeg[]>(
    editing?.legs ?? initialLegs ?? [],
  );
  const [odds, setOdds] = useState<string>(editing ? String(editing.odds) : "");
  const [stake, setStake] = useState<string>(
    editing ? String(editing.stake) : "",
  );
  const [status, setStatus] = useState<BetStatus>(editing?.status ?? "pendente");
  const [error, setError] = useState("");

  const stripRef = useRef<HTMLDivElement>(null);

  const selectedDay = useMemo(
    () => cupDays.find((d) => d.date === date) ?? null,
    [date],
  );
  const dayPast = isPastDate(date);
  const isMultipla = legs.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleGame(legDate: string, match: string) {
    setLegs((prev) => {
      const exists = prev.some(
        (l) => l.date === legDate && l.match === match,
      );
      return exists
        ? prev.filter((l) => !(l.date === legDate && l.match === match))
        : [...prev, { date: legDate, match }];
    });
  }

  function removeLeg(legDate: string, match: string) {
    setLegs((prev) =>
      prev.filter((l) => !(l.date === legDate && l.match === match)),
    );
  }

  function isSelected(legDate: string, match: string) {
    return legs.some((l) => l.date === legDate && l.match === match);
  }

  function scrollStrip(dir: -1 | 1) {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const oddsNum = Number(odds.replace(",", "."));
    const stakeNum = Number(stake.replace(",", "."));

    if (legs.length === 0) return setError("Selecione ao menos um confronto.");
    if (!(oddsNum > 1)) return setError("Odds deve ser maior que 1.");
    if (!(stakeNum > 0)) return setError("Stake deve ser maior que zero.");

    // Ordena as legs por data para exibição consistente.
    const ordered = [...legs].sort((a, b) => a.date.localeCompare(b.date));
    onSubmit({ legs: ordered, odds: oddsNum, stake: stakeNum, status });
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
          {/* Faixa de dias */}
          <div>
            <Label>Dia do jogo</Label>
            <div className="flex items-center gap-2">
              <StripArrow dir="left" onClick={() => scrollStrip(-1)} />
              <div
                ref={stripRef}
                className="flex flex-1 gap-2 overflow-x-auto scroll-smooth py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {cupDays.map((d) => {
                  const active = d.date === date;
                  const picks = legs.filter((l) => l.date === d.date).length;
                  const past = isPastDate(d.date);
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setDate(d.date)}
                      className={`relative flex w-[58px] shrink-0 flex-col items-center gap-0.5 rounded-[6px] border py-2 transition-colors ${
                        active
                          ? "border-yellow bg-yellow text-bg"
                          : past
                            ? "border-border text-muted-2 opacity-50"
                            : "border-border text-muted hover:border-muted hover:text-fg"
                      }`}
                    >
                      <span className="font-mono text-[10px] tracking-[1px]">
                        {d.weekday}
                      </span>
                      <span className="font-mono text-[17px] font-bold leading-none">
                        {d.day}
                      </span>
                      {picks > 0 && (
                        <span
                          className={`absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full font-mono text-[9px] font-bold ${
                            active ? "bg-bg text-yellow" : "bg-green text-bg"
                          }`}
                        >
                          {picks}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <StripArrow dir="right" onClick={() => scrollStrip(1)} />
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-muted-2">
              Junho de 2026 · selecione um ou mais jogos
            </div>
          </div>

          {/* Confronto (multi-seleção) */}
          <div>
            <Label>Confrontos</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {!dayPast &&
                selectedDay?.games.map((g) => {
                  const active = isSelected(date, g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGame(date, g)}
                      className={`flex items-center justify-between gap-2 rounded-[6px] border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                        active
                          ? "border-green bg-green/10 text-fg"
                          : "border-border bg-surface-2 text-muted hover:border-muted hover:text-fg"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <MatchFlags home={splitMatch(g)[0]} away={splitMatch(g)[1]} />
                        <span>{g}</span>
                      </span>
                      <Checkbox checked={active} />
                    </button>
                  );
                })}
              {dayPast && (
                <div className="col-span-full rounded-[6px] border border-dashed border-border px-3 py-4 text-center font-mono text-[12px] text-muted-2">
                  Jogos deste dia já encerrados — não é possível apostar.
                </div>
              )}
              {!dayPast && (!selectedDay || selectedDay.games.length === 0) && (
                <div className="col-span-full rounded-[6px] border border-dashed border-border px-3 py-4 text-center font-mono text-[12px] text-muted-2">
                  Sem jogos neste dia.
                </div>
              )}
            </div>
          </div>

          {/* Resumo da seleção */}
          {legs.length > 0 && (
            <div className="rounded-[6px] border border-border bg-surface-2/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[1px] text-muted-2">
                  {isMultipla ? "Múltipla" : "Aposta simples"}
                </span>
                <span className="rounded-[4px] border border-green/40 px-1.5 py-0.5 font-mono text-[10px] text-green">
                  {legs.length} {legs.length === 1 ? "jogo" : "jogos"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {legs
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((l) => (
                    <span
                      key={`${l.date}-${l.match}`}
                      className="flex items-center gap-2 rounded-[5px] border border-border bg-surface px-2 py-1"
                    >
                      <MatchFlags home={splitMatch(l.match)[0]} away={splitMatch(l.match)[1]} />
                      <span className="text-[12px] text-fg">{l.match}</span>
                      <span className="font-mono text-[10px] text-muted-2">
                        {formatDate(l.date)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLeg(l.date, l.match)}
                        className="text-muted-2 transition-colors hover:text-red"
                        aria-label="Remover jogo"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Odd + Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{isMultipla ? "Odd total" : "Odd"}</Label>
              <input
                inputMode="decimal"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder={isMultipla ? "Ex: 4.50" : "1.90"}
                className={inputCls}
              />
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

        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          {editing && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-[5px] border border-border px-4 py-2.5 font-mono text-[13px] text-muted transition-colors hover:border-red/40 hover:text-red"
            >
              Excluir
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
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
        </div>
      </form>
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border ${
        checked ? "border-green bg-green text-bg" : "border-border"
      }`}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </span>
  );
}

function StripArrow({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Dias anteriores" : "Próximos dias"}
      className="grid h-9 w-7 shrink-0 place-items-center rounded-[5px] border border-border text-muted transition-colors hover:border-muted hover:text-fg"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
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
