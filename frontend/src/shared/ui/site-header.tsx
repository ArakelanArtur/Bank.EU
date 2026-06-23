'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { PUBLIC_NAV_ITEMS } from '../config/navigation';
import { useAuth } from '../lib/auth-context';
import { LogoIcon } from './logo-icon';
import { Button } from './button';
import { Section } from './section';
import { cn } from '../lib/cn';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminOrCabinet = pathname.startsWith('/admin') || pathname.startsWith('/cabinet') || pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAdminOrCabinet) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/20">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-[90px] items-center justify-center">
              <LogoIcon className="size-[90px]" />
            </span>
            <span className="text-xl font-bold text-black">LumenBridge</span>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition',
                    isActive
                      ? 'text-[var(--color-secondary)]'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col gap-1">
              <Link href="/login">
                <Button variant="ghost" size="md" className="w-full text-base font-semibold">Войти</Button>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="size-4" />
                  Выйти
                </button>
              )}
            </div>
            <Link href="/register" className="hidden sm:inline">
              <Button size="md" className="text-base font-semibold">Регистрация</Button>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-lg border border-black/20 bg-white text-[var(--color-on-surface-variant)] transition hover:bg-[var(--color-surface-container-low)] lg:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/20 px-4 py-4">
          <span className="text-lg font-bold text-black">Меню</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
            aria-label="Закрыть меню"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-[var(--color-surface-muted)] text-[var(--color-secondary)]'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/20 p-4">
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full text-base font-semibold">Войти</Button>
          </Link>
          {isAuthenticated && (
            <button
              onClick={() => { logout(); router.push('/'); setMobileOpen(false); }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" />
              Выйти
            </button>
          )}
          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <Button className="mt-2 w-full text-base font-semibold">Регистрация</Button>
          </Link>
        </div>
      </aside>
    </header>
  );
}
