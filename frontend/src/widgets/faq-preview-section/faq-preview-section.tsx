'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ChevronDown, FileText, CalendarCheck, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Section } from '@/shared/ui/section';
import { cn } from '@/shared/lib/cn';

const FAQS = [
  {
    icon: FileText,
    q: 'Какие документы нужны?',
    a: 'Для оформления займа потребуется действующее удостоверение личности и зарегистрированный номер телефона. Дополнительные документы могут потребоваться в зависимости от суммы.',
  },
  {
    icon: CalendarCheck,
    q: 'Можно ли погасить займ раньше?',
    a: 'Да, вы можете погасить займ досрочно в любой момент без штрафных санкций. Переплата пересчитывается пропорционально фактическому сроку пользования.',
  },
  {
    icon: Clock,
    q: 'Как быстро приходят деньги?',
    a: 'Заявки рассматриваются в течение нескольких минут. После одобрения деньги переводятся на карту выбранного банка сразу после подписания договора.',
  },
  {
    icon: ShieldAlert,
    q: 'Что будет, если я задержу платёж?',
    a: 'При задержке платежа начисляется пеня в соответствии с договором. Мы напоминаем о сроках заранее, чтобы вы могли избежать просрочки.',
  },
];

export function FaqPreviewSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section className="py-16 sm:py-20" id="faq">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-3xl"
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Частые вопросы
        </h2>
        <p className="mt-3 text-center text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Ответы на вопросы, которые чаще всего появляются перед оформлением займа.
        </p>
      </motion.div>
      <div className="mt-10 space-y-3">
        {FAQS.map((faq, i) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
            className={cn(
              'rounded-2xl border border-black/20 bg-white transition-all duration-200',
              openIndex === i
                ? 'border-[var(--color-secondary)]/30 shadow-md'
                : 'hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md',
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={cn(
                'flex w-full items-center gap-4 px-6 py-5 text-left transition-colors duration-200',
                openIndex === i && 'bg-[var(--color-secondary)]/5',
              )}
            >
              <div className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
                openIndex === i
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-[var(--color-secondary)]/10 text-black',
              )}>
                <faq.icon className="size-5" />
              </div>
              <span className="flex-1 text-base font-semibold text-[var(--color-on-surface)]">{faq.q}</span>
              <ChevronDown
                className={cn(
                  'size-5 shrink-0 text-[var(--color-on-surface-variant)] transition-transform duration-300',
                  openIndex === i && 'rotate-180',
                )}
              />
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openIndex === i ? 'auto' : 0,
                opacity: openIndex === i ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pt-0 text-base leading-7 text-[var(--color-on-surface-variant)]">
                {faq.a}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Link href="/faq">
          <Button variant="secondary">Смотреть все вопросы</Button>
        </Link>
      </motion.div>
    </Section>
  );
}
