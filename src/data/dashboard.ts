const flags = {
  ARG: "linear-gradient(180deg,#75aadb 33%,#fff 33% 66%,#75aadb 66%)",
  NED: "linear-gradient(180deg,#ae1c28 33%,#fff 33% 66%,#21468b 66%)",
  BRA: "linear-gradient(135deg,#009b3a,#ffdf00 50%,#002776)",
  CRO: "linear-gradient(180deg,#ff0000,#fff,#171796)",
  GER: "linear-gradient(180deg,#000 33%,#dd0000 33% 66%,#ffce00 66%)",
  JPN: "radial-gradient(circle at 50% 50%, #bc002d 22%, #fff 22%)",
};

export type CasaTone = "amber" | "green" | "lavender";
export type StatusKind = "pendente" | "green" | "red";

export type HistoryRow = {
  id: string;
  date: string;
  home: { code: string; flag: string };
  away: { code: string; flag: string };
  match: string;
  competition: string;
  market: string;
  casa: string;
  casaTone: CasaTone;
  odds: string;
  stake: string;
  status: StatusKind;
  statusLabel: string;
  result: string;
};

export const historyRows: HistoryRow[] = [
  {
    id: "1",
    date: "09 Dez, 2022 16:00",
    home: { code: "ARG", flag: flags.ARG },
    away: { code: "NED", flag: flags.NED },
    match: "Argentina vs Holanda",
    competition: "COPA DO MUNDO",
    market: "Vencedor Final (1×2)",
    casa: "Betano",
    casaTone: "amber",
    odds: "2.10",
    stake: "200,00",
    status: "pendente",
    statusLabel: "PENDENTE",
    result: "---",
  },
  {
    id: "2",
    date: "09 Dez, 2022 12:00",
    home: { code: "BRA", flag: flags.BRA },
    away: { code: "CRO", flag: flags.CRO },
    match: "Brasil vs Croácia",
    competition: "COPA DO MUNDO",
    market: "Over 2.5 Gols",
    casa: "Bet365",
    casaTone: "green",
    odds: "1.85",
    stake: "500,00",
    status: "green",
    statusLabel: "GREEN",
    result: "+ R$ 425,00",
  },
  {
    id: "3",
    date: "23 Nov, 2022 10:00",
    home: { code: "GER", flag: flags.GER },
    away: { code: "JPN", flag: flags.JPN },
    match: "Alemanha vs Japão",
    competition: "FASE DE GRUPOS",
    market: "Alemanha Vence HT",
    casa: "Stake",
    casaTone: "lavender",
    odds: "1.90",
    stake: "150,00",
    status: "red",
    statusLabel: "RED",
    result: "- R$ 150,00",
  },
];
