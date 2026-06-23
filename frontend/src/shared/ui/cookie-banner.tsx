'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('lbf_cookie_consent');
    if (!accepted) {
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('lbf_cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/20 bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-[var(--color-secondary)]" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Мы используем файлы cookie для улучшения работы сайта. Продолжая использование сайта, вы соглашаетесь с{' '}
            <Link href="/cookie-policy" className="text-[var(--color-secondary)] underline hover:no-underline">
              Политикой использования cookie
            </Link>.
          </p>
        </div>
        <Button onClick={accept} className="shrink-0 whitespace-nowrap">
          Принять
        </Button>
      </div>
    </div>
  );
}
