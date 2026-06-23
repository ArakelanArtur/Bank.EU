'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createApplication } from '@/shared/api/applications';
import { ApiError } from '@/shared/api/client';
import { useAuth } from '@/shared/lib/auth-context';
import { calculateLoanTerms, formatCurrency } from '@/shared/lib/loan-calculator';
import { Button } from '@/shared/ui/button';
import * as v from 'valibot';

export default function NewApplicationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userType = user?.userType || 'INDIVIDUAL';
  const [formData, setFormData] = useState({
    applicantType: userType,
    phone: user?.phone || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    amount: 2000,
    termDays: 30,
    companyName: '',
    registrationNumber: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<any>(null);

  const calc = calculateLoanTerms(formData.amount, formData.termDays);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applicationSchema = v.object({
    applicantType: v.union([v.literal('INDIVIDUAL'), v.literal('BUSINESS')]),
    phone: v.pipe(v.string(), v.minLength(5, 'Введите корректный номер телефона')),
    fullName: v.optional(v.string()),
    email: v.optional(v.pipe(v.string(), v.regex(/^[^\s@]+@[^\s@]+$/, 'Некорректный email'))),
    amount: v.pipe(v.number(), v.minValue(500), v.maxValue(50000)),
    termDays: v.pipe(v.number(), v.minValue(7), v.maxValue(90)),
    companyName: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const result = v.safeParse(applicationSchema, formData);
    if (!result.success) {
      const firstIssue = result.issues[0];
      setErrorMsg(firstIssue.message);
      setStatus('error');
      return;
    }

    try {
      const res = await createApplication({
        ...formData,
        source: 'CABINET',
      });
      setResult(res);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="text-lg font-semibold text-emerald-800">
            Заявка успешно отправлена!
          </p>
          <p className="mt-2 text-sm text-emerald-600">
            Номер заявки: <strong>{result?.applicationNumber}</strong>
          </p>
          <p className="mt-1 text-sm text-emerald-600">
            Мы свяжемся с вами в ближайшее время.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setStatus('idle');
                setFormData({
                  applicantType: userType,
                  phone: user?.phone || '',
                  fullName: user?.fullName || '',
                  email: user?.email || '',
                  amount: 2000,
                  termDays: 30,
                  companyName: '',
                  registrationNumber: '',
                });
              }}
            >
              Подать ещё
            </Button>
            <Button onClick={() => router.push('/cabinet/applications')}>
              К заявкам
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">
        Новая заявка
      </h1>
      <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
        Заполните форму для получения займа
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-4 rounded-xl border border-black/20 bg-white p-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Сумма займа
            </label>
            <div className="mt-1 flex items-center justify-between gap-4">
              <input
                type="range"
                min={500}
                max={50000}
                step={100}
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="range-input flex-1"
              />
              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                {formatCurrency(formData.amount)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Срок займа
            </label>
            <div className="mt-1 flex items-center justify-between gap-4">
              <input
                type="range"
                min={7}
                max={90}
                step={1}
                value={formData.termDays}
                onChange={(e) => handleChange('termDays', Number(e.target.value))}
                className="range-input flex-1"
              />
              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                {formData.termDays} дней
              </span>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex-1 rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-3">
              <p className="text-[var(--color-on-surface-variant)]">Платёж</p>
              <p className="font-semibold text-[var(--color-on-surface)]">
                {formatCurrency(calc.annuityPayment)}
              </p>
            </div>
            <div className="flex-1 rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-3">
              <p className="text-[var(--color-on-surface-variant)]">К возврату</p>
              <p className="font-semibold text-[var(--color-on-surface)]">
                {formatCurrency(calc.totalRepayment)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Телефон *
            </label>
            <input
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+353 XX XXX XXXX"
              className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
            Имя
          </label>
          <input
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>

        {userType === 'BUSINESS' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Название компании
              </label>
              <input
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Регистрационный номер
              </label>
              <input
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        <Button type="submit" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
        </Button>
      </form>
    </div>
  );
}
