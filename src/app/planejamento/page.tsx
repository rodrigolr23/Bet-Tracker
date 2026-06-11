import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { PlanejamentoView } from "@/components/planejamento/PlanejamentoView";

export default function PlanejamentoPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Admin › Calendário Oficial"
        title="Gerenciamento de Jogos"
        description="Configure suas apostas e planeje sua estratégia para as próximas rodadas da Copa do Mundo."
        right={
          <>
            <StatCard label="Jogos Hoje" value="12" tone="green" className="min-w-[130px]" />
            <StatCard label="Odds Médias" value="2.45" tone="yellow" className="min-w-[130px]" />
          </>
        }
      />
      <PlanejamentoView />
    </>
  );
}
