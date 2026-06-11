"use client";

import { useMemo, useState } from "react";
import { days, matches as allMatches, type Match, type OddKey } from "@/data/matches";

const fases = ["Fase de Grupos", "Oitavas", "Quartas", "Semifinais", "Final"];

export function PlanejamentoView() {
  const [activeDay, setActiveDay] = useState<string>("hoje");
  const [view, setView] = useState<"list" | "grid">("list");
  const [showLive, setShowLive] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);

  const visible = useMemo(
    () =>
      allMatches.filter(
        (m) =>
          m.day === activeDay &&
          ((m.status === "live" && showLive) ||
            (m.status === "upcoming" && showUpcoming)),
      ),
    [activeDay, showLive, showUpcoming],
  );

  return (
    <div className="mx-auto grid max-w-[1280px] gap-6 px-5 py-8 md:px-10 lg:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-5">
        <div className="rounded-[6px] border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-2.5 text-[17px] font-bold">
            <FunnelIcon className="text-yellow" />
            Filtros de Dados
          </div>

          <label className="mb-2.5 block text-[13px] text-muted">
            Fase do Torneio
          </label>
          <div className="relative mb-6">
            <select
              defaultValue="Fase de Grupos"
              className="w-full appearance-none rounded-[5px] border border-border bg-surface-2 px-3.5 py-3 text-sm text-fg outline-none focus:border-muted"
            >
              {fases.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <ChevronIcon className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
          </div>

          <div className="mb-2.5 text-[13px] text-muted">Status</div>
          <Checkbox label="Ao Vivo" checked={showLive} onChange={setShowLive} />
          <Checkbox
            label="Próximos Jogos"
            checked={showUpcoming}
            onChange={setShowUpcoming}
          />
        </div>

        <div className="rounded-[6px] border border-border border-l-2 border-l-green bg-surface p-6">
          <div className="mb-4 font-mono text-[15px] font-bold uppercase tracking-[1px] text-green-bright">
            Resumo da Planilha
          </div>
          <div className="flex justify-between py-1.5 text-sm text-muted">
            Apostas Pendentes <span className="font-mono text-fg">04</span>
          </div>
          <div className="flex justify-between py-1.5 text-sm text-muted">
            Valor Planejado{" "}
            <span className="font-mono text-fg">R$ 1.200,00</span>
          </div>
          <button className="mt-4 w-full rounded-[5px] border border-border bg-surface-2 py-3 font-mono text-[13px] font-bold uppercase tracking-[1px] text-green-bright transition-colors hover:border-green/60">
            Exportar Relatório
          </button>
        </div>
      </aside>

      {/* Main */}
      <main>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2.5">
            {days.map((d) => {
              const active = d.key === activeDay;
              return (
                <button
                  key={d.key}
                  onClick={() => setActiveDay(d.key)}
                  className={`rounded-[5px] px-4 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[1px] transition-colors ${
                    active
                      ? "bg-yellow text-[#1a1500]"
                      : "border border-transparent text-muted hover:border-border"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <ViewButton
              active={view === "grid"}
              onClick={() => setView("grid")}
              label="Visualizar em grade"
            >
              <GridIcon />
            </ViewButton>
            <ViewButton
              active={view === "list"}
              onClick={() => setView("list")}
              label="Visualizar em lista"
            >
              <ListIcon />
            </ViewButton>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState />
        ) : view === "list" ? (
          <>
            <div className="hidden grid-cols-[1.4fr_1.3fr_1.6fr_1.2fr] gap-4 px-6 pb-4 md:grid">
              <span className="font-mono text-xs uppercase tracking-[2px] text-muted">
                Partida
              </span>
              <span className="text-center font-mono text-xs uppercase tracking-[2px] text-muted">
                Horário/Local
              </span>
              <span className="text-center font-mono text-xs uppercase tracking-[2px] text-muted">
                Odds Principais
              </span>
              <span className="text-right font-mono text-xs uppercase tracking-[2px] text-muted">
                Ação
              </span>
            </div>
            <div className="space-y-3.5">
              {visible.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Match row (list view) ---------- */
function MatchRow({ match }: { match: Match }) {
  const live = match.status === "live";
  return (
    <div
      className={`grid grid-cols-1 items-center gap-4 rounded-[6px] border bg-row p-5 md:grid-cols-[1.4fr_1.3fr_1.6fr_1.2fr] md:px-6 ${
        live
          ? "border-l-2 border-l-red border-border"
          : "border-border"
      }`}
    >
      <Teams match={match} />
      <When match={match} />
      <Odds match={match} />
      <div className="md:text-right">
        <BetButton live={live} />
      </div>
    </div>
  );
}

/* ---------- Match card (grid view) ---------- */
function MatchCard({ match }: { match: Match }) {
  const live = match.status === "live";
  return (
    <div
      className={`flex flex-col gap-5 rounded-[6px] border bg-row p-5 ${
        live
          ? "border-l-2 border-l-red border-border"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <Teams match={match} />
        <When match={match} align="right" />
      </div>
      <Odds match={match} />
      <BetButton live={live} full />
    </div>
  );
}

/* ---------- Shared pieces ---------- */
function Teams({ match }: { match: Match }) {
  return (
    <div className="flex flex-col gap-3">
      <TeamLine
        team={match.home}
        score={match.score?.[0]}
        win={match.status === "live" && match.highlightOdd === "home"}
      />
      <TeamLine team={match.away} score={match.score?.[1]} />
    </div>
  );
}

function TeamLine({
  team,
  score,
  win,
}: {
  team: Match["home"];
  score?: number;
  win?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-base font-bold">
      <span
        className="h-[26px] w-[26px] shrink-0 rounded-full border border-white/15"
        style={{ background: team.flag }}
      />
      {team.code}
      {score !== undefined && (
        <span
          className={`ml-auto font-mono ${win ? "text-yellow" : "text-fg"}`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

function When({
  match,
  align = "center",
}: {
  match: Match;
  align?: "center" | "right";
}) {
  const live = match.status === "live";
  return (
    <div className={align === "right" ? "text-right" : "md:text-center"}>
      {live ? (
        <div className="font-mono text-sm font-bold text-red">
          AO VIVO {match.minute}
        </div>
      ) : (
        <div className="text-lg font-bold">{match.time}</div>
      )}
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[1px] text-muted">
        {match.stadium}
      </div>
    </div>
  );
}

function Odds({ match }: { match: Match }) {
  const items: { key: OddKey; label: string; value: number }[] = [
    { key: "home", label: "1", value: match.odds.home },
    { key: "draw", label: "X", value: match.odds.draw },
    { key: "away", label: "2", value: match.odds.away },
  ];
  return (
    <div className="flex justify-center gap-2.5">
      {items.map((o) => (
        <button
          key={o.key}
          className="max-w-[92px] flex-1 rounded-[5px] border border-border bg-surface px-1 py-2.5 text-center transition-colors hover:border-muted"
        >
          <div className="mb-1.5 font-mono text-[11px] text-muted-2">
            {o.label}
          </div>
          <div
            className={`text-base font-bold ${
              match.highlightOdd === o.key ? "text-green-bright" : "text-fg"
            }`}
          >
            {o.value.toFixed(2)}
          </div>
        </button>
      ))}
    </div>
  );
}

function BetButton({ live, full }: { live: boolean; full?: boolean }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[1px] transition-colors ${
        full ? "w-full" : ""
      } ${
        live
          ? "bg-yellow text-[#1a1500] hover:brightness-95"
          : "border border-border text-muted hover:border-muted hover:text-fg"
      }`}
    >
      <PlusIcon />
      Registrar Aposta
    </button>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 py-1.5 text-left text-sm"
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-sm border transition-colors ${
          checked
            ? "border-green bg-green text-[#06250f]"
            : "border-border bg-surface-2 text-transparent"
        }`}
      >
        <CheckIcon />
      </span>
      {label}
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-[42px] w-[42px] place-items-center rounded-[5px] border transition-colors ${
        active
          ? "border-yellow bg-surface-2 text-yellow"
          : "border-border bg-surface text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[6px] border border-dashed border-border bg-surface/40 p-12 text-center">
      <div className="font-mono text-sm uppercase tracking-[1.5px] text-muted">
        Nenhum jogo neste filtro
      </div>
      <p className="mt-2 text-sm text-muted-2">
        Ajuste o dia ou os filtros de status.
      </p>
    </div>
  );
}

/* ---------- Icons ---------- */
function FunnelIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 4h18l-7 9v6l-4 2v-8z" />
    </svg>
  );
}
function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
