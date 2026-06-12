const brl = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// "1450" -> "R$ 1.450,00"
export function formatBRL(value: number): string {
  return `R$ ${brl.format(value)}`;
}

// Valor com sinal explícito: "+ R$ 425,00" / "- R$ 150,00"
export function formatSignedBRL(value: number): string {
  const sign = value > 0 ? "+ " : value < 0 ? "- " : "";
  return `${sign}R$ ${brl.format(Math.abs(value))}`;
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

// Data de hoje no formato ISO local (yyyy-mm-dd).
export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// O jogo já passou? (data anterior a hoje — hoje ainda é apostável)
export function isPastDate(iso: string): boolean {
  return iso < todayISO();
}

// "2026-06-12" -> "12 Jun, 2026"
export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${String(d).padStart(2, "0")} ${meses[m - 1]}, ${y}`;
}
