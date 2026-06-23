'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getMyLoans, type Loan } from '@/shared/api/loans';
import { CreditCard, ChevronRight } from 'lucide-react';

type Tab = 'active' | 'closed';

function LoanCard({ loan }: { loan: Loan }) {
  const isActive = loan.status === 'ACTIVE' || loan.status === 'OVERDUE' || loan.status === 'PENDING_SIGNATURE';

  return (
    <Link href={`/cabinet/loans/${loan.id}`}>
      <div className="rounded-xl border border-black/20 bg-white p-5 transition hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10">
              <CreditCard className="size-5 text-[var(--color-secondary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-on-surface)]">
                {loan.loanNumber}
              </p>
              <p className="text-xs text-[var(--color-outline)]">
                от {new Date(loan.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          <ChevronRight className="size-5 text-[var(--color-outline)]" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--color-on-surface-variant)]">Сумма: </span>
            <span className="font-semibold text-[var(--color-on-surface)]">
              €{Number(loan.principalAmount).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[var(--color-on-surface-variant)]">Платёж: </span>
            <span className="font-semibold text-[var(--color-on-surface)]">
              €{Number(loan.annuityPayment).toLocaleString()}
            </span>
          </div>
          {isActive && loan.paymentSchedule.length > 0 && (
            <div>
              <span className="text-[var(--color-on-surface-variant)]">След. платёж: </span>
              <span className="font-semibold text-[var(--color-on-surface)]">
                {new Date(loan.paymentSchedule[0].dueDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
          )}
          <div>
            <span className="text-[var(--color-on-surface-variant)]">Статус: </span>
            <span className={`font-semibold ${
              loan.status === 'ACTIVE' ? 'text-emerald-600' :
              loan.status === 'OVERDUE' ? 'text-red-600' :
              loan.status === 'CLOSED' ? 'text-[var(--color-on-surface-variant)]' :
              'text-amber-600'
            }`}>
              {loan.status === 'PENDING_SIGNATURE' ? 'Ожидает подписания' :
               loan.status === 'ACTIVE' ? 'Активен' :
               loan.status === 'OVERDUE' ? 'Просрочен' :
               loan.status === 'CLOSED' ? 'Закрыт' :
               loan.status === 'REJECTED' ? 'Отклонён' : loan.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LoansPage() {
  const [tab, setTab] = useState<Tab>('active');

  const { data: loans, isLoading, error } = useQuery({
    queryKey: ['my-loans'],
    queryFn: getMyLoans,
  });

  const activeLoans = loans?.filter(
    (l) => l.status === 'ACTIVE' || l.status === 'OVERDUE' || l.status === 'PENDING_SIGNATURE'
  ) ?? [];

  const closedLoans = loans?.filter(
    (l) => l.status === 'CLOSED'
  ) ?? [];

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
        <p className="text-red-600">Ошибка загрузки займов</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">Мои займы</h1>

      <div className="mt-4 flex gap-2 rounded-xl border border-black/20 bg-white p-1">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            tab === 'active'
              ? 'bg-[var(--color-secondary)] text-white'
              : 'text-[var(--color-on-surface-variant)]'
          }`}
        >
          Активные ({activeLoans.length})
        </button>
        <button
          onClick={() => setTab('closed')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            tab === 'closed'
              ? 'bg-[var(--color-secondary)] text-white'
              : 'text-[var(--color-on-surface-variant)]'
          }`}
        >
          Закрытые ({closedLoans.length})
        </button>
      </div>

      {tab === 'active' && (
        activeLoans.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-black/20 p-12 text-center">
            <CreditCard className="mx-auto size-10 text-[var(--color-outline)]" />
            <p className="mt-4 text-[var(--color-on-surface-variant)]">
              У вас нет активных займов
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {activeLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )
      )}

      {tab === 'closed' && (
        closedLoans.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-black/20 p-12 text-center">
            <CreditCard className="mx-auto size-10 text-[var(--color-outline)]" />
            <p className="mt-4 text-[var(--color-on-surface-variant)]">
              У вас нет закрытых займов
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {closedLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
