'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Section } from '@/shared/ui/section';

const BUSINESS_INFO = [
  ['Сумма', 'от 30,000 до 500,000 EUR'],
  ['Срок', 'от 1 до 12 месяцев'],
  ['Залог', 'не требуется'],
  ['Рассмотрение', 'быстрое'],
];

export function BusinessTeaserSection() {
  return (
    <Section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mx-auto flex size-14 items-center justify-center rounded-2xl border-2 border-black bg-[var(--color-secondary)]/10 text-black"
        >
          <Briefcase className="size-7" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Финансирование для бизнеса
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Решения для компаний и предпринимателей, которым важна скорость и
          предсказуемость.
        </p>
      </motion.div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BUSINESS_INFO.map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
            className="rounded-2xl border border-black/20 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-sm text-[var(--color-on-surface-variant)]">{label}</p>
            <p className="mt-2 text-lg font-bold text-[var(--color-on-surface)]">{value}</p>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]"
      >
        На данный момент заявки принимаются через форму обратной связи.
        Онлайн-кабинет для бизнеса будет доступен позже.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        className="mt-6 text-center"
      >
        <Link href="/business">
          <Button variant="secondary">Подробнее о финансировании для бизнеса</Button>
        </Link>
      </motion.div>
    </Section>
  );
}
