'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyNotifications, markNotificationRead, type Notification } from '@/shared/api/notifications';
import { Bell, CheckCheck, AlertCircle, CreditCard, FileText, DollarSign } from 'lucide-react';

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  APPLICATION_STATUS_CHANGED: FileText,
  LOAN_APPROVED: CreditCard,
  LOAN_SIGN_REQUIRED: AlertCircle,
  PAYMENT_REQUEST_UPDATED: DollarSign,
  PAYMENT_CONFIRMED: CheckCheck,
  LOAN_CLOSED: CreditCard,
};

function NotificationItem({ notif }: { notif: Notification }) {
  const queryClient = useQueryClient();
  const Icon = NOTIFICATION_ICONS[notif.type] || Bell;

  const markRead = useMutation({
    mutationFn: () => markNotificationRead(notif.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        notif.isRead
          ? 'border-black/20 bg-white'
          : 'border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
          notif.isRead ? 'bg-[var(--color-surface-container-low)]' : 'bg-[var(--color-secondary)]/10'
        }`}>
          <Icon className={`size-5 ${
            notif.isRead ? 'text-[var(--color-outline)]' : 'text-[var(--color-secondary)]'
          }`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm ${
              notif.isRead
                ? 'text-[var(--color-on-surface)]'
                : 'font-semibold text-[var(--color-on-surface)]'
            }`}>
              {notif.title}
            </p>
            <span className="shrink-0 text-xs text-[var(--color-outline)]">
              {new Date(notif.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            {notif.message}
          </p>
          {!notif.isRead && (
            <button
              onClick={() => markRead.mutate()}
              className="mt-2 text-xs font-medium text-[var(--color-secondary)] transition hover:text-[var(--color-secondary-container)]"
            >
              Отметить как прочитанное
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: getMyNotifications,
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Ошибка загрузки уведомлений</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">Уведомления</h1>
      {unreadCount > 0 && (
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
          {unreadCount} непрочитанных
        </p>
      )}

      {!notifications || notifications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/20 p-12 text-center">
          <Bell className="mx-auto size-10 text-[var(--color-outline)]" />
          <p className="mt-4 text-[var(--color-on-surface-variant)]">
            У вас пока нет уведомлений
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} />
          ))}
        </div>
      )}
    </div>
  );
}
