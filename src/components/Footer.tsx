const links = [
  "Termos de Uso",
  "Privacidade",
  "Jogo Responsável",
  "Suporte",
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft px-5 py-11 text-center md:px-10">
      <div className="mb-5 text-[22px] font-black text-green-bright">
        MundialBet
      </div>
      <div className="mb-5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted">
        {links.map((link) => (
          <a key={link} href="#" className="transition-colors hover:text-fg">
            {link}
          </a>
        ))}
      </div>
      <div className="font-mono text-xs text-muted-2">
        © {new Date().getFullYear()} MundialBet Dashboard. Jogue com
        responsabilidade.
      </div>
    </footer>
  );
}
