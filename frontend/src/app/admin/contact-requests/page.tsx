'use client';

import { useQuery } from '@tanstack/react-query';
import { MessagesSquare, Mail, Phone, FileText } from 'lucide-react';
import { adminGetContactRequests } from '@/shared/api/admin';

export default function AdminContactRequestsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-contact-requests'],
    queryFn: () => adminGetContactRequests(),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Обращения</h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Запросы с контактной формы сайта</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Ошибка загрузки обращений
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <MessagesSquare className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">Обращений пока нет</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((req) => (
            <div key={req.id} className="rounded-xl border border-black/20 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--color-on-surface)]">{req.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    {new Date(req.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[var(--color-on-surface-variant)]">
                  {req.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="size-3" />{req.email}
                    </span>
                  )}
                  {req.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3" />{req.phone}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{req.message}</p>
              {req.attachmentName && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
                  <FileText className="size-3" />
                  Вложение: {req.attachmentName}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {req.consentAccepted ? 'Согласие получено' : 'Согласие не указано'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
