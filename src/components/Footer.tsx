const links = [
  "Termos Analíticos",
  "Metodologia",
  "Apoio Estratégico",
  "Configurações",
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border-soft bg-[#0c0f0f] px-6 py-12 text-center md:px-8">
      <div className="mb-5 text-lg font-bold text-green">MundialBet PRO</div>
      <div className="mb-6 flex flex-wrap justify-center gap-x-9 gap-y-3 font-mono text-[12px] uppercase tracking-[1px] text-muted">
        {links.map((link) => (
          <a key={link} href="#" className="transition-colors hover:text-fg">
            {link}
          </a>
        ))}
      </div>
      <div className="font-mono text-[12px] italic text-muted-2">
        A análise de dados não garante lucros. Jogue com responsabilidade técnica.
      </div>
    </footer>
  );
}
