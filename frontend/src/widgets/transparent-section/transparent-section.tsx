'use client';

import { motion } from 'motion/react';
import { Section } from '@/shared/ui/section';

const POINTS = [
  {
    title: 'Никаких скрытых комиссий',
    text: 'Полная стоимость займа известна до оформления',
  },
  {
    title: 'Быстрое рассмотрение',
    text: 'Заявки обрабатываются в течение нескольких минут',
  },
  {
    title: 'Безопасность данных',
    text: 'Ваши данные защищены современными технологиями',
  },
  {
    title: 'Гибкое погашение',
    text: 'Выбирайте удобный срок и погашайте без лишнего давления',
  },
  {
    title: 'Улучшение условий со временем',
    text: 'При повторных займах могут быть доступны более выгодные параметры',
  },
  {
    title: 'Прозрачность',
    text: 'Вы заранее знаете все условия сотрудничества',
  },
];

export function TransparentSection() {
  return (
    <Section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Вы заранее знаете все условия
        </h2>
      </motion.div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
            className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
          >
            <h3 className="text-base font-bold text-[var(--color-on-surface)]">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
              {point.text}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
