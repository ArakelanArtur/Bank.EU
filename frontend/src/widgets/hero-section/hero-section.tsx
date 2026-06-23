'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldCheck, Unlock, Zap, Banknote } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Section } from '@/shared/ui/section';

const HERO_FEATURES = [
  { icon: Unlock, text: 'Без залога' },
  { icon: Zap, text: 'Быстрое одобрение' },
  { icon: Banknote, text: 'Выплата на банковский счёт' },
];

const HERO_STATS = [
  { value: '97%', label: 'заявок онлайн' },
  { value: '0 ₽', label: 'комиссий за выдачу' },
];

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden pt-6 sm:pt-8 pb-16 sm:pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent"
      />
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] shadow-sm backdrop-blur">
              <ShieldCheck className="size-[18px] text-green-600" />
              Лицензированный сервис • данные защищены
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight leading-tight text-[var(--color-on-surface)] sm:text-5xl lg:text-6xl">
              Получите деньги тогда, когда это действительно нужно
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
              Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление
            </p>
            <p className="max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
              Неожиданные расходы или срочные возможности не должны вас останавливать.
              Сервис помогает быстро получить финансирование — без сложных процедур и скрытых условий.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
              <Link href="/register">
                <Button size="lg" className="min-w-44">Получить займ</Button>
              </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            {HERO_FEATURES.map((feature, i) => (
              <motion.span
                key={feature.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white/70 px-4 py-2 text-sm text-[var(--color-on-surface-variant)]"
              >
                <feature.icon className="size-3.5 text-green-600" />
                {feature.text}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-8 pt-2"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
              >
                <motion.p
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.1,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 100,
                  }}
                  className="text-3xl font-bold text-[var(--color-on-surface)]"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="rounded-2xl border-2 border-black/85 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                Быстрый обзор продукта
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--color-on-surface)]">
                Финансовый сервис нового поколения
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Для частных лиц', value: 'от 500 до 50,000 EUR' },
                { label: 'Для бизнеса', value: 'от 30,000 до 500,000 EUR' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease: 'easeOut' }}
                  className="rounded-xl border border-black/30 bg-[var(--color-surface-container-low)] p-5"
                >
                  <p className="text-sm text-[var(--color-on-surface-variant)]">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-[var(--color-on-surface)]">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
              className="mt-4 rounded-xl border border-black/30 bg-[var(--color-surface-container-low)] p-4 text-sm leading-6 text-[var(--color-on-surface-variant)]"
            >
              Все условия отображаются заранее, а оформление занимает всего несколько минут и проходит полностью онлайн.
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
