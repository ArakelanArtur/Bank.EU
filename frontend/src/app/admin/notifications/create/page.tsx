'use client';

import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, Bell } from 'lucide-react';
import { adminGetUsers, adminCreateNotification, type NotificationType, type AdminUserType } from '@/shared/api/admin';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

const NOTIFICATION_TYPE_OPTIONS: { value: NotificationType; label: string }[] = [
  { value: 'APPLICATION_STATUS_CHANGED', label: 'Статус заявки изменён' },
  { value: 'LOAN_APPROVED', label: 'Кредит одобрен' },
  { value: 'LOAN_SIGN_REQUIRED', label: 'Требуется подписание' },
  { value: 'PAYMENT_REQUEST_UPDATED', label: 'Статус платежа изменён' },
  { value: 'PAYMENT_CONFIRMED', label: 'Платёж подтверждён' },
  { value: 'LOAN_CLOSED', label: 'Кредит закрыт' },
];

export default function CreateNotificationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState('');
  const [type, setType] = useState<NotificationType>('APPLICATION_STATUS_CHANGED');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminGetUsers(),
  });

  const createMutation = useMutation({
    mutationFn: () => adminCreateNotification({ userId, type, title, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setUserId('');
      setTitle('');
      setMessage('');
      setError('');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Ошибка создания уведомления'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userId || !title || !message) {
      setError('Заполните все обязательные поля');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]">
        <ArrowLeft className="size-4" />Назад
      </button>

      <div className="mx-auto max-w-lg">
        <h1 className="mb-1 text-2xl font-bold text-[var(--color-on-surface)]">Создать уведомление</h1>
        <p className="mb-6 text-sm text-[var(--color-on-surface-variant)]">
          Отправить уведомление пользователю системы
        </p>

        <form onSubmit={handleSubmit} className="rounded-xl border border-black/20 bg-white p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {createMutation.isSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Уведомление успешно создано
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="user" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Получатель <span className="text-red-500">*</span>
            </label>
            <select
              id="user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            >
              <option value="">Выберите пользователя...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName || u.phone} — {u.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Тип уведомления <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as NotificationType)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            >
              {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Заголовок <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Статус заявки изменён"
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-[var(--color-on-surface)]">
              Сообщение <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Текст уведомления..."
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <Button type="submit" disabled={createMutation.isPending} className="w-full gap-2">
            {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {createMutation.isPending ? 'Отправка...' : 'Отправить уведомление'}
          </Button>
        </form>
      </div>
    </div>
  );
}
