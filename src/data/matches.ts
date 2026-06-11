export type OddKey = "home" | "draw" | "away";

export type Team = {
  code: string;
  flag: string; // CSS background (gradient) — aproximação da bandeira
};

export type Match = {
  id: string;
  day: string; // chave do dia (ver `days`)
  home: Team;
  away: Team;
  stadium: string;
  status: "live" | "upcoming";
  time?: string; // para próximos jogos
  minute?: string; // para ao vivo
  score?: [number, number]; // para ao vivo
  odds: { home: number; draw: number; away: number };
  highlightOdd?: OddKey; // odd em destaque (verde)
};

export const days = [
  { key: "hoje", label: "Hoje, 24 Nov" },
  { key: "seg", label: "Seg, 25 Nov" },
  { key: "ter", label: "Ter, 26 Nov" },
  { key: "qua", label: "Qua, 27 Nov" },
] as const;

const flags = {
  ARG: "linear-gradient(180deg,#75aadb 33%,#fff 33% 66%,#75aadb 66%)",
  MEX: "linear-gradient(90deg,#006847 33%,#fff 33% 66%,#ce1126 66%)",
  BRA: "linear-gradient(135deg,#009b3a,#ffdf00 50%,#002776)",
  FRA: "linear-gradient(90deg,#0055a4 33%,#fff 33% 66%,#ef4135 66%)",
  GER: "linear-gradient(180deg,#000 33%,#dd0000 33% 66%,#ffce00 66%)",
  ESP: "linear-gradient(180deg,#aa151b 33%,#f1bf00 33% 66%,#aa151b 66%)",
  POR: "linear-gradient(90deg,#006600 40%,#ff0000 40%)",
  URU: "linear-gradient(180deg,#7b9ee3,#fff)",
  ENG: "linear-gradient(135deg,#fff,#cf142b)",
  USA: "linear-gradient(180deg,#b22234,#fff,#3c3b6e)",
  NED: "linear-gradient(180deg,#ae1c28 33%,#fff 33% 66%,#21468b 66%)",
  CRO: "linear-gradient(180deg,#ff0000,#fff,#171796)",
  BEL: "linear-gradient(90deg,#000 33%,#fae042 33% 66%,#ed2939 66%)",
  KOR: "linear-gradient(135deg,#fff,#cd2e3a 50%,#0047a0)",
};

export const matches: Match[] = [
  {
    id: "arg-mex",
    day: "hoje",
    home: { code: "ARG", flag: flags.ARG },
    away: { code: "MEX", flag: flags.MEX },
    stadium: "ESTÁDIO 974",
    status: "live",
    minute: "72'",
    score: [2, 1],
    odds: { home: 1.45, draw: 4.2, away: 8.5 },
    highlightOdd: "home",
  },
  {
    id: "bra-fra",
    day: "hoje",
    home: { code: "BRA", flag: flags.BRA },
    away: { code: "FRA", flag: flags.FRA },
    stadium: "ESTÁDIO LUSAIL",
    status: "upcoming",
    time: "16:00",
    odds: { home: 2.1, draw: 3.4, away: 2.85 },
  },
  {
    id: "ger-esp",
    day: "hoje",
    home: { code: "GER", flag: flags.GER },
    away: { code: "ESP", flag: flags.ESP },
    stadium: "ESTÁDIO AL BAYT",
    status: "upcoming",
    time: "20:00",
    odds: { home: 2.45, draw: 3.1, away: 2.6 },
  },
  {
    id: "por-uru",
    day: "seg",
    home: { code: "POR", flag: flags.POR },
    away: { code: "URU", flag: flags.URU },
    stadium: "ESTÁDIO LUSAIL",
    status: "upcoming",
    time: "13:00",
    odds: { home: 1.7, draw: 3.6, away: 4.8 },
  },
  {
    id: "eng-usa",
    day: "seg",
    home: { code: "ENG", flag: flags.ENG },
    away: { code: "USA", flag: flags.USA },
    stadium: "ESTÁDIO AL BAYT",
    status: "upcoming",
    time: "16:00",
    odds: { home: 1.55, draw: 3.8, away: 6.0 },
  },
  {
    id: "ned-cro",
    day: "ter",
    home: { code: "NED", flag: flags.NED },
    away: { code: "CRO", flag: flags.CRO },
    stadium: "ESTÁDIO 974",
    status: "upcoming",
    time: "10:00",
    odds: { home: 1.95, draw: 3.3, away: 4.1 },
  },
  {
    id: "bel-kor",
    day: "ter",
    home: { code: "BEL", flag: flags.BEL },
    away: { code: "KOR", flag: flags.KOR },
    stadium: "ESTÁDIO LUSAIL",
    status: "upcoming",
    time: "16:00",
    odds: { home: 1.5, draw: 4.2, away: 6.5 },
  },
  {
    id: "bra-por",
    day: "qua",
    home: { code: "BRA", flag: flags.BRA },
    away: { code: "POR", flag: flags.POR },
    stadium: "ESTÁDIO AL BAYT",
    status: "upcoming",
    time: "16:00",
    odds: { home: 2.2, draw: 3.3, away: 3.0 },
  },
];
