'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, Ban, Loader2, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { adminGetLoan, adminUpdateLoanStatus, type AdminLoan, type LoanStatus } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

const STATUS_ACTIONS: { status: LoanStatus; label: string; variant: 'primary' | 'secondary' | 'ghost' }[] = [
  { status: 'ACTIVE', label: 'Активировать', variant: 'primary' },
  { status: 'OVERDUE', label: 'Отметить просрочку', variant: 'ghost' },
  { status: 'CLOSED', label: 'Закрыть', variant: 'secondary' },
  { status: 'REJECTED', label: 'Отклонить', variant: 'ghost' },
];

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  PENDING_SIGNATURE: { label: 'Ожидает подписания', bg: 'bg-amber-50', text: 'text-amber-700' },
  ACTIVE: { label: 'Активен', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  OVERDUE: { label: 'Просрочен', bg: 'bg-red-50', text: 'text-red-700' },
  CLOSED: { label: 'Закрыт', bg: 'bg-slate-50', text: 'text-slate-700' },
  REJECTED: { label: 'Отклонён', bg: 'bg-red-50', text: 'text-red-600' },
};

function ScheduleTable({ schedule }: { schedule: AdminLoan['paymentSchedule'] }) {
  if (!schedule || schedule.length === 0) {
    return <p className="text-sm text-[var(--color-on-surface-variant)]">График платежей недоступен</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/20">
            <th className="whitespace-nowrap pb-2 pr-4 text-left font-semibold">#</th>
            <th className="whitespace-nowrap pb-2 pr-4 text-left font-semibold">Дата</th>
            <th className="whitespace-nowrap pb-2 pr-4 text-right font-semibold">Основной долг</th>
            <th className="whitespace-nowrap pb-2 pr-4 text-right font-semibold">Проценты</th>
            <th className="whitespace-nowrap pb-2 pr-4 text-right font-semibold">Всего</th>
            <th className="whitespace-nowrap pb-2 text-left font-semibold">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/20">
          {schedule.map((item) => {
            const isPaid = item.status === 'PAID';
            const isOverdue = item.status === 'OVERDUE';
            const isPartial = item.status === 'PARTIAL';
            return (
              <tr key={item.id} className={cn(isOverdue && 'bg-red-50')}>
                <td className="py-2.5 pr-4 font-medium">{item.installmentNumber}</td>
                <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">{new Date(item.dueDate).toLocaleDateString('ru-RU')}</td>
                <td className="py-2.5 pr-4 text-right">€{Number(item.principalPart).toFixed(2)}</td>
                <td className="py-2.5 pr-4 text-right">€{Number(item.interestPart).toFixed(2)}</td>
                <td className="py-2.5 pr-4 text-right font-medium">€{Number(item.amountDue).toFixed(2)}</td>
                <td className="py-2.5 whitespace-nowrap">
                  {isPaid && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Оплачен</span>}
                  {isOverdue && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">Просрочен</span>}
                  {isPartial && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Частично</span>}
                  {item.status === 'PENDING' && <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">Ожидает</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminLoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');

  const { data: loan, isLoading, error } = useQuery({
    queryKey: ['admin-loan', id],
    queryFn: () => adminGetLoan(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: LoanStatus) => adminUpdateLoanStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loan', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-loans'] });
      setActionError('');
    },
    onError: (err) => setActionError(err instanceof ApiError ? err.message : 'Ошибка обновления статуса'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Кредит не найден
      </div>
    );
  }

  const badge = STATUS_BADGES[loan.status] || { label: loan.status, bg: 'bg-slate-50', text: 'text-slate-700' };

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]">
        <ArrowLeft className="size-4" />Назад
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">{loan.loanNumber}</h1>
            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', badge.bg, badge.text)}>{badge.label}</span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Клиент: {loan.user?.fullName || loan.user?.phone || '—'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.map((action) => {
            if (action.status === loan.status) return null;
            return (
              <Button
                key={action.status}
                variant={action.variant}
                onClick={() => statusMutation.mutate(action.status)}
                disabled={statusMutation.isPending}
                className="gap-2"
              >
                {statusMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {action.label}
              </Button>
            );
          })}
          {loan.status === 'ACTIVE' && (
            <Link
              href={`/admin/payments/record?loanId=${loan.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <DollarSign className="size-4" />
              Записать платёж
            </Link>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-black/20 bg-white p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Основная сумма</p>
          <p className="text-xl font-bold text-[var(--color-on-surface)]">€{Number(loan.principalAmount)?.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-black/20 bg-white p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Общая сумма к возврату</p>
          <p className="text-xl font-bold text-[var(--color-on-surface)]">€{Number(loan.totalRepayment)?.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-black/20 bg-white p-5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Аннуитетный платёж</p>
          <p className="text-xl font-bold text-[var(--color-on-surface)]">€{Number(loan.annuityPayment)?.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-black/20 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">График платежей</h2>
        <ScheduleTable schedule={loan.paymentSchedule} />
      </div>

      {loan.payments && loan.payments.length > 0 && (
        <div className="mb-6 rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">История платежей</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="whitespace-nowrap pb-2 pr-4 text-left font-semibold">Ссылка</th>
                  <th className="whitespace-nowrap pb-2 pr-4 text-right font-semibold">Сумма</th>
                  <th className="whitespace-nowrap pb-2 pr-4 text-left font-semibold">Дата</th>
                  <th className="whitespace-nowrap pb-2 text-left font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {loan.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">{payment.reference}</td>
                    <td className="py-2.5 pr-4 text-right font-medium">€{Number(payment.amount).toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">{new Date(payment.effectiveDate).toLocaleDateString('ru-RU')}</td>
                    <td className="py-2.5 text-xs text-[var(--color-on-surface-variant)]">{payment.id.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loan.paymentRequests && loan.paymentRequests.length > 0 && (
        <div className="rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">Запросы на платежи</h2>
          <div className="space-y-2">
            {loan.paymentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-container-low)] p-3">
                <div>
                  <p className="text-sm font-medium">€{Number(req.amount).toFixed(2)} — {req.reference}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{new Date(req.createdAt).toLocaleString('ru-RU')}</p>
                </div>
                <span className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  req.status === 'PENDING_REVIEW' && 'bg-amber-50 text-amber-700',
                  req.status === 'APPROVED' && 'bg-emerald-50 text-emerald-700',
                  req.status === 'REJECTED' && 'bg-red-50 text-red-700',
                )}>
                  {req.status === 'PENDING_REVIEW' ? 'Ожидает' : req.status === 'APPROVED' ? 'Одобрен' : 'Отклонён'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
