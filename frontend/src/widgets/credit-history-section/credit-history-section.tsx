'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Section } from '@/shared/ui/section';

const BENEFITS = [
  'Возможность начать с небольшой суммы',
  'Формирование положительной кредитной истории',
  'Доступ к увеличенным лимитам при повторных обращениях',
];

export function CreditHistorySection() {
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
          className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600"
        >
          <TrendingUp className="size-7" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Займ — это не только деньги сейчас
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Своевременное погашение займа помогает улучшить кредитный рейтинг и
          открывает доступ к более выгодным условиям в будущем.
        </p>
      </motion.div>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
        className="mx-auto mt-8 max-w-lg space-y-4 text-left"
      >
        {BENEFITS.map((item) => (
          <motion.li
            key={item}
            variants={{
              hidden: { opacity: 0, x: -16 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center gap-3 text-[var(--color-on-surface-variant)]"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
              className="size-2 rounded-full bg-emerald-400"
            />
            {item}
          </motion.li>
        ))}
      </motion.ul>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        className="mt-8 text-center"
      >
        <Link href="/register">
          <Button size="lg">Начать с небольшого займа</Button>
        </Link>
      </motion.div>
    </Section>
  );
}
