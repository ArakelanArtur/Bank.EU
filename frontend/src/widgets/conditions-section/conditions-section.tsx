'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, Percent, Clock, Shield } from 'lucide-react';
import { Section } from '@/shared/ui/section';

const BENEFITS = [
  {
    icon: Check,
    title: 'Быстрое одобрение',
    text: 'Предварительное решение появляется за несколько минут после заполнения анкеты.',
    dark: true,
  },
  {
    icon: Percent,
    title: 'Низкие ставки',
    text: 'Ставка и сумма к возврату видны заранее — без скрытых комиссий.',
  },
  {
    icon: Clock,
    title: 'Удобное погашение',
    text: 'Оплата с карты, напоминания о сроках и понятная история платежей.',
  },
  {
    icon: Shield,
    title: 'Конфиденциальность',
    text: 'Персональные данные передаются по защищённому каналу и не раскрываются третьим лицам.',
  },
];

const STACKED_WIDTH = 280;
const OFFSET_Y = 6;
const ROTATION_STEP = 3.5;

export function ConditionsSection() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) setExpanded(true);
  }, [inView]);

  return (
    <Section className="py-16 sm:py-20" id="benefits">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Почему выбирают LumenBridge
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Мы убрали лишние шаги, сохранили прозрачные условия и сделали оформление понятным даже
          с телефона.
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        layout
        className={`mx-auto mt-10 ${expanded ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : ''}`}
        style={!expanded ? { maxWidth: STACKED_WIDTH, position: 'relative', height: STACKED_WIDTH } : {}}
      >
        {BENEFITS.map((card, i) => {
          const angle = (i - (BENEFITS.length - 1) / 2) * ROTATION_STEP;
          const zIndex = i;
          return (
            <motion.div
              key={card.title}
              layout
              style={!expanded ? { position: 'absolute', width: '100%', left: 0, top: 0 } as React.CSSProperties : {}}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                rotateZ: expanded ? 0 : angle,
                y: expanded ? 0 : i * OFFSET_Y,
                scale: expanded ? 1 : 1 - (BENEFITS.length - 1 - i) * 0.025,
                opacity: expanded ? 1 : 0.82 + (i / BENEFITS.length) * 0.18,
                zIndex,
              }}
              transition={{ duration: 0.9, delay: expanded ? i * 0.15 : 0, ease: 'easeInOut' }}
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
