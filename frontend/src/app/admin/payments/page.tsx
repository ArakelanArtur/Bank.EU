'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { HandCoins, ArrowRight, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { adminGetPaymentRequests, type PaymentRequestStatus } from '@/shared/api/admin';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

const STATUS_TABS: { label: string; value: PaymentRequestStatus | undefined }[] = [
  { label: 'Все', value: undefined },
  { label: 'Ожидают', value: 'PENDING_REVIEW' },
  { label: 'Одобренные', value: 'APPROVED' },
  { label: 'Отклонённые', value: 'REJECTED' },
];

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  PENDING_REVIEW: { label: 'Ожидает', bg: 'bg-amber-50', text: 'text-amber-700' },
  APPROVED: { label: 'Одобрен', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  REJECTED: { label: 'Отклонён', bg: 'bg-red-50', text: 'text-red-700' },
};

function StatBadge({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-black/20 bg-white px-5 py-4', color)}>
      <Icon className="size-8 opacity-60" />
      <div>
        <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">{label}</p>
        <p className="text-lg font-bold text-[var(--color-on-surface)]">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === 'ADMIN';
  const [statusFilter, setStatusFilter] = useState<PaymentRequestStatus | undefined>('PENDING_REVIEW');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payment-requests', statusFilter],
    queryFn: () => adminGetPaymentRequests(statusFilter),
  });

  const allData = useQuery({
    queryKey: ['admin-payment-requests'],
    queryFn: () => adminGetPaymentRequests(),
  });

  const pending = allData.data?.filter((r) => r.status === 'PENDING_REVIEW').length || 0;
  const approved = allData.data?.filter((r) => r.status === 'APPROVED').length || 0;
  const rejected = allData.data?.filter((r) => r.status === 'REJECTED').length || 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Платежи</h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Проверка запросов и запись платежей</p>
        </div>
        {isAdmin && (
          <Link href="/admin/payments/record">
            <Button className="gap-2"><Plus className="size-4" />Записать платёж</Button>
          </Link>
        )}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatBadge icon={Clock} label="Ожидают проверки" value={pending} color="border-l-4 border-l-amber-500" />
        <StatBadge icon={CheckCircle} label="Одобрено" value={approved} color="border-l-4 border-l-emerald-500" />
        <StatBadge icon={AlertTriangle} label="Отклонено" value={rejected} color="border-l-4 border-l-red-500" />
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
          Ошибка загрузки платежей
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <HandCoins className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">Платежных запросов пока нет</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-black/20 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/20 bg-[var(--color-surface-container-low)]">
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Клиент</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Кредит</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Сумма</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Reference</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Статус</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Дата</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/20">
              {data.map((req) => {
                const badge = STATUS_BADGES[req.status] || { label: req.status, bg: 'bg-slate-50', text: 'text-slate-700' };
                return (
                  <tr key={req.id} className="transition hover:bg-[var(--color-surface-container-low)]">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--color-on-surface)]">{req.user?.fullName || req.user?.phone || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--color-on-surface-variant)]">{req.loan?.loanNumber || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold">€{Number(req.amount).toFixed(2)}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-[var(--color-on-surface-variant)]">{req.reference}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={cn('rounded-full px-3 py-1 text-xs font-medium', badge.bg, badge.text)}>{badge.label}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(req.createdAt).toLocaleString('ru-RU')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link href={`/admin/payments/${req.id}`} className="flex items-center gap-1 text-xs font-medium text-[var(--color-secondary)] hover:underline">
                        Проверить <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-black/20 bg-white p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
          <HandCoins className="size-4" />Сводка
        </h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-[var(--color-on-surface-variant)]">Всего запросов: </span>
            <span className="font-bold">{allData.data?.length || 0}</span>
          </div>
          <div>
            <span className="text-[var(--color-on-surface-variant)]">На сумму: </span>
            <span className="font-bold">€{(allData.data || []).reduce((s, r) => s + Number(r.amount), 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[var(--color-on-surface-variant)]">Средний чек: </span>
            <span className="font-bold">
              €{allData.data && allData.data.length > 0
                ? (allData.data.reduce((s, r) => s + Number(r.amount), 0) / allData.data.length).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
