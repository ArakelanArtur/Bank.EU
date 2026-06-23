'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { FileText, Search, CheckCheck, Banknote } from 'lucide-react';
import { Section } from '@/shared/ui/section';

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Заявка',
    text: 'Укажите сумму, срок и базовые данные в короткой анкете.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Проверка',
    text: 'Система проверяет анкету и рассчитывает индивидуальные условия.',
  },
  {
    number: '03',
    icon: CheckCheck,
    title: 'Одобрение',
    text: 'Подтвердите условия, если они подходят, и подпишите договор онлайн.',
  },
  {
    number: '04',
    icon: Banknote,
    title: 'Получение денег',
    text: 'После подтверждения перевод поступает на карту выбранного банка.',
  },
];

export function HowItWorksStepsSection() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) setExpanded(true);
  }, [inView]);

  return (
    <Section className="py-16 sm:py-20" id="how-it-works">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Как мы работаем
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Весь путь от заявки до перевода денег разбит на четыре понятных шага.
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        layout
        className={`mx-auto mt-10 ${expanded ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : ''}`}
        style={!expanded ? { maxWidth: 280, position: 'relative', height: 300 } : {}}
      >
        {STEPS.map((step, i) => {
          const angle = (i - (STEPS.length - 1) / 2) * 3.5;
          return (
            <motion.div
              key={step.title}
              layout
              style={!expanded ? { position: 'absolute', width: '100%', left: 0, top: 0 } as React.CSSProperties : {}}
              initial={{ opacity: 0, x: -80 }}
              animate={{
                rotateZ: expanded ? 0 : angle,
                x: expanded ? 0 : i * 6,
                y: expanded ? 0 : i * 6,
                scale: expanded ? 1 : 1 - (STEPS.length - 1 - i) * 0.025,
                opacity: expanded ? 1 : 0.82 + (i / STEPS.length) * 0.18,
                zIndex: i,
              }}
              transition={{ duration: 0.9, delay: expanded ? i * 0.15 : 0, ease: 'easeInOut' }}
              className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                {step.text}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
