export type BetStatus = "pendente" | "green" | "red";

export type Bet = {
  id: string;
  date: string; // ISO do jogo, ex.: "2026-06-13"
  match: string; // confronto, ex.: "Brasil × Marrocos"
  odds: number;
  stake: number;
  status: BetStatus;
};

export type BetInput = Omit<Bet, "id">;

export type BancaStats = {
  totalApostas: number;
  totalInvestido: number; // soma das stakes
  lucroLiquido: number; // resultado das apostas resolvidas
  roi: number; // lucro / investido resolvido (%)
  winRate: number; // greens / (greens + reds) (%)
  oddsMedia: number;
  pendentes: number;
  stakePendente: number;
  saldoDisponivel: number; // banca inicial + lucro resolvido − stakes pendentes
};

// Lucro de uma única aposta dado seu status.
export function betProfit(bet: Bet): number {
  if (bet.status === "green") return bet.stake * (bet.odds - 1);
  if (bet.status === "red") return -bet.stake;
  return 0;
}

export function computeStats(bets: Bet[], bancaInicial: number): BancaStats {
  const resolvidas = bets.filter((b) => b.status !== "pendente");
  const greens = bets.filter((b) => b.status === "green").length;
  const reds = bets.filter((b) => b.status === "red").length;

  const totalInvestido = bets.reduce((s, b) => s + b.stake, 0);
  const investidoResolvido = resolvidas.reduce((s, b) => s + b.stake, 0);
  const lucroLiquido = bets.reduce((s, b) => s + betProfit(b), 0);
  const stakePendente = bets
    .filter((b) => b.status === "pendente")
    .reduce((s, b) => s + b.stake, 0);

  return {
    totalApostas: bets.length,
    totalInvestido,
    lucroLiquido,
    roi: investidoResolvido > 0 ? (lucroLiquido / investidoResolvido) * 100 : 0,
    winRate: greens + reds > 0 ? (greens / (greens + reds)) * 100 : 0,
    oddsMedia:
      bets.length > 0 ? bets.reduce((s, b) => s + b.odds, 0) / bets.length : 0,
    pendentes: bets.filter((b) => b.status === "pendente").length,
    stakePendente,
    saldoDisponivel: bancaInicial + lucroLiquido - stakePendente,
  };
}
