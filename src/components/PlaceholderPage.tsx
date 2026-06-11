export function PlaceholderPage({
  breadcrumb,
  title,
  description,
  pr,
}: {
  breadcrumb: string;
  title: string;
  description: string;
  pr: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-12 md:px-10">
      <div className="mb-4 font-mono text-xs uppercase tracking-[2px] text-muted-2">
        {breadcrumb}
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="max-w-[460px] text-[15px] leading-relaxed text-muted">
        {description}
      </p>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center">
        <div className="font-mono text-sm uppercase tracking-[1.5px] text-yellow">
          Em construção
        </div>
        <p className="mt-3 text-sm text-muted">
          Esta tela será implementada na {pr}.
        </p>
      </div>
    </section>
  );
}
