'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { calculateLoanTerms, formatCurrency } from '@/shared/lib/loan-calculator';
import { Section } from '@/shared/ui/section';
import { Button } from '@/shared/ui/button';

export function CalculatorSection() {
  const [amount, setAmount] = useState(30000);
  const [termDays, setTermDays] = useState(21);

  const calculation = useMemo(
    () => calculateLoanTerms(amount, termDays),
    [amount, termDays],
  );

  return (
    <Section className="py-16 sm:py-20" id="calculator">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">
          Калькулятор займа
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Примерный расчёт до отправки заявки
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-black/85 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                Сумма займа
              </label>
              <motion.span
                key={amount}
                initial={{ scale: 1.1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-[var(--color-on-surface)]"
              >
                {formatCurrency(amount)}
              </motion.span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={100}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                Срок
              </label>
              <motion.span
                key={termDays}
                initial={{ scale: 1.1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-[var(--color-on-surface)]"
              >
                {termDays} дней
              </motion.span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              step={1}
              value={termDays}
              onChange={(event) => setTermDays(Number(event.target.value))}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-4 rounded-xl border border-black/30 bg-[var(--color-surface-container-low)] p-4"
          >
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Переплата</p>
              <motion.p
                key={amount + '-' + termDays}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 text-lg font-bold text-[var(--color-on-surface)]"
              >
                {formatCurrency(calculation.totalRepayment - amount)}
              </motion.p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">К возврату</p>
              <motion.p
                key={amount + '-' + termDays}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 text-lg font-bold text-[var(--color-on-surface)]"
              >
                {formatCurrency(calculation.totalRepayment)}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          >
            <Button className="w-full" size="lg">
              Оформить
            </Button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          className="mt-4 text-xs leading-5 text-[var(--color-outline)]"
        >
          Расчёт предварительный. Итоговые условия зависят от проверки анкеты.
        </motion.p>
      </motion.div>
    </Section>
  );
}
