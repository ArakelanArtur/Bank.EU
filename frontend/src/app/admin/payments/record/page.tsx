'use client';

import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle, ShieldBan } from 'lucide-react';
import { adminGetLoans, adminRecordPayment, type AdminLoan } from '@/shared/api/admin';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

export default function RecordPaymentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === 'ADMIN';
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const { data: loans } = useQuery({
    queryKey: ['admin-loans'],
    queryFn: () => adminGetLoans(),
  });

  const activeLoans = loans?.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE') || [];

  const recordMutation = useMutation({
    mutationFn: () =>
      adminRecordPayment({
        loanId,
        amount: parseFloat(amount),
        reference,
        effectiveDate: new Date(effectiveDate).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-loan', loanId] });
      setLoanId('');
      setAmount('');
      setReference('');
      setEffectiveDate(new Date().toISOString().split('T')[0]);
      setError('');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Ошибка записи платежа'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loanId || !amount || !reference || !effectiveDate) {
      setError('Заполните все обязательные поля');
      return;
    }
    recordMutation.mutate();
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldBan className="mb-4 size-12 text-red-400" />
        <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Доступ запрещён</h2>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Запись платежей доступна только администратору</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]">
        <ArrowLeft className="size-4" />Назад
      </button>

      <div className="mx-auto max-w-lg">
        <h1 className="mb-1 text-2xl font-bold text-[var(--color-on-surface)]">Запись платежа</h1>
        <p className="mb-6 text-sm text-[var(--color-on-surface-variant)]">
          Зарегистрировать входящий платёж по кредиту
        </p>

        <form onSubmit={handleSubmit} className="rounded-xl border border-black/20 bg-white p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {recordMutation.isSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Платёж успешно записан
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="loan" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Кредит <span className="text-red-500">*</span>
            </label>
            <select
              id="loan"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            >
              <option value="">Выберите кредит...</option>
              {activeLoans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.loanNumber} — {loan.user?.fullName || loan.user?.phone || '—'} (€{Number(loan.principalAmount).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Сумма (€) <span className="text-red-500">*</span>
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reference" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Reference <span className="text-red-500">*</span>
            </label>
            <input
              id="reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Номер транзакции или счёта"
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Дата платежа <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <Button type="submit" disabled={recordMutation.isPending} className="w-full gap-2">
            {recordMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
            {recordMutation.isPending ? 'Запись...' : 'Записать платёж'}
          </Button>
        </form>
      </div>
    </div>
  );
}
