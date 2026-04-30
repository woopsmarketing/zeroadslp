import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-5 sm:px-8 md:px-12 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-accent-soft px-3.5 py-1.5 text-xs font-bold tracking-tight text-accent-deep">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
