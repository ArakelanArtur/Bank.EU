'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { adminGetApplications, type AdminApplication, type ApplicationStatus } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';

const STATUS_TABS: { label: string; value: ApplicationStatus | undefined }[] = [
  { label: 'Все', value: undefined },
  { label: 'Новые', value: 'NEW' },
  { label: 'В работе', value: 'IN_REVIEW' },
  { label: 'Одобренные', value: 'APPROVED' },
  { label: 'Отклонённые', value: 'REJECTED' },
];

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; border: string; bar: string }> = {
  NEW: { label: 'Новая', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-500', bar: 'bg-blue-500' },
  IN_REVIEW: { label: 'В работе', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500', bar: 'bg-amber-500' },
  APPROVED: { label: 'Одобрена', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-l-emerald-500', bar: 'bg-emerald-500' },
  REJECTED: { label: 'Отклонена', bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500', bar: 'bg-red-500' },
};

function ApplicationCard({ app }: { app: AdminApplication }) {
  const s = STATUS_STYLES[app.status] || { label: app.status, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-l-slate-300', bar: 'bg-slate-400' };
  const progress = app.status === 'NEW' ? 15 : app.status === 'IN_REVIEW' ? 55 : app.status === 'APPROVED' ? 100 : 100;

  return (
    <Link
      href={`/admin/applications/${app.id}`}
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-xl border border-black/20 bg-white p-6 transition-all hover:shadow-md',
        s.border,
      )}
      style={{ borderLeftWidth: '6px' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">{app.applicationNumber}</p>
          <h3 className="mt-0.5 text-lg font-bold text-[var(--color-on-surface)]">{app.user?.fullName || app.phone}</h3>
        </div>
        <span className={cn('rounded px-3 py-1 text-xs font-bold uppercase tracking-wider', s.bg, s.text)}>
          {s.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-[var(--color-surface-container-low)] py-3">
        <div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Сумма</p>
          <p className="text-sm font-bold text-[var(--color-on-surface)]">€{Number(app.amount)?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Срок</p>
          <p className="text-sm font-bold text-[var(--color-on-surface)]">{app.termDays} дн.</p>
        </div>
      </div>

      {app.status !== 'REJECTED' && app.status !== 'APPROVED' && (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-[var(--color-on-surface-variant)]">Прогресс проверки</span>
            <span className="font-bold text-[var(--color-on-surface)]">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
            <div className={cn('h-full rounded-full transition-all', s.bar)} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-on-surface-variant)]">
          {new Date(app.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-secondary)] hover:underline">
          Подробнее <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export default function AdminApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-applications', statusFilter],
    queryFn: () => adminGetApplications(statusFilter),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Заявки</h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Управление заявками на кредит</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              statusFilter === tab.value
                ? 'bg-[var(--color-secondary)] text-white'
                : 'border border-black/20 bg-white text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Ошибка загрузки заявок
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <FileText className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            {statusFilter ? 'Нет заявок с таким статусом' : 'Заявок пока нет'}
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <>
          <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>

          <div className="rounded-xl bg-[var(--color-primary-container)] p-6 text-white">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold">Liquidity Pulse</h4>
                <p className="mt-1 text-sm opacity-80">
                  Обработано €{(data.reduce((sum, a) => sum + Number(a.amount || 0), 0) / 1000).toFixed(0)}K из цели
                </p>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex h-24 items-end gap-1.5">
                  <div className="w-4 rounded-t-sm bg-white/30" style={{ height: '30%' }} />
                  <div className="w-4 rounded-t-sm bg-white/40" style={{ height: '50%' }} />
                  <div className="w-4 rounded-t-sm bg-white/50" style={{ height: '65%' }} />
                  <div className="w-4 rounded-t-sm bg-white" style={{ height: '85%' }} />
                  <div className="w-4 rounded-t-sm bg-white/35" style={{ height: '45%' }} />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold leading-none">
                    {data.length > 0 ? Math.round((data.filter((a) => a.status === 'APPROVED').length / data.length) * 100) : 0}%
                  </p>
                  <p className="mt-1 text-xs font-medium opacity-60">ОДОБРЕНИЙ</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
