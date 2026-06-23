'use client';

import { motion } from 'motion/react';
import { Section } from '@/shared/ui/section';
import { LogoIcon } from '@/shared/ui/logo-icon';

export function AboutSection() {
  return (
    <Section className="py-16 sm:py-20" id="about">
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
          className="mx-auto flex size-[120px] items-center justify-center"
          >
            <LogoIcon className="size-[120px]" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          О LumenBridge Finance Ltd
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mt-6 text-lg leading-relaxed text-[var(--color-on-surface-variant)]"
        >
          LumenBridge Finance Ltd — финансовая организация, предоставляющая
          быстрые и доступные решения в сфере кредитования в Европе.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="mt-4 text-base leading-7 text-[var(--color-on-surface-variant)]"
        >
          Наша цель — упростить доступ к финансированию за счёт прозрачных
          условий и современных технологий. Мы работаем в соответствии с
          действующим законодательством и уделяем особое внимание защите данных
          клиентов и ответственному кредитованию.
        </motion.p>
      </motion.div>
    </Section>
  );
}
