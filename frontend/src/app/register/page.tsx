'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, User, Building2, Phone, Mail, Lock, FileDigit } from 'lucide-react';
import { registerUser } from '@/shared/api/auth';
import { Button } from '@/shared/ui/button';
import { LogoIcon } from '@/shared/ui/logo-icon';

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [inn, setInn] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'INDIVIDUAL' | 'BUSINESS' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userType) { setError('Выберите тип клиента'); return; }
    if (!phone) { setError('Введите номер телефона'); return; }
    if (!password || password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }

    if (userType === 'INDIVIDUAL') {
      if (!fullName) { setError('Введите имя'); return; }
    } else {
      if (!companyName) { setError('Введите название компании'); return; }
      if (!inn || !/^\d{10}$|^\d{12}$/.test(inn)) { setError('Введите ИНН (10 или 12 цифр)'); return; }
      if (!contactPerson) { setError('Введите имя контактного лица'); return; }
    }

    setLoading(true);
    try {
      const payload: any = { phone, password, email: email || undefined, userType };
      if (userType === 'INDIVIDUAL') {
        payload.fullName = fullName;
      } else {
        payload.fullName = contactPerson;
        payload.companyName = companyName;
        payload.inn = inn;
        payload.contactPerson = contactPerson;
      }
      await registerUser(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-green-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-7"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Регистрация завершена</h1>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">Теперь вы можете войти в личный кабинет.</p>
          <Link href="/login">
            <Button className="mt-6">Перейти к входу</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-0 text-center">
          <Link href="/" className="block text-center">
            <div className="mx-auto flex size-[120px] items-center justify-center">
              <LogoIcon className="size-[120px]" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-on-surface)]">LumenBridge</h1>
          </Link>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Регистрация
          </p>
          <p className="mt-3 text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
            Выберите тип клиента
          </p>
        </div>

        <div className="rounded-2xl border-2 border-[var(--color-secondary)] bg-white p-6 shadow-md transition hover:shadow-lg">
          {userType === null ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setUserType('INDIVIDUAL')}
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-[var(--color-on-surface)]/20 bg-white px-5 py-8 text-center transition hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 hover:shadow-md"
                >
                  <div className="flex size-14 items-center justify-center rounded-xl bg-[var(--color-on-surface)]/10 text-[var(--color-on-surface)]">
                    <User className="size-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[var(--color-on-surface)]">Физическое лицо</p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">Для частных лиц</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('BUSINESS')}
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-[var(--color-on-surface)]/20 bg-white px-5 py-8 text-center transition hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 hover:shadow-md"
                >
                  <div className="flex size-14 items-center justify-center rounded-xl bg-[var(--color-on-surface)]/10 text-[var(--color-on-surface)]">
                    <Building2 className="size-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[var(--color-on-surface)]">Бизнес</p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">Для юридических лиц</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => { setUserType(null); setError(''); }}
                className="mb-5 flex items-center gap-1 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                К выбору типа
              </button>

              <div className="mb-5 flex items-center gap-4 rounded-xl border-2 border-black/20 bg-[var(--color-secondary)]/5 px-5 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-secondary)] text-white">
                  {userType === 'INDIVIDUAL' ? <User className="size-5" /> : <Building2 className="size-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {userType === 'INDIVIDUAL' ? 'Физическое лицо' : 'Бизнес'}
                  </p>
                  <p className="text-xs font-normal text-[var(--color-on-surface-variant)]">
                    {userType === 'INDIVIDUAL' ? 'Для частных лиц' : 'Для юридических лиц'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Телефон</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                      <Phone className="size-4" />
                    </div>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+353 XX XXX XXXX" required className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                  </div>
                </div>

                {userType === 'INDIVIDUAL' ? (
                  <>
                    <div className="mb-4">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Имя</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <User className="size-4" />
                        </div>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Название компании</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <Building2 className="size-4" />
                        </div>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ООО «Компания»" required className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">ИНН</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <FileDigit className="size-4" />
                        </div>
                        <input type="text" value={inn} onChange={(e) => setInn(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="10 или 12 цифр" required className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Контактное лицо</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <User className="size-4" />
                        </div>
                        <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Имя руководителя или представителя" required className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Email</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                      <Mail className="size-4" />
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">Пароль</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                      <Lock className="size-4" />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" required minLength={6} className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {loading ? 'Регистрация...' : `Зарегистрироваться как ${userType === 'INDIVIDUAL' ? 'физлицо' : 'бизнес'}`}
                </Button>
              </form>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-[var(--color-on-surface-variant)]">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-semibold text-[var(--color-secondary)] hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
