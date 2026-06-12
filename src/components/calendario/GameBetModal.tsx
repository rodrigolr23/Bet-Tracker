"use client";

import { useEffect } from "react";
import { useBets } from "@/lib/bets/store";
import {
  betIncludesGame,
  betProfit,
  isMultipla,
  type Bet,
  type BetStatus,
} from "@/lib/bets/types";
import { formatDate, formatSignedBRL, isPastDate } from "@/lib/format";
import { splitMatch } from "@/data/flags";
import { MatchFlags } from "@/components/TeamFlag";

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

export function GameBetModal({
  date,
  match,
  onClose,
  onBet,
  onEditBet,
}: {
  date: string;
  match: string;
  onClose: () => void;
  onBet: () => void;
  onEditBet: (bet: Bet) => void;
}) {
  const { bets, setStatus, removeBet } = useBets();
  const related = bets.filter((b) => betIncludesGame(b, date, match));
  const [home, away] = splitMatch(match);
  const past = isPastDate(date);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-pop-in w-full max-w-[520px] rounded-[8px] border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <MatchFlags home={home} away={away} />
            <div>
              <div className="text-[16px] font-bold text-fg">{match}</div>
              <div className="font-mono text-[11px] tracking-[0.5px] text-muted-2">
                {formatDate(date)}
              </div>
            </div>
          </div>
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

        {/* Body */}
        <div className="space-y-3 p-5">
          {related.length === 0 ? (
            <div className="rounded-[6px] border border-dashed border-border px-4 py-8 text-center">
              <div className="font-mono text-[13px] text-muted">
                {past
                  ? "Jogo encerrado — não foi apostado."
                  : "Você ainda não apostou neste jogo."}
              </div>
            </div>
          ) : (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[1px] text-muted-2">
                {related.length === 1
                  ? "Sua aposta neste jogo"
                  : `${related.length} apostas neste jogo`}
              </div>
              {related.map((b) => {
                const profit = betProfit(b);
                return (
                  <div
                    key={b.id}
                    className="rounded-[6px] border border-border bg-surface-2/40 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-[4px] border px-2 py-0.5 font-mono text-[10px] tracking-[0.5px] ${statusTone[b.status]}`}>
                          {statusLabel[b.status]}
                        </span>
                        {isMultipla(b) && (
                          <span className="rounded-[4px] border border-lavender/45 px-2 py-0.5 font-mono text-[10px] tracking-[0.5px] text-lavender">
                            MÚLTIPLA · {b.legs.length}
                          </span>
                        )}
                      </div>
                      <span className={`font-mono text-[13px] font-medium ${resultTone[b.status]}`}>
                        {b.status === "pendente" ? "---" : formatSignedBRL(profit)}
                      </span>
                    </div>

                    {/* Legs da múltipla, se houver mais de uma */}
                    {isMultipla(b) && (
                      <div className="mb-2 space-y-1 border-l border-border pl-2.5">
                        {b.legs.map((l) => (
                          <div
                            key={`${l.date}-${l.match}`}
                            className={`font-mono text-[11px] ${
                              l.match === match ? "text-fg" : "text-muted-2"
                            }`}
                          >
                            {l.match}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-3 font-mono text-[12px] text-muted">
                        <span>
                          Odd <span className="text-yellow">{b.odds.toFixed(2)}</span>
                        </span>
                        <span>
                          Stake <span className="text-fg">R$ {b.stake.toFixed(2)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {b.status !== "green" && (
                          <Mini label="G" tone="green" title="Marcar Green" onClick={() => setStatus(b.id, "green")} />
                        )}
                        {b.status !== "red" && (
                          <Mini label="R" tone="red" title="Marcar Red" onClick={() => setStatus(b.id, "red")} />
                        )}
                        {b.status !== "pendente" && (
                          <Mini label="•" tone="muted" title="Voltar a pendente" onClick={() => setStatus(b.id, "pendente")} />
                        )}
                        <IconBtn title="Editar" onClick={() => onEditBet(b)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                          </svg>
                        </IconBtn>
                        <IconBtn title="Excluir" danger onClick={() => removeBet(b.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                          </svg>
                        </IconBtn>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[5px] border border-border bg-surface-2 px-4 py-2.5 font-mono text-[13px] text-muted transition-colors hover:text-fg"
          >
            Fechar
          </button>
          {past ? (
            <span className="rounded-[5px] border border-border bg-surface-2 px-4 py-2.5 font-mono text-[13px] text-muted-2">
              Jogo encerrado
            </span>
          ) : (
            <button
              type="button"
              onClick={onBet}
              className="rounded-[5px] bg-green-bright px-4 py-2.5 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90"
            >
              {related.length === 0 ? "Apostar neste jogo" : "Nova aposta neste jogo"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({
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
