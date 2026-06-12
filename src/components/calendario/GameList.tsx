"use client";

import { useBets } from "@/lib/bets/store";
import { betIncludesGame } from "@/lib/bets/types";
import { cupDays } from "@/data/calendar";
import { splitMatch } from "@/data/flags";
import { MatchFlags } from "@/components/TeamFlag";
import { formatDate } from "@/lib/format";

export function GameList({
  onSelectGame,
}: {
  onSelectGame: (date: string, match: string) => void;
}) {
  const { bets } = useBets();

  return (
    <div className="space-y-6">
      {cupDays.map((day) => (
        <div key={day.date}>
          <div className="mb-2 flex items-center gap-2 font-mono text-[12px] tracking-[1px] text-muted-2">
            <span className="text-green">{day.weekday}</span>
            <span>{formatDate(day.date)}</span>
            <span className="h-px flex-1 bg-border-soft" />
          </div>
          <div className="space-y-2">
            {day.games.map((g) => {
              const apostado = bets.some((b) =>
                betIncludesGame(b, day.date, g),
              );
              const [home, away] = splitMatch(g);
              return (
                <button
                  key={g}
                  onClick={() => onSelectGame(day.date, g)}
                  className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-muted"
                >
                  <span className="flex items-center gap-3">
                    <MatchFlags home={home} away={away} />
                    <span className="text-[14px] font-semibold text-fg">{g}</span>
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.5px] ${
                      apostado
                        ? "border-green/45 text-green"
                        : "border-border text-muted-2"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        apostado ? "bg-green" : "bg-muted-2"
                      }`}
                    />
                    {apostado ? "APOSTADO" : "NÃO APOSTADO"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
