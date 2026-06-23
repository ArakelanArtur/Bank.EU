'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { ApiError } from '@/shared/api/client';
import { Button } from '@/shared/ui/button';
import { Phone, ChevronLeft } from 'lucide-react';
import * as v from 'valibot';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, requestOtpCode, verifyOtpCode } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.replace('/cabinet/applications');
    return null;
  }

  const phoneSchema = v.pipe(v.string(), v.minLength(5, 'Введите корректный номер телефона'));
  const otpSchema = v.pipe(v.string(), v.regex(/^\d{4}$/, 'Введите 4-значный код'));

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const phoneResult = v.safeParse(phoneSchema, phone);
    if (!phoneResult.success) {
      setError(phoneResult.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await requestOtpCode(phone);
      setStep('otp');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpResult = v.safeParse(otpSchema, code);
    if (!otpResult.success) {
      setError(otpResult.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await verifyOtpCode(phone, code);
      router.replace('/cabinet/applications');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <div className="rounded-xl border border-black/20 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--color-secondary)] text-white">
            <Phone className="size-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">
            Личный кабинет
          </h1>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
            {step === 'phone'
              ? 'Введите номер телефона для входа'
              : 'Введите код из SMS'}
          </p>
        </div>

        {step === 'otp' && (
          <button
            onClick={() => setStep('phone')}
            className="mb-4 flex items-center gap-1 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]"
          >
            <ChevronLeft className="size-4" />
            Изменить номер
          </button>
        )}

        <form onSubmit={step === 'phone' ? handleRequestOtp : handleVerifyOtp}>
          {step === 'phone' ? (
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Номер телефона
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+353 XX XXX XXXX"
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Код из SMS
              </label>
              <input
                required
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
               placeholder="0000"
                 className="mt-1 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
               />
               <p className="mt-2 text-xs text-[var(--color-outline)]">
                 Введите любой 4-значный код (тестовый: 0000)
               </p>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-5 w-full"
          >
            {loading
              ? 'Отправка...'
              : step === 'phone'
                ? 'Получить код'
                : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
