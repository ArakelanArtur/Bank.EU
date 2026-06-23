'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Send, ShieldCheck, StickyNote, Clock, History } from 'lucide-react';
import { adminGetApplication, adminUpdateApplicationStatus, adminAddApplicationNote, type AdminApplication, type ApplicationStatus } from '@/shared/api/admin';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  NEW: { label: 'Новая', bg: 'bg-blue-50', text: 'text-blue-700' },
  IN_REVIEW: { label: 'В работе', bg: 'bg-amber-50', text: 'text-amber-700' },
  APPROVED: { label: 'Одобрена', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  REJECTED: { label: 'Отклонена', bg: 'bg-red-50', text: 'text-red-700' },
};

const STATUS_FLOW: ApplicationStatus[] = ['NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED'];

function Timeline({ app }: { app: AdminApplication }) {
  const events = [
    { status: 'NEW', label: 'Создана', desc: 'Заявка подана через ' + (app.source === 'CABINET' ? 'личный кабинет' : 'сайт'), time: app.createdAt, icon: Clock, done: true },
    { status: 'IN_REVIEW', label: 'В работе', desc: 'Заявка принята оператором к рассмотрению', time: app.notes?.find(() => true)?.createdAt || app.updatedAt, icon: StickyNote, done: app.status !== 'NEW' },
    { status: 'APPROVED', label: 'Решение', desc: 'Финальное решение по заявке', time: app.updatedAt, icon: CheckCircle, done: app.status === 'APPROVED' || app.status === 'REJECTED' },
  ];

  const currentIdx = events.findIndex((e) => e.status === app.status);
  const activeIdx = currentIdx >= 0 ? currentIdx : (app.status === 'REJECTED' ? 2 : 0);

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 h-full w-0.5 bg-black/20" />
      <div className="space-y-8">
        {events.map((event, i) => {
          const Icon = event.icon;
          const isActive = i <= activeIdx;
          const isLast = i === events.length - 1;
          return (
            <div key={event.status} className="relative flex items-start gap-6">
              <div className={cn(
                'relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full',
                isActive ? 'bg-emerald-500 text-white' : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]',
              )}>
                <Icon className="size-5" />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between">
                  <p className={cn('text-sm font-bold', isActive ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-variant)]')}>
                    {event.label}
                  </p>
                  {event.time && (
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {new Date(event.time).toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-[var(--color-on-surface-variant)]">{event.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = useState('');
  const [actionError, setActionError] = useState('');

  const { data: app, isLoading, error } = useQuery({
    queryKey: ['admin-application', id],
    queryFn: () => adminGetApplication(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, note }: { status: ApplicationStatus; note?: string }) =>
      adminUpdateApplicationStatus(id, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-application', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setActionError('');
    },
    onError: (err) => setActionError(err instanceof ApiError ? err.message : 'Ошибка обновления статуса'),
  });

  const noteMutation = useMutation({
    mutationFn: (content: string) => adminAddApplicationNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-application', id] });
      setNoteContent('');
    },
    onError: (err) => setActionError(err instanceof ApiError ? err.message : 'Ошибка добавления заметки'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Заявка не найдена
      </div>
    );
  }

  const badge = STATUS_BADGES[app.status] || { label: app.status, bg: 'bg-slate-50', text: 'text-slate-700' };
  const isPending = app.status === 'NEW' || app.status === 'IN_REVIEW';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center text-[var(--color-on-surface-variant)] transition hover:text-[var(--color-on-surface)]">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">{app.applicationNumber}</h1>
              <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider', badge.bg, badge.text)}>{badge.label}</span>
              {app.user?.fullName && (
                <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]')}>
                  {app.user.fullName}
                </span>
              )}
            </div>
          </div>
        </div>
        {isPending && (
          <div className="hidden gap-3 md:flex">
            <Button variant="ghost" onClick={() => statusMutation.mutate({ status: 'IN_REVIEW' })} disabled={statusMutation.isPending} className="border border-[var(--color-outline)]">
              Взять в работу
            </Button>
            <Button variant="ghost" onClick={() => statusMutation.mutate({ status: 'REJECTED', note: actionError || undefined })} disabled={statusMutation.isPending} className="border border-red-200 text-red-600 hover:bg-red-50">
              <XCircle className="mr-2 size-4" />Отклонить
            </Button>
            <Button onClick={() => statusMutation.mutate({ status: 'APPROVED' })} disabled={statusMutation.isPending}>
              <CheckCircle className="mr-2 size-4" />Одобрить
            </Button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</div>
      )}

      {isPending && (
        <div className="mb-6 flex gap-3 md:hidden">
          <Button variant="secondary" onClick={() => statusMutation.mutate({ status: 'IN_REVIEW' })} disabled={statusMutation.isPending} className="text-xs px-3 py-2">
            В работу
          </Button>
          <Button variant="ghost" onClick={() => statusMutation.mutate({ status: 'REJECTED' })} disabled={statusMutation.isPending} className="text-xs px-3 py-2">
            Отклонить
          </Button>
          <Button onClick={() => statusMutation.mutate({ status: 'APPROVED' })} disabled={statusMutation.isPending} className="text-xs px-3 py-2">
            Одобрить
          </Button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="rounded-xl border border-black/20 bg-white p-6 transition hover:shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--color-on-surface)]">Информация о заявителе</h2>
              <ShieldCheck className="size-5 text-[var(--color-outline-variant)]" />
            </div>
            <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">ФИО</p>
                <p className="text-base text-[var(--color-on-surface)]">{app.user?.fullName || '—'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Телефон</p>
                <p className="text-base text-[var(--color-on-surface)]">{app.phone}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Email</p>
                <p className="text-base text-[var(--color-on-surface)]">{app.email || '—'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Тип</p>
                <p className="text-base text-[var(--color-on-surface)]">{app.applicantType === 'BUSINESS' ? 'Юридическое лицо' : 'Физическое лицо'}</p>
              </div>
              {app.companyName && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Компания</p>
                  <p className="text-base text-[var(--color-on-surface)]">{app.companyName}</p>
                </div>
              )}
              {app.registrationNumber && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">Рег. номер</p>
                  <p className="text-base text-[var(--color-on-surface)]">{app.registrationNumber}</p>
                </div>
              )}
            </div>
            <hr className="mb-6 border-black/20" />
            <div>
              <h3 className="mb-4 text-sm font-bold text-[var(--color-on-surface)]">Параметры займа</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg border border-black/20 bg-[var(--color-surface-muted)] p-4">
                <div>
                  <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">Запрашиваемая сумма</p>
                  <p className="text-xl font-bold text-[var(--color-on-surface)]">€{Number(app.amount)?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">Срок</p>
                  <p className="text-xl font-bold text-[var(--color-on-surface)]">{app.termDays} дн.</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">Ставка</p>
                  <p className="text-xl font-bold text-[var(--color-on-surface)]">{(app.dailyRate * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/20 bg-white p-6">
            <h2 className="mb-8 text-lg font-bold text-[var(--color-on-surface)]">Activity Timeline</h2>
            <Timeline app={app} />
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-black/20 bg-[var(--color-primary-container)] p-6 text-white shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4" />Internal Risk Assessment
            </h2>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Risk Score</p>
                <p className="text-[42px] font-bold leading-none">
                  {app.status === 'APPROVED' ? 'A' : app.status === 'REJECTED' ? 'C' : 'B'}
                  <span className="text-lg text-white/60">+</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">KYC Status</p>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="size-4" />
                  <p className="text-sm font-bold">Verified</p>
                </div>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white/60"
                style={{ width: app.status === 'APPROVED' ? '92%' : app.status === 'REJECTED' ? '30%' : '65%' }}
              />
            </div>
            <p className="mt-3 text-center text-xs italic text-white/50">
              Score updated based on application data
            </p>
          </div>

          <div className="rounded-xl border border-black/20 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
              <MessageSquare className="size-4" />Заметки оператора
            </h2>
            {app.notes && app.notes.length > 0 && (
              <div className="mb-4 space-y-3">
                {app.notes.map((note) => (
                  <div key={note.id} className="rounded-lg bg-[var(--color-surface-muted)] p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--color-secondary)]">{note.adminUser?.name || 'Оператор'}</span>
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
                        {new Date(note.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-on-surface)]">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Оставьте заметку..."
              rows={4}
              className="w-full resize-none rounded-lg border border-black/20 bg-[var(--color-surface-muted)] p-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
            <Button
              onClick={() => noteMutation.mutate(noteContent)}
              disabled={!noteContent.trim() || noteMutation.isPending}
              className="mt-3 w-full gap-2"
            >
              <Send className="size-4" />
              {noteMutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>

          {(app as any).loan && (
            <div className="rounded-xl border border-black/20 bg-white p-6">
              <h2 className="mb-2 text-sm font-bold text-[var(--color-on-surface)]">Связанный кредит</h2>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                После одобрения был создан кредит.{' '}
                <Link href={`/admin/loans/${(app as any).loan.id}`} className="text-[var(--color-secondary)] underline">
                  Перейти
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
