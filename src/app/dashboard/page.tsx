import { HistoryTable } from "@/components/dashboard/HistoryTable";

export default function DashboardPage() {
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
          <div className="flex items-stretch divide-x divide-border rounded-[6px] border border-border bg-surface">
            <ChipStat label="Unidades" value="12.5 u" tone="text-yellow" />
            <ChipStat label="Risco Médio" value="2.4%" tone="text-red" />
          </div>
          <button className="flex items-center gap-2 rounded-[6px] bg-green-bright px-4 py-3 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90">
            <PlusIcon /> Novo Registro
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Investimento Total" value="R$ 1.450,00">
          <span className="flex items-center gap-1 font-mono text-[12px] text-green">
            <ArrowUp /> +12% MoM
          </span>
        </Kpi>

        <div className="rounded-[6px] border border-border border-l-2 border-l-yellow bg-surface p-5">
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[1.2px] text-muted">
            Lucro Líquido
          </div>
          <div className="text-[26px] font-bold text-yellow">+ R$ 842,50</div>
          <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[58%] rounded-full bg-yellow" />
          </div>
        </div>

        <Kpi label="Yield / ROI" value="58.1%" valueClass="text-green">
          <span className="font-mono text-[12px] text-muted">Acima da meta (40%)</span>
        </Kpi>

        <Kpi label="Win Rate" value="62.5%">
          <span className="font-mono text-[12px] text-muted">50 Wins / 30 Losses</span>
        </Kpi>

        <Kpi label="Odds Médias" value="1.92" valueClass="text-lavender">
          <span className="font-mono text-[12px] text-muted">Perfil conservador</span>
        </Kpi>
      </div>

      <HistoryTable />
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

function ChipStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="px-4 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-[1px] text-muted-2">
        {label}
      </div>
      <div className={`font-mono text-[15px] font-bold ${tone}`}>{value}</div>
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

function ArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 19L19 5M9 5h10v10" />
    </svg>
  );
}
