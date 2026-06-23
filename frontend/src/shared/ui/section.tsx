import { ReactNode } from 'react';
import { cn } from '../lib/cn';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('px-4 sm:px-8 lg:px-12', className)}>
      <div className="mx-auto w-full max-w-[var(--spacing-container-max)]">{children}</div>
    </section>
  );
}
