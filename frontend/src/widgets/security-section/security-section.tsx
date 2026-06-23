'use client';

import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { Section } from '@/shared/ui/section';

export function SecuritySection() {
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
          <Shield className="size-7" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Безопасность клиентов
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Мы уделяем особое внимание защите данных и безопасности наших
          клиентов. Все операции выполняются через защищённые каналы, а
          обработка информации осуществляется в соответствии с применимым
          европейским законодательством.
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-lg leading-relaxed text-[var(--color-on-surface-variant)]"
        >
          Мы не требуем предоплату и не запрашиваем конфиденциальные данные.
          Используйте только официальный сайт и проверенные контактные данные
          компании при взаимодействии с сервисом.
        </motion.p>
      </motion.div>
    </Section>
  );
}
