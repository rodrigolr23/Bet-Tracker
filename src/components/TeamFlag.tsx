import { flagUrl } from "@/data/flags";

export function TeamFlag({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const url = flagUrl(name);
  const box = { width: size, height: size };

  if (!url) {
    return (
      <span
        title={name}
        style={box}
        className="grid shrink-0 place-items-center rounded-full border border-bg bg-surface-2 font-mono text-[9px] text-muted-2 ring-1 ring-white/10"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    // Miniaturas decorativas; next/image é desnecessário aqui.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      title={name}
      style={box}
      className="shrink-0 rounded-full border border-bg object-cover ring-1 ring-white/10"
    />
  );
}

export function MatchFlags({ home, away }: { home: string; away: string }) {
  return (
    <div className="flex -space-x-1.5">
      <TeamFlag name={home} />
      <TeamFlag name={away} />
    </div>
  );
}
