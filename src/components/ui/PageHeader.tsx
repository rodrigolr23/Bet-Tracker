import type { ReactNode } from "react";

export function PageHeader({
  breadcrumb,
  title,
  description,
  right,
}: {
  breadcrumb: string;
  title: string;
  description: string;
  right?: ReactNode;
}) {
  return (
    <section className="border-b border-border-soft">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-10 md:flex-row md:items-start md:justify-between md:px-10 md:py-11">
        <div>
          <div className="mb-4 font-mono text-xs uppercase tracking-[2px] text-muted-2">
            {breadcrumb}
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="max-w-[460px] text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        </div>
        {right ? <div className="flex shrink-0 gap-4">{right}</div> : null}
      </div>
    </section>
  );
}
