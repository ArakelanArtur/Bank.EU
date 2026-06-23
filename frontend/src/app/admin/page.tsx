'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FileText, CreditCard, HandCoins, Users, ArrowRight, TrendingUp, Activity, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { adminGetApplications, adminGetLoans, adminGetPaymentRequests, type AdminApplication, type AdminLoan, type AdminPaymentRequest } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  NEW: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  IN_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CLOSED: { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-500' },
  OVERDUE: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  PENDING_SIGNATURE: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] || { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-500' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', s.bg, s.text)}>
      <span className={cn('size-1.5 rounded-full', s.dot)} />
      {status === 'NEW' && 'Новая'}
      {status === 'IN_REVIEW' && 'В работе'}
      {status === 'APPROVED' && 'Одобрена'}
      {status === 'REJECTED' && 'Отклонена'}
      {status === 'PENDING_SIGNATURE' && 'Ожидает'}
      {status === 'ACTIVE' && 'Активен'}
      {status === 'CLOSED' && 'Закрыт'}
      {status === 'OVERDUE' && 'Просрочен'}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, href, accent }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; href: string; accent: string }) {
  return (
    <Link href={href} className="group rounded-xl border border-black/20 bg-white p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-on-surface)]">{value}</p>
        </div>
        <div className={cn('flex size-12 items-center justify-center rounded-xl', accent)}>
          <Icon className="size-6 text-black" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-secondary)] opacity-0 transition group-hover:opacity-100">
        Подробнее <ArrowRight className="size-3" />
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({ queryKey: ['admin-applications'], queryFn: () => adminGetApplications() });
  const { data: loans, isLoading: loansLoading, error: loansError } = useQuery({ queryKey: ['admin-loans'], queryFn: () => adminGetLoans() });
  const { data: paymentRequests, isLoading: prLoading, error: prError } = useQuery({ queryKey: ['admin-payment-requests'], queryFn: () => adminGetPaymentRequests() });

  if (appsLoading || loansLoading || prLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--color-secondary)]" />
      </div>
    );
  }

  if (appsError || loansError || prError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto size-12 text-red-500" />
          <p className="mt-4 text-lg font-semibold text-[var(--color-on-surface)]">Ошибка загрузки данных</p>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Не удалось загрузить данные для дашборда. Попробуйте обновить страницу.</p>
        </div>
      </div>
    );
  }

  const newApps = applications?.filter((a) => a.status === 'NEW') || [];
  const inReviewApps = applications?.filter((a) => a.status === 'IN_REVIEW') || [];
  const approvedApps = applications?.filter((a) => a.status === 'APPROVED') || [];
  const activeLoans = loans?.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE') || [];
  const overdueLoans = loans?.filter((l) => l.status === 'OVERDUE') || [];
  const pendingPayments = paymentRequests?.filter((p) => p.status === 'PENDING_REVIEW') || [];

  const isEmpty = !applications?.length && !loans?.length && !paymentRequests?.length;

  if (isEmpty) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
            Добро пожаловать, {admin?.name}
          </h1>
          <p className="mt-1 text-base text-[var(--color-on-surface-variant)]">
            Панель управления — пока нет данных
          </p>
        </div>
        <div className="flex min-h-[40vh] items-center justify-center rounded-xl border-2 border-dashed border-black/20 bg-white">
          <div className="text-center">
            <FileText className="mx-auto size-12 text-[var(--color-on-surface-variant)]" />
            <p className="mt-4 text-lg font-semibold text-[var(--color-on-surface)]">Нет данных</p>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Заявки, кредиты и платежи появятся здесь после начала работы</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
          Добро пожаловать, {admin?.name}
        </h1>
        <p className="mt-1 text-base text-[var(--color-on-surface-variant)]">
          Панель управления — {applications?.length || 0} активных заявок, {activeLoans.length} кредитов в работе
        </p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Новых заявок" value={newApps.length} icon={FileText} href="/admin/applications?status=NEW" accent="bg-blue-600" />
        <StatCard title="На рассмотрении" value={inReviewApps.length} icon={Activity} href="/admin/applications?status=IN_REVIEW" accent="bg-amber-600" />
        <StatCard title="Активных кредитов" value={activeLoans.length} icon={TrendingUp} href="/admin/loans?status=ACTIVE" accent="bg-emerald-600" />
        <StatCard title="Ожидают платежа" value={pendingPayments.length} icon={HandCoins} href="/admin/payments" accent="bg-violet-600" />
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Просроченных кредитов" value={overdueLoans.length} icon={CreditCard} href="/admin/loans?status=OVERDUE" accent="bg-red-600" />
        <StatCard title="Одобренных заявок" value={approvedApps.length} icon={ShieldCheck} href="/admin/applications?status=APPROVED" accent="bg-[var(--color-secondary)]" />
        <StatCard title="Всего заявок" value={applications?.length || 0} icon={FileText} href="/admin/applications" accent="bg-slate-700" />
        <StatCard title="Всего пользователей" value={new Set([...(applications || []).map((a) => a.userId)]).size} icon={Users} href="/admin/clients" accent="bg-slate-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/20 bg-white">
          <div className="flex items-center justify-between border-b border-black/20 px-6 py-4">
            <h2 className="text-sm font-bold text-[var(--color-on-surface)]">Последние заявки</h2>
            <Link href="/admin/applications" className="text-xs font-medium text-[var(--color-secondary)] hover:underline">Все заявки</Link>
          </div>
          <div className="divide-y divide-black/20">
            {(applications || []).slice(0, 5).map((app) => (
              <Link key={app.id} href={`/admin/applications/${app.id}`} className="flex items-center justify-between px-6 py-3.5 transition hover:bg-[var(--color-surface-container-low)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--color-on-surface)]">{app.applicationNumber}</p>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">€{Number(app.amount)?.toLocaleString()}</span>
                  </div>
                  <p className="truncate text-xs text-[var(--color-on-surface-variant)]">{app.user?.fullName || app.phone}</p>
                </div>
                <Badge status={app.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/20 bg-white">
          <div className="flex items-center justify-between border-b border-black/20 px-6 py-4">
            <h2 className="text-sm font-bold text-[var(--color-on-surface)]">Последние кредиты</h2>
            <Link href="/admin/loans" className="text-xs font-medium text-[var(--color-secondary)] hover:underline">Все кредиты</Link>
          </div>
          <div className="divide-y divide-black/20">
            {(loans || []).slice(0, 5).map((loan) => (
              <Link key={loan.id} href={`/admin/loans/${loan.id}`} className="flex items-center justify-between px-6 py-3.5 transition hover:bg-[var(--color-surface-container-low)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--color-on-surface)]">{loan.loanNumber}</p>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">€{Number(loan.principalAmount)?.toLocaleString()}</span>
                  </div>
                  <p className="truncate text-xs text-[var(--color-on-surface-variant)]">{loan.user?.fullName || ''}</p>
                </div>
                <Badge status={loan.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
