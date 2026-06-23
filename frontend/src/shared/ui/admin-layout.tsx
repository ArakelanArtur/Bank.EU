'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, CreditCard, HandCoins, Bell,
  LogOut, Menu, X, Building2, MessagesSquare, Settings,
} from 'lucide-react';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { cn } from '@/shared/lib/cn';
import { Button } from './button';

const SIDEBAR_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Заявки', icon: FileText },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/loans', label: 'Кредиты', icon: CreditCard },
  { href: '/admin/payments', label: 'Платежи', icon: HandCoins },
  { href: '/admin/notifications', label: 'Уведомления', icon: Bell },
  { href: '/admin/contact-requests', label: 'Обращения', icon: MessagesSquare },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading, admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && pathname !== '/admin/login' && pathname !== '/login') {
      router.replace('/admin/login');
    }
  }, [isAuthLoading, isAuthenticated, pathname, router]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-muted)]">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login' && pathname !== '/login') {
    return null;
  }

  if (pathname === '/admin/login' || pathname === '/login') {
    return <>{children}</>;
  }

  const isAdmin = admin?.role === 'ADMIN';
  const roleLabel = isAdmin ? 'Администратор' : 'Оператор';
  const roleBadgeColor = isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-black/20 bg-white pt-20 transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-semibold transition border-l-2',
                  isActive
                    ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]'
                    : 'border-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]',
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/20 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-container-low)] p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-sm font-semibold text-white">
              {admin?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--color-on-surface)]">{admin?.name}</p>
              <span className={cn('inline-block rounded px-2 py-0.5 text-xs font-medium', roleBadgeColor)}>{roleLabel}</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />Выйти
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 lg:p-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 flex items-center gap-2 rounded-lg border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-on-surface-variant)] transition hover:bg-[var(--color-surface-container-low)] lg:hidden"
        >
          <Menu className="size-4" />Меню
        </button>
        {children}
      </main>
    </div>
  );
}
