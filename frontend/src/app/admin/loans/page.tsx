'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CreditCard, ArrowRight } from 'lucide-react';
import { adminGetLoans, type AdminLoan, type LoanStatus } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';

const STATUS_TABS: { label: string; value: LoanStatus | undefined }[] = [
  { label: 'Все', value: undefined },
  { label: 'Ожидают подписания', value: 'PENDING_SIGNATURE' },
  { label: 'Активные', value: 'ACTIVE' },
  { label: 'Просроченные', value: 'OVERDUE' },
  { label: 'Закрытые', value: 'CLOSED' },
  { label: 'Отклонённые', value: 'REJECTED' },
];

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  PENDING_SIGNATURE: { label: 'Ожидает подписания', bg: 'bg-amber-50', text: 'text-amber-700' },
  ACTIVE: { label: 'Активен', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  OVERDUE: { label: 'Просрочен', bg: 'bg-red-50', text: 'text-red-700' },
  CLOSED: { label: 'Закрыт', bg: 'bg-slate-50', text: 'text-slate-700' },
  REJECTED: { label: 'Отклонён', bg: 'bg-red-50', text: 'text-red-600' },
};

export default function AdminLoansPage() {
  const [statusFilter, setStatusFilter] = useState<LoanStatus | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-loans', statusFilter],
    queryFn: () => adminGetLoans(statusFilter),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Кредиты</h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Управление выданными кредитами</p>
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
          Ошибка загрузки кредитов
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <CreditCard className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">Кредитов пока нет</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-black/20 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/20 bg-[var(--color-surface-container-low)]">
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Номер</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Клиент</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Сумма</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Срок</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Платёж</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Статус</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Создан</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/20">
              {data.map((loan) => {
                const badge = STATUS_BADGES[loan.status] || { label: loan.status, bg: 'bg-slate-50', text: 'text-slate-700' };
                return (
                  <tr key={loan.id} className="transition hover:bg-[var(--color-surface-container-low)]">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[var(--color-on-surface)]">{loan.loanNumber}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--color-on-surface)]">{loan.user?.fullName || loan.user?.phone || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">€{Number(loan.principalAmount ?? 0).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--color-on-surface-variant)]">{loan.termDays} дн.</td>
                    <td className="whitespace-nowrap px-5 py-4">€{Number(loan.annuityPayment ?? 0).toFixed(2)}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={cn('rounded-full px-3 py-1 text-xs font-medium', badge.bg, badge.text)}>{badge.label}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(loan.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link href={`/admin/loans/${loan.id}`} className="flex items-center gap-1 text-xs font-medium text-[var(--color-secondary)] hover:underline">
                        Подробнее <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
