'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPANY_INFO } from '../config/company';
import { LogoIcon } from './logo-icon';
import { FOOTER_NAV_GROUPS } from '../config/navigation';
import { Section } from './section';

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/cabinet')) return null;

  return (
    <footer className="border-t border-black/20 bg-[var(--color-surface-muted)]">
      <Section>
        <div className="py-16">
          <div className="flex flex-wrap justify-between gap-12">
            <div className="max-w-xs">
              <Link href="/" className="mb-4 flex items-center gap-2.5 text-sm font-semibold">
                <span className="flex size-9 items-center justify-center">
                  <LogoIcon className="size-9" />
                </span>
                <span className="text-base font-bold text-[var(--color-on-surface)]">LumenBridge</span>
              </Link>
              <p className="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                Прозрачные краткосрочные займы для частных лиц и бизнеса в Европе.
              </p>
            </div>

            {FOOTER_NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">{group.title}</p>
                <ul className="space-y-3">
                  {group.items.map((link: { href: string; label: string }) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-secondary)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">Контакты</p>
              <ul className="space-y-3 text-sm text-[var(--color-on-surface-variant)]">
                <li>18 Lower Baggot Street, Dublin 2, Ireland</li>
                <li>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="transition hover:text-[var(--color-secondary)]">
                    {COMPANY_INFO.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="transition hover:text-[var(--color-secondary)]">
                    {COMPANY_INFO.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-black/20 pt-8 text-center text-xs text-[var(--color-on-surface-variant)]">
            <p>&copy; {new Date().getFullYear()} LumenBridge Finance Ltd. Все права защищены.</p>
            <p className="mt-2 leading-5">
              LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством.
              Обработка персональных данных осуществляется в рамках требований GDPR.
            </p>
          </div>
        </div>
      </Section>
    </footer>
  );
}
