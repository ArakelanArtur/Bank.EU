'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Section } from '@/shared/ui/section';
import { Button } from '@/shared/ui/button';
import { createApplication } from '@/shared/api/applications';
import { ApiError } from '@/shared/api/client';
import { calculateLoanTerms, formatCurrency } from '@/shared/lib/loan-calculator';
import * as v from 'valibot';

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    applicantType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'BUSINESS',
    phone: '',
    fullName: '',
    email: '',
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

    if (formData.applicantType === 'INDIVIDUAL' && !formData.fullName.trim()) {
      setErrorMsg('Введите имя');
      setStatus('error');
      return;
    }

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
        source: 'PUBLIC_SITE',
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

  return (
    <Section className="py-16 sm:py-20" id="application-form">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-xl rounded-2xl border-2 border-black/85 px-8 pb-8 pt-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
            Оформить заявку
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
            Заполните форму, и мы рассмотрим вашу заявку в течение нескольких минут.
          </p>

          {status === 'success' ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-lg font-semibold text-emerald-800">
              Заявка успешно отправлена!
            </p>
            <p className="mt-2 text-sm text-emerald-600">
              Номер заявки: <strong>{result?.applicationNumber}</strong>
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Мы свяжемся с вами в ближайшее время.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setStatus('idle');
                setFormData({
                  applicantType: 'INDIVIDUAL',
                  phone: '',
                  fullName: '',
                  email: '',
                  amount: 2000,
                  termDays: 30,
                  companyName: '',
                  registrationNumber: '',
                });
              }}
            >
              Подать новую заявку
            </Button>
          </div>
          ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex gap-3 rounded-xl border border-black/20 bg-white p-1">
              <button
                type="button"
                onClick={() => handleChange('applicantType', 'INDIVIDUAL')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                  formData.applicantType === 'INDIVIDUAL'
                    ? 'bg-[var(--color-secondary)] text-black'
                    : 'text-[var(--color-on-surface-variant)]'
                }`}
              >
                Физическое лицо
              </button>
              <button
                type="button"
                onClick={() => handleChange('applicantType', 'BUSINESS')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                  formData.applicantType === 'BUSINESS'
                    ? 'bg-[var(--color-secondary)] text-black'
                    : 'text-[var(--color-on-surface-variant)]'
                }`}
              >
                Бизнес
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-black">
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
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {formatCurrency(formData.amount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
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
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {formData.termDays} дней
                  </span>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex-1 rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-3">
                  <p className="text-[var(--color-on-surface-variant)]">Платёж</p>
                  <p className="font-bold text-[var(--color-on-surface)]">
                    {formatCurrency(calc.annuityPayment)}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-black/20 bg-[var(--color-surface-container-low)] p-3">
                  <p className="text-[var(--color-on-surface-variant)]">К возврату</p>
                  <p className="font-bold text-[var(--color-on-surface)]">
                    {formatCurrency(calc.totalRepayment)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-black">
                  Телефон *
                </label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+353 XX XXX XXXX"
                  className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Имя{formData.applicantType === 'INDIVIDUAL' ? ' *' : ''}
              </label>
              <input
                required={formData.applicantType === 'INDIVIDUAL'}
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
            </div>

            {formData.applicantType === 'BUSINESS' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-black">
                      Название компании
                  </label>
                  <input
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">
                      Регистрационный номер
                  </label>
                  <input
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                  />
                </div>
              </div>
            )}

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <Button type="submit" disabled={status === 'loading'} className="w-full" size="lg">
              {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </form>
        )}
      </motion.div>
    </Section>
  );
}
