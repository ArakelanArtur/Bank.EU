'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Users, Phone, Mail, Building2, UserCheck, ArrowUpRight, Trash2, Loader2 } from 'lucide-react';
import { adminGetUsers, adminDeleteUser, type AdminUserType } from '@/shared/api/admin';

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminGetUsers(search || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Клиенты</h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Управление пользователями системы</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону, email..."
            className="w-full rounded-lg border border-black/20 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-secondary)] border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Ошибка загрузки клиентов
        </div>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/20 p-12 text-center">
          <Users className="mx-auto mb-3 size-10 text-[var(--color-on-surface-variant)] opacity-40" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            {search ? 'Ничего не найдено' : 'Клиентов пока нет'}
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-black/20 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/20 bg-[var(--color-surface-container-low)]">
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Клиент</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Телефон</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Email</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Тип</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Статус</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]">Регистрация</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold text-[var(--color-on-surface)]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/20">
              {data.map((user) => (
                <tr key={user.id} className="transition hover:bg-[var(--color-surface-container-low)]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/clients/${user.id}`} className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xs font-semibold text-white">
                        {user.fullName?.[0] || user.phone[0]}
                      </div>
                      <div>
                        <p className="flex items-center gap-1 font-semibold text-[var(--color-on-surface)]">
                          {user.fullName || '—'}
                          <ArrowUpRight className="size-3 text-[var(--color-on-surface-variant)] opacity-0 transition group-hover:opacity-100" />
                        </p>
                        {user.businessProfile?.companyName && (
                          <p className="text-xs text-[var(--color-on-surface-variant)]">{user.businessProfile.companyName}</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-on-surface)]">{user.phone}</td>
                  <td className="px-5 py-4 text-[var(--color-on-surface-variant)]">{user.email || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-xs font-medium">
                      {user.userType === 'BUSINESS' ? 'Бизнес' : 'Физ. лицо'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <UserCheck className="size-3" />Верифицирован
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        Не верифицирован
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--color-on-surface-variant)]">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { if (confirm('Удалить клиента ' + (user.fullName || user.phone) + '? Это действие необратимо.')) deleteMutation.mutate(user.id); }}
                      disabled={deleteMutation.isPending && deleteMutation.variables === user.id}
                      className="rounded-lg p-2 text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Удалить клиента"
                    >
                      {deleteMutation.isPending && deleteMutation.variables === user.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
