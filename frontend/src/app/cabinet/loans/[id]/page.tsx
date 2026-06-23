'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoan, requestSignOtp, signLoan, createPaymentRequest, getMyPaymentRequests } from '@/shared/api/loans';
import { ApiError } from '@/shared/api/client';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Calendar, FileText, Download, CreditCard, Upload } from 'lucide-react';
import Link from 'next/link';

const SCHEDULE_STATUS_MAP: Record<string, string> = {
  PENDING: 'Ожидается',
  PARTIAL: 'Частично оплачен',
  PAID: 'Оплачен',
  OVERDUE: 'Просрочен',
};

const LOAN_STATUS_MAP: Record<string, string> = {
  PENDING_SIGNATURE: 'Ожидает подписания',
  ACTIVE: 'Активен',
  OVERDUE: 'Просрочен',
  CLOSED: 'Закрыт',
  REJECTED: 'Отклонён',
};

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [signOtpStep, setSignOtpStep] = useState<'idle' | 'otp' | 'signed'>('idle');
  const [signOtpCode, setSignOtpCode] = useState('');
  const [signError, setSignError] = useState('');
  const [signLoading, setSignLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { data: loan, isLoading, error } = useQuery({
    queryKey: ['loan', id],
    queryFn: () => getLoan(id),
    enabled: !!id,
  });

  const { data: paymentRequests } = useQuery({
    queryKey: ['my-payment-requests'],
    queryFn: getMyPaymentRequests,
  });

  const loanPaymentRequests = paymentRequests?.filter((pr) => pr.loanId === id) ?? [];

  const handleRequestSignOtp = async () => {
    setSignError('');
    setSignLoading(true);
    try {
      await requestSignOtp(id);
      setSignOtpStep('otp');
    } catch (err) {
      setSignError(err instanceof ApiError ? err.message : 'Ошибка');
    } finally {
      setSignLoading(false);
    }
  };

  const handleSignLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignError('');
    setSignLoading(true);
    try {
      await signLoan(id, signOtpCode);
      setSignOtpStep('signed');
      queryClient.invalidateQueries({ queryKey: ['loan', id] });
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
    } catch (err) {
      setSignError(err instanceof ApiError ? err.message : 'Неверный код');
    } finally {
      setSignLoading(false);
    }
  };

  const handleCreatePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentLoading(true);
    try {
      await createPaymentRequest(id, Number(paymentAmount), paymentDetails || undefined, paymentReceiptFile || undefined);
      setPaymentSuccess(true);
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentDetails('');
      setPaymentReceiptFile(null);
      queryClient.invalidateQueries({ queryKey: ['my-payment-requests'] });
    } catch (err) {
      setPaymentError(err instanceof ApiError ? err.message : 'Ошибка');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Ошибка загрузки займа</p>
        <Link href="/cabinet/loans" className="mt-3 inline-block text-sm text-[var(--color-secondary)] hover:underline">
          ← Вернуться к займам
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/cabinet/loans"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]"
      >
        <ArrowLeft className="size-4" />
        Назад к займам
      </Link>

      <div className="rounded-xl border border-black/20 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-on-surface)]">
              Займ {loan.loanNumber}
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              от {new Date(loan.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <span className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
            loan.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
            loan.status === 'OVERDUE' ? 'border-red-200 bg-red-50 text-red-600' :
            loan.status === 'CLOSED' ? 'border-black/20 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]' :
            'border-amber-200 bg-amber-50 text-amber-600'
          }`}>
            {LOAN_STATUS_MAP[loan.status]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Сумма займа</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-on-surface)]">
              €{Number(loan.principalAmount).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Ставка</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-on-surface)]">
              {Number(loan.dailyRate * 100).toFixed(2)}% в день
            </p>
          </div>
          <div className="rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Срок</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-on-surface)]">
              {loan.termDays} дней
            </p>
          </div>
          <div className="rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">К возврату</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-on-surface)]">
              €{Number(loan.totalRepayment).toLocaleString()}
            </p>
          </div>
        </div>

        {loan.status === 'PENDING_SIGNATURE' && signOtpStep !== 'signed' && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              Займ ожидает подписания
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Подпишите займ с помощью SMS-кода для активации
            </p>
            {signOtpStep === 'idle' ? (
              <Button onClick={handleRequestSignOtp} disabled={signLoading} className="mt-3">
                {signLoading ? 'Отправка...' : 'Подписать займ'}
              </Button>
            ) : (
              <form onSubmit={handleSignLoan} className="mt-3 flex items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-amber-700">Код из SMS</label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={signOtpCode}
                    onChange={(e) => setSignOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1111"
                     className="mt-1 w-32 rounded-lg border border-amber-300 bg-white px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-amber-500"
                  />
                </div>
                <Button type="submit" disabled={signLoading || signOtpCode.length < 4}>
                  {signLoading ? '...' : 'Подтвердить'}
                </Button>
              </form>
            )}
            {signError && <p className="mt-2 text-xs text-red-600">{signError}</p>}
          </div>
        )}

        {signOtpStep === 'signed' && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">
              Займ успешно подписан!
            </p>
          </div>
        )}

        {(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setShowPaymentForm(!showPaymentForm)}
            >
              <CreditCard className="size-4" />
              Создать заявку на оплату
            </Button>
            <Button variant="ghost" className="gap-2" onClick={() => document.getElementById('payment-schedule')?.scrollIntoView({ behavior: 'smooth' })}>
              <Calendar className="size-4" />
              График платежей
            </Button>
            <Button variant="ghost" className="gap-2" onClick={() => setShowContract(!showContract)}>
              <FileText className="size-4" />
              Договор
            </Button>
          </div>
        )}

        {showPaymentForm && (
          <form onSubmit={handleCreatePaymentRequest} className="mt-4 rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <h3 className="text-sm font-medium text-[var(--color-on-surface)]">
              Новая заявка на оплату
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">
                  Сумма
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  step={0.01}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-secondary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">
                  Детали (опционально)
                </label>
                <input
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="Назначение платежа"
                  className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-secondary)]"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">
                Квитанция (опционально)
              </label>
              <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border border-black/20 bg-white px-3 py-2.5 text-sm text-[var(--color-on-surface-variant)] transition hover:border-[var(--color-secondary)]">
                <Upload className="size-4" />
                {paymentReceiptFile ? paymentReceiptFile.name : 'Прикрепить файл'}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setPaymentReceiptFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {paymentError && <p className="mt-2 text-xs text-red-600">{paymentError}</p>}
            {paymentSuccess && (
              <p className="mt-2 text-xs text-emerald-600">Заявка на оплату создана</p>
            )}
            <div className="mt-3 flex gap-2">
              <Button type="submit" disabled={paymentLoading}>
                {paymentLoading ? 'Отправка...' : 'Отправить'}
              </Button>
              <Button variant="ghost" onClick={() => setShowPaymentForm(false)}>
                Отмена
              </Button>
            </div>
          </form>
        )}

        {loanPaymentRequests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[var(--color-on-surface)]">
              Заявки на оплату
            </h3>
            <div className="mt-2 space-y-2">
              {loanPaymentRequests.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between rounded-xl border border-black/20 bg-white p-3 text-sm">
                  <div>
                    <span className="font-medium text-[var(--color-on-surface)]">
                      €{Number(pr.amount).toLocaleString()}
                    </span>
                    <span className="ml-2 text-[var(--color-on-surface-variant)]">
                      от {new Date(pr.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    {pr.receiptFileName && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/payment-receipts/${pr.receiptFileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline"
                      >
                        <Download className="size-3" />
                        Квитанция
                      </a>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    pr.status === 'APPROVED' ? 'text-emerald-600' :
                    pr.status === 'REJECTED' ? 'text-red-600' :
                    'text-amber-600'
                  }`}>
                    {pr.status === 'PENDING_REVIEW' ? 'На рассмотрении' :
                     pr.status === 'APPROVED' ? 'Одобрена' : 'Отклонена'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showContract && (
          <div className="mt-6 rounded-xl border border-black/20 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-on-surface)]">Договор займа</h3>
            <div className="space-y-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              <p><strong className="text-[var(--color-on-surface)]">Номер договора:</strong> {loan.loanNumber}</p>
              <p><strong className="text-[var(--color-on-surface)]">Дата:</strong> {new Date(loan.createdAt).toLocaleDateString('ru-RU')}</p>
              <p><strong className="text-[var(--color-on-surface)]">Сумма займа:</strong> €{Number(loan.principalAmount).toLocaleString()}</p>
              <p><strong className="text-[var(--color-on-surface)]">Процентная ставка:</strong> {Number(loan.dailyRate * 100).toFixed(2)}% в день</p>
              <p><strong className="text-[var(--color-on-surface)]">Срок:</strong> {loan.termDays} дней</p>
              <p><strong className="text-[var(--color-on-surface)]">Ежедневный платёж:</strong> €{Number(loan.annuityPayment).toLocaleString()}</p>
              <p><strong className="text-[var(--color-on-surface)]">Общая сумма к возврату:</strong> €{Number(loan.totalRepayment).toLocaleString()}</p>
              <div className="mt-4 border-t border-black/20 pt-4 text-xs text-[var(--color-outline)]">
                <p>Настоящий договор является демонстрационным и не имеет юридической силы. LumenBridge Finance Ltd, 18 Lower Baggot Street, Dublin 2, Ireland.</p>
              </div>
            </div>
          </div>
        )}

        {loan.paymentSchedule.length > 0 && (
          <div id="payment-schedule" className="mt-6">
            <h3 className="text-sm font-medium text-[var(--color-on-surface)]">
              График платежей
            </h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/20 text-left text-xs text-[var(--color-on-surface-variant)]">
                    <th className="pb-2 pr-4 font-medium">№</th>
                    <th className="pb-2 pr-4 font-medium">Дата</th>
                    <th className="pb-2 pr-4 font-medium">Сумма</th>
                    <th className="pb-2 pr-4 font-medium">Основной долг</th>
                    <th className="pb-2 pr-4 font-medium">Проценты</th>
                    <th className="pb-2 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.paymentSchedule.map((item) => (
                    <tr key={item.id} className="border-b border-black/20">
                      <td className="py-2.5 pr-4 text-[var(--color-on-surface)]">
                        {item.installmentNumber}
                      </td>
                      <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">
                        {new Date(item.dueDate).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-[var(--color-on-surface)]">
                        €{Number(item.amountDue).toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">
                        €{Number(item.principalPart).toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 text-[var(--color-on-surface-variant)]">
                        €{Number(item.interestPart).toLocaleString()}
                      </td>
                      <td className={`py-2.5 font-medium ${
                        item.status === 'PAID' ? 'text-emerald-600' :
                        item.status === 'OVERDUE' ? 'text-red-600' :
                        'text-[var(--color-on-surface-variant)]'
                      }`}>
                        {SCHEDULE_STATUS_MAP[item.status]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
