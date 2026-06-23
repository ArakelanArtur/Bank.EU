'use client';

import { motion } from 'motion/react';
import { Shield, Scale, Lock, FileCheck } from 'lucide-react';
import { Section } from '@/shared/ui/section';

const ITEMS = [
  { icon: Scale, text: 'Соответствие требованиям GDPR' },
  { icon: FileCheck, text: 'Ответственный подход к проверке заявок' },
  { icon: Lock, text: 'Защита персональных данных' },
  { icon: Shield, text: 'Чёткие и понятные условия' },
];

export function TrustSection() {
  return (
    <Section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Работаем прозрачно и в рамках закона
        </h2>
      </motion.div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-black/20 bg-white p-6 text-center shadow-sm"
          >
            <div className="flex size-12 items-center justify-center rounded-xl border-2 border-black bg-[var(--color-secondary)]/10 text-black">
              <item.icon className="size-6" />
            </div>
            <p className="text-sm font-medium text-[var(--color-on-surface)]">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
