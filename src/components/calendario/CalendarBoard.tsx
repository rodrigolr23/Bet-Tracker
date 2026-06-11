"use client";

import { useMemo, useState } from "react";
import { june2026, weekdays, monthNames } from "@/data/calendar";

const tabs = ["Apostas", "Lista de Jogos", "Calendário"];

export function CalendarBoard() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // junho (0-indexed)
  const [selected, setSelected] = useState<number | null>(11);

  const { cells, isCup } = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < first; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return { cells: arr, isCup: year === 2026 && month === 5 };
  }, [year, month]);

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
    setSelected(null);
  };

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 md:px-8">
      {/* Tabs */}
      <div className="mb-5 flex gap-6 border-b border-border-soft">
        {tabs.map((t) => {
          const active = t === "Calendário";
          return (
            <button
              key={t}
              className={`-mb-px border-b-2 pb-3 font-mono text-[13px] transition-colors ${
                active
                  ? "border-green text-fg"
                  : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Calendar card */}
      <div
        className="overflow-hidden rounded-[8px] border"
        style={{
          borderColor: "rgba(95,211,138,0.18)",
          background: "linear-gradient(160deg,#0c1c13,#0a130d 70%)",
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(95,211,138,0.04)", borderBottom: "1px solid rgba(95,211,138,0.12)" }}
        >
          <div className="flex items-center gap-2.5">
            <CalIcon />
            <span className="font-mono text-[15px] font-bold tracking-[1px] text-fg">
              DA COPA 2026
            </span>
            <span className="grid h-4 w-4 place-items-center rounded-full border border-green/40 font-mono text-[9px] text-green">
              i
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="Mês anterior"
              className="grid h-7 w-7 place-items-center rounded-[5px] text-muted transition-colors hover:bg-green/10 hover:text-fg"
            >
              <Chevron dir="left" />
            </button>
            <span className="min-w-[150px] text-center font-mono text-[14px] font-bold tracking-[1.5px] text-fg">
              {monthNames[month]} DE {year}
            </span>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Próximo mês"
              className="grid h-7 w-7 place-items-center rounded-[5px] text-muted transition-colors hover:bg-green/10 hover:text-fg"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto p-3">
          <div className="min-w-[900px]">
            {/* Weekdays */}
            <div className="grid grid-cols-7">
              {weekdays.map((w) => (
                <div
                  key={w}
                  className="px-3 py-3 font-mono text-[11px] tracking-[1.5px]"
                  style={{ color: "#6f8f7c" }}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                const data = day && isCup ? june2026[day] : undefined;
                const isSelected = day !== null && day === selected;
                const moreCount = data?.extra ?? 0;
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelected(day)}
                    className={`min-h-[128px] cursor-default p-2 ${day ? "cursor-pointer" : ""}`}
                    style={{
                      borderTop: "1px solid rgba(95,211,138,0.08)",
                      borderLeft: i % 7 !== 0 ? "1px solid rgba(95,211,138,0.08)" : undefined,
                      ...(isSelected
                        ? {
                            boxShadow: "inset 0 0 0 1.5px rgba(95,211,138,0.7)",
                            background: "rgba(95,211,138,0.05)",
                            borderRadius: "6px",
                          }
                        : {}),
                    }}
                  >
                    {day && (
                      <>
                        <div
                          className={`mb-1.5 px-1 font-mono text-[13px] ${
                            isSelected ? "text-green" : "text-fg"
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {data?.games.slice(0, 3).map((g, gi) => (
                            <div
                              key={gi}
                              className="truncate rounded-[3px] px-1.5 py-1 font-mono text-[10px]"
                              style={{ background: "rgba(95,211,138,0.08)", color: "#cfe7d8" }}
                              title={g}
                            >
                              {g}
                            </div>
                          ))}
                          {moreCount > 0 && (
                            <div className="px-1.5 pt-0.5 font-mono text-[10px] text-green/70">
                              + {moreCount} jogos
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
