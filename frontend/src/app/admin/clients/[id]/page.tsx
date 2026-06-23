'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Building2, UserCheck, FileText, CreditCard, Bell } from 'lucide-react';
import { adminGetUser } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';

const APP_STATUS_MAP: Record<string, string> = {
  NEW: 'Новая',
  IN_REVIEW: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
};

const LOAN_STATUS_MAP: Record<string, string> = {
  PENDING_SIGNATURE: 'Ожидает подписания',
  ACTIVE: 'Активен',
  OVERDUE: 'Просрочен',
  CLOSED: 'Закрыт',
  REJECTED: 'Отклонён',
};

export default function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminGetUser(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Клиент не найден
      </div>
    );
  }

  const activeLoans = user.loans?.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE') || [];
  const closedLoans = user.loans?.filter((l) => l.status === 'CLOSED') || [];

  return (
    <div>
      <Link
        href="/admin/clients"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]"
      >
        <ArrowLeft className="size-4" />К списку клиентов
      </Link>

      <div className="mb-6 rounded-xl border border-black/20 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xl font-bold text-white">
              {user.fullName?.[0] || user.phone[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">
                {user.fullName || 'Без имени'}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                <span className="inline-flex items-center gap-1"><Phone className="size-3" />{user.phone}</span>
                {user.email && <span className="inline-flex items-center gap-1"><Mail className="size-3" />{user.email}</span>}
                {user.businessProfile?.companyName && (
                  <span className="inline-flex items-center gap-1"><Building2 className="size-3" />{user.businessProfile.companyName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <UserCheck className="size-3" />Верифицирован
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Не верифицирован
              </span>
            )}
            <span className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-xs font-medium">
              {user.userType === 'BUSINESS' ? 'Бизнес' : 'Физ. лицо'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/20 bg-white p-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Всего заявок</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-on-surface)]">{user.applications?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-black/20 bg-white p-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Активные займы</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{activeLoans.length}</p>
        </div>
        <div className="rounded-xl border border-black/20 bg-white p-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Закрытые займы</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-on-surface)]">{closedLoans.length}</p>
        </div>
      </div>

      {user.applications && user.applications.length > 0 && (
        <div className="mb-6 rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
            <FileText className="size-4" />Заявки
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-xs text-[var(--color-on-surface-variant)]">
                  <th className="pb-2 pr-4 font-medium">Номер</th>
                  <th className="pb-2 pr-4 font-medium">Сумма</th>
                  <th className="pb-2 pr-4 font-medium">Срок</th>
                  <th className="pb-2 pr-4 font-medium">Статус</th>
                  <th className="pb-2 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {user.applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-secondary)]">
                      <Link href={`/admin/applications/${app.id}`} className="hover:underline">
                        {app.applicationNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">€{Number(app.amount).toLocaleString()}</td>
                    <td className="py-2.5 pr-4">{app.termDays} дн.</td>
                    <td className="py-2.5 pr-4">
                      <span className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        app.status === 'NEW' && 'bg-slate-50 text-slate-600',
                        app.status === 'IN_REVIEW' && 'bg-amber-50 text-amber-700',
                        app.status === 'APPROVED' && 'bg-emerald-50 text-emerald-700',
                        app.status === 'REJECTED' && 'bg-red-50 text-red-600',
                      )}>
                        {APP_STATUS_MAP[app.status]}
                      </span>
                    </td>
                    <td className="py-2.5 text-[var(--color-on-surface-variant)]">
                      {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user.loans && user.loans.length > 0 && (
        <div className="mb-6 rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
            <CreditCard className="size-4" />Займы
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-xs text-[var(--color-on-surface-variant)]">
                  <th className="pb-2 pr-4 font-medium">Номер</th>
                  <th className="pb-2 pr-4 font-medium">Сумма</th>
                  <th className="pb-2 pr-4 font-medium">Срок</th>
                  <th className="pb-2 pr-4 font-medium">Платёж</th>
                  <th className="pb-2 pr-4 font-medium">Статус</th>
                  <th className="pb-2 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {user.loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-secondary)]">
                      <Link href={`/admin/loans/${loan.id}`} className="hover:underline">
                        {loan.loanNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">€{Number(loan.principalAmount).toLocaleString()}</td>
                    <td className="py-2.5 pr-4">{loan.termDays} дн.</td>
                    <td className="py-2.5 pr-4">€{Number(loan.annuityPayment).toFixed(2)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        (loan.status === 'ACTIVE') && 'bg-emerald-50 text-emerald-700',
                        loan.status === 'PENDING_SIGNATURE' && 'bg-amber-50 text-amber-700',
                        loan.status === 'OVERDUE' && 'bg-red-50 text-red-700',
                        loan.status === 'CLOSED' && 'bg-slate-50 text-slate-600',
                        loan.status === 'REJECTED' && 'bg-red-50 text-red-600',
                      )}>
                        {LOAN_STATUS_MAP[loan.status]}
                      </span>
                    </td>
                    <td className="py-2.5 text-[var(--color-on-surface-variant)]">
                      {new Date(loan.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user.paymentRequests && user.paymentRequests.length > 0 && (
        <div className="mb-6 rounded-xl border border-black/20 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-[var(--color-on-surface)]">Запросы на оплату</h2>
          <div className="space-y-2">
            {user.paymentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-container-low)] p-3 text-sm">
                <div>
                  <span className="font-medium">€{Number(req.amount).toLocaleString()}</span>
                  <span className="ml-2 text-[var(--color-on-surface-variant)]">{req.reference}</span>
                </div>
                <span className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  req.status === 'PENDING_REVIEW' && 'bg-amber-50 text-amber-700',
                  req.status === 'APPROVED' && 'bg-emerald-50 text-emerald-700',
                  req.status === 'REJECTED' && 'bg-red-50 text-red-600',
                )}>
                  {req.status === 'PENDING_REVIEW' ? 'Ожидает' : req.status === 'APPROVED' ? 'Одобрен' : 'Отклонён'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!user.applications || user.applications.length === 0) && (!user.loans || user.loans.length === 0) && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <Building2 className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            У клиента пока нет заявок и займов
          </p>
        </div>
      )}
    </div>
  );
}
