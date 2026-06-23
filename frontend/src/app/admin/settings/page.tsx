'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Key, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { adminListOperators, adminCreateOperator, adminDeleteOperator } from '@/shared/api/admin';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const { data: operators, isLoading } = useQuery({
    queryKey: ['admin-operators'],
    queryFn: adminListOperators,
    enabled: admin?.role === 'ADMIN',
  });

  const createMutation = useMutation({
    mutationFn: () => adminCreateOperator({ login: newLogin, password: newPassword, name: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-operators'] });
      setShowForm(false);
      setNewLogin('');
      setNewPassword('');
      setNewName('');
      setFormError('');
      setActionMsg('Оператор создан');
      setTimeout(() => setActionMsg(''), 3000);
    },
    onError: (err) => setFormError(err instanceof ApiError ? err.message : 'Ошибка создания'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteOperator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-operators'] });
      setActionMsg('Оператор удалён');
      setTimeout(() => setActionMsg(''), 3000);
    },
    onError: (err) => setActionMsg(err instanceof ApiError ? 'Ошибка удаления' : ''),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newLogin || !newPassword || !newName) {
      setFormError('Заполните все поля');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Пароль должен быть минимум 6 символов');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">Настройки</h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Управление настройками системы</p>
      </div>

      <div className="rounded-xl border border-black/20 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
          <Shield className="size-4" />Администратор
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Имя</p>
            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{admin?.name}</p>
          </div>
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Логин</p>
            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{admin?.login}</p>
          </div>
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">Роль</p>
            <p className="text-sm font-semibold text-[var(--color-on-surface)]">
              {admin?.role === 'ADMIN' ? 'Администратор' : 'Оператор'}
            </p>
          </div>
        </div>
      </div>

      {admin?.role === 'ADMIN' && (
        <div className="mt-6 rounded-xl border border-black/20 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
              <Users className="size-4" />Операторы
            </h2>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="size-4" />Добавить
            </Button>
          </div>

          {actionMsg && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {actionMsg}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleCreate} className="mb-6 rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--color-on-surface)]">Новый оператор</p>
                <button onClick={() => { setShowForm(false); setFormError(''); }} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">Логин</label>
                  <input required value={newLogin} onChange={(e) => setNewLogin(e.target.value)}
                    placeholder="login@example.com"
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-secondary)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">Пароль</label>
                  <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="минимум 6 символов"
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-secondary)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-on-surface-variant)]">Имя</label>
                  <input required value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="Operator Name"
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-secondary)]" />
                </div>
              </div>
              {formError && <p className="mt-2 text-xs text-red-500">{formError}</p>}
              <Button type="submit" disabled={createMutation.isPending} className="mt-3">
                {createMutation.isPending ? 'Создание...' : 'Создать'}
              </Button>
            </form>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[var(--color-secondary)]" />
            </div>
          ) : operators && operators.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/20 text-left text-xs text-[var(--color-on-surface-variant)]">
                    <th className="pb-2 pr-4 font-medium">Имя</th>
                    <th className="pb-2 pr-4 font-medium">Логин</th>
                    <th className="pb-2 pr-4 font-medium">Статус</th>
                    <th className="pb-2 pr-4 font-medium">Создан</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20">
                  {operators.map((op) => (
                    <tr key={op.id}>
                      <td className="py-3 pr-4 font-medium text-[var(--color-on-surface)]">{op.name}</td>
                      <td className="py-3 pr-4 text-[var(--color-on-surface-variant)]">{op.login}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Активен
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-[var(--color-on-surface-variant)]">
                        {new Date(op.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => { if (confirm('Удалить оператора?')) deleteMutation.mutate(op.id); }}
                          className="rounded-lg p-2 text-[var(--color-on-surface-variant)] transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-[var(--color-on-surface-variant)]">
              Операторы не найдены
            </p>
          )}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-black/20 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-on-surface)]">
          <Key className="size-4" />Тестовые учётные данные
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4 text-sm">
            <p className="font-semibold text-[var(--color-on-surface)]">Администратор</p>
            <p className="mt-1 text-[var(--color-on-surface-variant)]">admin@lumenbridge.example / admin123</p>
          </div>
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4 text-sm">
            <p className="font-semibold text-[var(--color-on-surface)]">Оператор</p>
            <p className="mt-1 text-[var(--color-on-surface-variant)]">operator@lumenbridge.example / operator123</p>
          </div>
          <div className="rounded-lg border border-black/20 bg-[var(--color-surface-container-low)] p-4 text-sm">
            <p className="font-semibold text-[var(--color-on-surface)]">Пользователь (OTP)</p>
            <p className="mt-1 text-[var(--color-on-surface-variant)]">+1234567890 / Любой 4-значный код</p>
          </div>
        </div>
      </div>
    </div>
  );
}
