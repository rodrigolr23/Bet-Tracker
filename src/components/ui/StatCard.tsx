type Tone = "default" | "green" | "yellow" | "red";

const toneClass: Record<Tone, string> = {
  default: "text-fg",
  green: "text-green-bright",
  yellow: "text-yellow",
  red: "text-red",
};

export function StatCard({
  label,
  value,
  tone = "default",
  className = "",
}: {
  label: string;
  value: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[6px] border border-border bg-surface px-5 py-4 ${className}`}
    >
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[1.5px] text-muted">
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${toneClass[tone]}`}>{value}</div>
    </div>
  );
}
