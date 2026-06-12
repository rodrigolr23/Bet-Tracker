// Mapeia o nome da seleção (como aparece em `june2026`) para o código ISO
// usado pelo flagcdn. Subdivisões do Reino Unido usam o formato gb-xxx.
const TEAM_ISO: Record<string, string> = {
  México: "mx",
  "África do Sul": "za",
  "Coreia do Sul": "kr",
  "R. Tcheca": "cz",
  Canadá: "ca",
  Bósnia: "ba",
  EUA: "us",
  Paraguai: "py",
  Catar: "qa",
  Suíça: "ch",
  Brasil: "br",
  Marrocos: "ma",
  Haiti: "ht",
  Escócia: "gb-sct",
  Austrália: "au",
  Turquia: "tr",
  Alemanha: "de",
  Curaçao: "cw",
  Holanda: "nl",
  Japão: "jp",
  Espanha: "es",
  "Cabo Verde": "cv",
  Bélgica: "be",
  Egito: "eg",
  "A. Saudita": "sa",
  Uruguai: "uy",
  França: "fr",
  Senegal: "sn",
  Iraque: "iq",
  Noruega: "no",
  Argentina: "ar",
  Argélia: "dz",
  Áustria: "at",
  Jordânia: "jo",
  Portugal: "pt",
  "Rep. Democr.": "cd",
  Inglaterra: "gb-eng",
  Croácia: "hr",
  Suécia: "se",
  "C. do Marfim": "ci",
  Panamá: "pa",
  Uzbequistão: "uz",
  Gana: "gh",
  Equador: "ec",
  Tunísia: "tn",
};

export function teamIso(name: string): string | null {
  return TEAM_ISO[name.trim()] ?? null;
}

export function flagUrl(name: string): string | null {
  const iso = teamIso(name);
  return iso ? `https://flagcdn.com/w40/${iso}.png` : null;
}

// "Brasil × Marrocos" -> ["Brasil", "Marrocos"]
export function splitMatch(match: string): [string, string] {
  const [home, away] = match.split("×").map((s) => s.trim());
  return [home ?? match, away ?? ""];
}
