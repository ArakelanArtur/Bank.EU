'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Bell, Plus, ArrowRight, Mail, MailOpen } from 'lucide-react';
import { adminGetNotifications, type AdminNotification } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

const NOTIFICATION_TYPES: Record<string, { label: string }> = {
  APPLICATION_STATUS_CHANGED: { label: 'Статус заявки изменён' },
  LOAN_APPROVED: { label: 'Кредит одобрен' },
  LOAN_SIGN_REQUIRED: { label: 'Требуется подписание' },
  LOAN_SIGNED: { label: 'Кредит подписан' },
  PAYMENT_REQUEST_UPDATED: { label: 'Статус платежа изменён' },
  PAYMENT_CONFIRMED: { label: 'Платёж подтверждён' },
  LOAN_CLOSED: { label: 'Кредит закрыт' },
};

export default function AdminNotificationsPage() {
  const { data: allNotifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => adminGetNotifications(),
  });

  const sorted = (allNotifications || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Уведомления</h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Все уведомления пользователей</p>
        </div>
        <Link href="/admin/notifications/create">
          <Button className="gap-2"><Plus className="size-4" />Создать уведомление</Button>
        </Link>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <Bell className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">Уведомлений пока нет</p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((notif) => {
            const typeInfo = NOTIFICATION_TYPES[notif.type] || { label: notif.type };
            return (
              <div
                key={notif.id}
                className={cn(
                  'rounded-xl border border-black/20 bg-white p-4 transition',
                  !notif.isRead && 'border-l-[3px] border-l-[var(--color-secondary)]',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                    notif.isRead ? 'bg-slate-100 text-slate-400' : 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]',
                  )}>
                    {notif.isRead ? <MailOpen className="size-4" /> : <Mail className="size-4 text-black" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-on-surface)]">{notif.title}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{(notif as any).user?.fullName || (notif as any).user?.phone}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[var(--color-surface-container-low)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-on-surface-variant)]">
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{notif.message}</p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)] opacity-60">
                      {new Date(notif.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
