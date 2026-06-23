'use client';

import { type ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, CreditCard, Bell, LogOut, Menu, X, Plus, Building2 } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';
import { Button } from './button';

const SIDEBAR_ITEMS = [
  { href: '/cabinet/applications', label: 'Заявки', icon: FileText },
  { href: '/cabinet/loans', label: 'Мои займы', icon: CreditCard },
  { href: '/cabinet/notifications', label: 'Уведомления', icon: Bell },
];

export function CabinetLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && pathname !== '/cabinet/login' && pathname !== '/login') {
      router.replace('/cabinet/login');
    }
  }, [isAuthLoading, isAuthenticated, pathname, router]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/cabinet/login' && pathname !== '/login') {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-black/20 bg-white pt-20 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-1 flex-col gap-1 p-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition border-l-2 ${
                  isActive
                    ? 'border-[var(--color-secondary)] bg-[var(--color-surface-muted)] text-[var(--color-secondary)]'
                    : 'border-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]'
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-black/20 p-4">
          <Link href="/cabinet/new-application" onClick={() => setSidebarOpen(false)}>
            <Button className="w-full gap-2">
              <Plus className="size-4" />
              Новая заявка
            </Button>
          </Link>
          {user && (
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-[var(--color-surface-container-low)] p-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-secondary)] text-sm font-semibold text-white">
                {user.fullName?.[0] || user.phone[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-on-surface)]">
                  {user.fullName || user.phone}
                </p>
                <p className="truncate text-xs text-[var(--color-on-surface-variant)]">
                  {user.phone}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/cabinet/login');
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />
            Выйти
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />
            Выйти на главную
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 lg:p-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 flex items-center gap-2 rounded-lg border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-on-surface-variant)] transition hover:bg-[var(--color-surface-container-low)] lg:hidden"
        >
          <Menu className="size-4" />
          Меню
        </button>
        {children}
      </main>
    </div>
  );
}
