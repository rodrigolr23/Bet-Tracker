export type DayGames = {
  games: string[]; // confrontos visíveis ("Time × Time")
  extra?: number; // jogos adicionais além dos visíveis
};

// Jogos por dia — Junho de 2026 (chave = dia do mês). Dados de exemplo.
export const june2026: Record<number, DayGames> = {
  11: { games: ["México × África do Sul", "Coreia do Sul × R. Tcheca"] },
  12: { games: ["Canadá × Bósnia", "EUA × Paraguai"] },
  13: { games: ["Catar × Suíça", "Brasil × Marrocos", "Haiti × Escócia"] },
  14: { games: ["Austrália × Turquia", "Alemanha × Curaçao", "Holanda × Japão"], extra: 2 },
  15: { games: ["Espanha × Cabo Verde", "Bélgica × Egito", "A. Saudita × Uruguai"], extra: 1 },
  16: { games: ["França × Senegal", "Iraque × Noruega", "Argentina × Argélia"] },
  17: { games: ["Áustria × Jordânia", "Portugal × Rep. Democr.", "Inglaterra × Croácia"], extra: 2 },
  18: { games: ["R. Tcheca × África do Sul", "Suíça × Bósnia", "México × Coreia do Sul"] },
  19: { games: ["EUA × Austrália", "Canadá × Catar", "Alemanha × Marrocos"], extra: 1 },
  20: { games: ["Turquia × Paraguai", "Holanda × Suécia", "Alemanha × C. do Marfim"], extra: 1 },
  21: { games: ["Espanha × A. Saudita", "Bélgica × Panamá", "Uruguai × Cabo Verde"], extra: 2 },
  22: { games: ["Argentina × Áustria", "França × Iraque", "Noruega × Senegal"] },
  23: { games: ["Jordânia × Argélia", "Portugal × Uzbequistão", "Inglaterra × Gana"], extra: 2 },
  24: { games: ["Suíça × Canadá", "Bósnia × Catar", "Marrocos × Brasil"], extra: 3 },
  25: { games: ["Equador × Alemanha", "Curaçao × C. do Marfim", "Tunísia × Holanda"], extra: 3 },
  26: { games: ["Noruega × França", "Senegal × Iraque", "Uruguai × Espanha"], extra: 1 },
  27: { games: ["N. × Bélgica", "Egito × Senegal", "Panamá × Inglaterra"], extra: 5 },
};

export const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const monthNames = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];
