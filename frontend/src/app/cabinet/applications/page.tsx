'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyApplications, type Application } from '@/shared/api/applications';
import { createPaymentRequest } from '@/shared/api/loans';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { ApiError } from '@/shared/api/client';
import { Button } from '@/shared/ui/button';

const STATUS_MAP: Record<Application['status'], { label: string; color: string; icon: typeof Clock }> = {
  NEW: { label: 'На рассмотрении', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  IN_REVIEW: { label: 'На рассмотрении', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle },
  APPROVED: { label: 'Одобрена', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  REJECTED: { label: 'Отклонена', color: 'text-status-rejected bg-red-50 border-red-200', icon: XCircle },
};

function ApplicationCard({ app }: { app: Application }) {
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const s = STATUS_MAP[app.status];
  const Icon = s.icon;
  const loan = app.loan;

  const paymentMutation = useMutation({
    mutationFn: () => createPaymentRequest(loan!.id, Number(paymentAmount)),
    onSuccess: () => {
      setPaymentSuccess(true);
      setShowPayment(false);
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      setTimeout(() => setPaymentSuccess(false), 3000);
    },
  });

  return (
    <div className="rounded-xl border border-black/20 bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-surface-container-low)]">
            <FileText className="size-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-on-surface)]">{app.applicationNumber}</p>
            <p className="text-xs text-[var(--color-outline)]">от {new Date(app.createdAt).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${s.color}`}>
          <Icon className="size-3.5" />
          {s.label}
        </span>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div>
          <span className="text-[var(--color-on-surface-variant)]">Сумма: </span>
          <span className="font-semibold text-[var(--color-on-surface)]">€{Number(app.amount).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[var(--color-on-surface-variant)]">Срок: </span>
          <span className="font-semibold text-[var(--color-on-surface)]">{app.termDays} дн.</span>
        </div>
      </div>

      {loan && (loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
        <div className="mt-4 rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface)]">
            <CreditCard className="size-4 text-[var(--color-secondary)]" />
            Заём {loan.loanNumber}
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-[var(--color-on-surface-variant)]">Сумма займа: </span><span className="font-semibold">€{Number(loan.principalAmount).toLocaleString()}</span></div>
            <div><span className="text-[var(--color-on-surface-variant)]">Платёж: </span><span className="font-semibold">€{Number(loan.annuityPayment).toLocaleString()}</span></div>
          </div>

          {paymentSuccess ? (
            <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
              Запрос на оплату отправлен
            </div>
          ) : showPayment ? (
            <form onSubmit={(e) => { e.preventDefault(); paymentMutation.mutate(); }} className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">€</span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Сумма"
                  min={1}
                  max={Number(loan.totalRepayment)}
                  required
                  className="w-full rounded-lg border border-black/20 bg-white py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
                />
              </div>
              <Button type="submit" disabled={paymentMutation.isPending}>
                {paymentMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Оплатить'}
              </Button>
              <button type="button" onClick={() => setShowPayment(false)} className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">Отмена</button>
            </form>
          ) : (
            <button onClick={() => setShowPayment(true)} className="text-sm font-medium text-[var(--color-secondary)] hover:underline">
              Оплатить досрочно
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const { data: apps, isLoading, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-status-rejected">Ошибка загрузки заявок</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">Мои заявки</h1>
      <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Всего заявок: {apps?.length ?? 0}</p>

      {!apps || apps.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/20 p-12 text-center">
          <FileText className="mx-auto size-10 text-[var(--color-outline)]" />
          <p className="mt-4 text-[var(--color-on-surface-variant)]">У вас пока нет заявок</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {apps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
