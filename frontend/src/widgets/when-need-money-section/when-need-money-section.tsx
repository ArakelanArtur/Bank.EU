'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Section } from '@/shared/ui/section';

const CARDS = [
  {
    title: 'Возможности',
    text: 'Ситуации, где важно действовать без промедления',
  },
  {
    title: 'Бизнес-задачи',
    text: 'Кассовые разрывы или операционные расходы',
  },
  {
    title: 'Задержка дохода',
    text: 'Когда деньги нужны сейчас, а поступления позже',
  },
  {
    title: 'Срочные расходы',
    text: 'Неожиданные платежи, которые нельзя перенести',
  },
];

export function WhenNeedMoneySection() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) setExpanded(true);
  }, [inView]);

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
          Когда деньги нужны сейчас
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Не все финансовые вопросы можно отложить. Иногда важно принять решение
          быстро — без сложных процедур и ожиданий.
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        layout
        className={`mx-auto mt-10 ${expanded ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : ''}`}
        style={!expanded ? { maxWidth: 280, position: 'relative', height: 280 } : {}}
      >
        {CARDS.map((card, i) => {
          const angle = (i - (CARDS.length - 1) / 2) * 3.5;
          return (
            <motion.div
              key={card.title}
              layout
              style={!expanded ? { position: 'absolute', width: '100%', left: 0, top: 0 } as React.CSSProperties : {}}
              initial={{ opacity: 0, x: 80 }}
              animate={{
                rotateZ: expanded ? 0 : angle,
                x: expanded ? 0 : i * 6,
                y: expanded ? 0 : i * 6,
                scale: expanded ? 1 : 1 - (CARDS.length - 1 - i) * 0.025,
                opacity: expanded ? 1 : 0.82 + (i / CARDS.length) * 0.18,
                zIndex: i,
              }}
              transition={{ duration: 0.9, delay: expanded ? (CARDS.length - 1 - i) * 0.15 : 0, ease: 'easeInOut' }}
              className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                {card.text}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
