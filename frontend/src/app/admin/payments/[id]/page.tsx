'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminGetPaymentRequests, adminReviewPaymentRequest, adminRecordPayment, type PaymentRequestStatus } from '@/shared/api/admin';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

export default function PaymentReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { admin } = useAdminAuth();
  const [actionError, setActionError] = useState('');

  const { data: requests } = useQuery({
    queryKey: ['admin-payment-requests'],
    queryFn: () => adminGetPaymentRequests(),
  });

  const request = requests?.find((r) => r.id === id);

  const reviewMutation = useMutation({
    mutationFn: (status: PaymentRequestStatus) => adminReviewPaymentRequest(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-requests'] });
      setActionError('');
    },
    onError: (err) => setActionError(err instanceof ApiError ? err.message : 'Ошибка проверки'),
  });

  if (!request) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Запрос платежа не найден
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]">
        <ArrowLeft className="size-4" />Назад
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Проверка платежа</h1>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-[var(--color-on-surface)]">Детали запроса</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Клиент</dt><dd className="font-medium">{request.user?.fullName || request.user?.phone || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Кредит</dt><dd className="font-medium">{request.loan?.loanNumber || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Сумма</dt><dd className="text-lg font-bold text-[var(--color-on-surface)]">€{Number(request.amount).toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Reference</dt><dd className="font-mono text-xs">{request.reference}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Дата запроса</dt><dd>{new Date(request.createdAt).toLocaleString('ru-RU')}</dd></div>
            {request.details && <div className="flex justify-between"><dt className="text-[var(--color-on-surface-variant)]">Детали</dt><dd className="text-right">{request.details}</dd></div>}
          </dl>
        </div>

        <div className="rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-[var(--color-on-surface)]">Действия</h2>
          <p className="mb-4 text-sm text-[var(--color-on-surface-variant)]">
            Подтвердите или отклоните запрос платежа от клиента.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => reviewMutation.mutate('APPROVED')}
              disabled={reviewMutation.isPending || request.status !== 'PENDING_REVIEW'}
              className="gap-2 flex-1"
            >
              {reviewMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
              Подтвердить
            </Button>
            <Button
              variant="ghost"
              onClick={() => reviewMutation.mutate('REJECTED')}
              disabled={reviewMutation.isPending || request.status !== 'PENDING_REVIEW'}
              className="gap-2 flex-1 border border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="size-4" />
              Отклонить
            </Button>
          </div>
          {request.status !== 'PENDING_REVIEW' && (
            <p className="mt-3 text-center text-xs text-[var(--color-on-surface-variant)]">
              Этот запрос уже был обработан
            </p>
          )}
        </div>
      </div>

      {request.status === 'APPROVED' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle className="mx-auto mb-2 size-8 text-emerald-500" />
          <p className="font-semibold text-emerald-700">Платёж подтверждён</p>
          <p className="text-sm text-emerald-600">
            {request.reviewedAt && new Date(request.reviewedAt).toLocaleString('ru-RU')}
          </p>
        </div>
      )}

      {request.status === 'REJECTED' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <XCircle className="mx-auto mb-2 size-8 text-red-500" />
          <p className="font-semibold text-red-700">Платёж отклонён</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/admin/payments/record" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-secondary)] hover:underline">
          Записать платёж <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
