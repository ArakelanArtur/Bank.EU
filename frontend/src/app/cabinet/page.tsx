'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FileText, CreditCard, Bell, ArrowRight, ChevronRight, Plus, AlertCircle, DollarSign, CheckCheck } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';
import { getMyApplications } from '@/shared/api/applications';
import { getMyLoans } from '@/shared/api/loans';
import { getMyNotifications } from '@/shared/api/notifications';
import { Button } from '@/shared/ui/button';

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  APPLICATION_STATUS_CHANGED: <FileText className="size-4" />,
  LOAN_APPROVED: <CreditCard className="size-4" />,
  LOAN_SIGN_REQUIRED: <AlertCircle className="size-4" />,
  LOAN_SIGNED: <CheckCheck className="size-4" />,
  PAYMENT_REQUEST_UPDATED: <DollarSign className="size-4" />,
  PAYMENT_CONFIRMED: <CheckCheck className="size-4" />,
  LOAN_CLOSED: <CreditCard className="size-4" />,
};

export default function CabinetDashboardPage() {
  const { user } = useAuth();

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({ queryKey: ['my-applications'], queryFn: getMyApplications });
  const { data: loans, isLoading: loansLoading, error: loansError } = useQuery({ queryKey: ['my-loans'], queryFn: getMyLoans });
  const { data: notifications, isLoading: notifsLoading, error: notifsError } = useQuery({ queryKey: ['my-notifications'], queryFn: getMyNotifications });

  const isLoading = appsLoading || loansLoading || notifsLoading;
  const error = appsError || loansError || notifsError;

  const pendingSignatures = loans?.filter((l) => l.status === 'PENDING_SIGNATURE') || [];
  const readyForSign = pendingSignatures[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">Не удалось загрузить данные. Попробуйте обновить страницу.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-on-surface)]">
            Добро пожаловать, {user?.fullName || user?.phone}.
          </h2>
          <p className="mt-1 text-base text-[var(--color-on-surface-variant)]">
            Ваш финансовый обзор на сегодня.
          </p>
        </div>
        <Link href="/cabinet/new-application">
          <Button className="gap-2 shadow-md">
            <Plus className="size-5" />Оформить новый займ
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {readyForSign && (
          <section className="md:col-span-12 rounded-xl bg-[var(--color-primary-container)] p-6 text-white shadow-sm">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Готов к подписанию
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-bold">Кредит на расширение бизнеса</h3>
              <p className="mb-4 text-5xl font-bold">€{readyForSign.principalAmount?.toLocaleString()}</p>
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase text-white/60">Ставка</p>
                  <p className="text-sm font-bold">{(readyForSign.dailyRate * 100).toFixed(1)}% в день</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-white/60">Сумма к возврату</p>
                  <p className="text-sm font-bold">€{Number(readyForSign.totalRepayment).toFixed(2)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs font-medium uppercase text-white/60">График</p>
                  <p className="text-sm font-bold">Ежедневно</p>
                </div>
              </div>
              <Link href={`/cabinet/loans/${readyForSign.id}`}>
                <Button className="gap-2 bg-white text-[var(--color-primary-container)] hover:bg-white/90">
                  Подписать и активировать <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        <div className="md:col-span-8 space-y-5">
          <div className="rounded-xl border border-black/20 bg-white">
            <div className="flex items-center justify-between border-b border-black/20 px-5 py-4">
              <h3 className="text-sm font-bold text-[var(--color-on-surface)]">Мои заявки</h3>
              <Link href="/cabinet/applications" className="text-xs font-medium text-[var(--color-secondary)] hover:underline">
                Все заявки
              </Link>
            </div>
            <div className="divide-y divide-black/20">
              {(applications || []).slice(0, 3).map((app) => (
                <Link key={app.id} href="/cabinet/applications" className="flex items-center justify-between px-5 py-3.5 transition hover:bg-[var(--color-surface-container-low)]">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-on-surface)]">{app.applicationNumber}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">€{app.amount?.toLocaleString()} · {app.termDays} дн.</p>
                  </div>
                  <span className="rounded bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {app.status === 'NEW' ? 'Новая' : app.status === 'IN_REVIEW' ? 'В работе' : app.status}
                  </span>
                </Link>
              ))}
              {(!applications || applications.length === 0) && (
                <div className="px-5 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">
                  У вас пока нет заявок
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-black/20 bg-white">
            <div className="flex items-center justify-between border-b border-black/20 px-5 py-4">
              <h3 className="text-sm font-bold text-[var(--color-on-surface)]">Мои кредиты</h3>
              <Link href="/cabinet/loans" className="text-xs font-medium text-[var(--color-secondary)] hover:underline">
                Все кредиты
              </Link>
            </div>
            <div className="divide-y divide-black/20">
              {(loans || []).slice(0, 3).map((loan) => (
                <Link key={loan.id} href={`/cabinet/loans/${loan.id}`} className="flex items-center justify-between px-5 py-3.5 transition hover:bg-[var(--color-surface-container-low)]">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-on-surface)]">{loan.loanNumber}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">€{loan.principalAmount?.toLocaleString()} · {loan.termDays} дн.</p>
                  </div>
                  <span className="rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {loan.status === 'ACTIVE' ? 'Активен' : loan.status === 'PENDING_SIGNATURE' ? 'Ожидает' : loan.status}
                  </span>
                </Link>
              ))}
              {(!loans || loans.length === 0) && (
                <div className="px-5 py-8 text-center text-sm text-[var(--color-on-surface-variant)]">
                  У вас пока нет кредитов
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-5">
          <div className="rounded-xl border border-black/20 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="size-4 text-black" />
              <h3 className="text-sm font-bold text-[var(--color-on-surface)]">Уведомления</h3>
            </div>
            <div className="divide-y divide-black/20">
              {(notifications || []).slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 py-3">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                    {NOTIFICATION_ICONS[notif.type] || <Bell className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[var(--color-on-surface)]">{notif.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-on-surface-variant)] line-clamp-1">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
            {(!notifications || notifications.length === 0) && (
              <p className="text-xs text-[var(--color-on-surface-variant)]">Новых уведомлений нет</p>
            )}
            <Link href="/cabinet/notifications" className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-secondary)] hover:underline">
              Все уведомления <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-black/20 bg-white p-5">
            <h3 className="mb-1 text-sm font-bold text-[var(--color-on-surface)]">Быстрая помощь</h3>
            <p className="mb-3 text-xs text-[var(--color-on-surface-variant)]">
              Часто задаваемые вопросы
            </p>
            <Link href="/faq" className="text-xs font-medium text-[var(--color-secondary)] hover:underline">Перейти в FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
