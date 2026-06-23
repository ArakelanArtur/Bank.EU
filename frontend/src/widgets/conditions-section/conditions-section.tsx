import { motion } from 'motion/react';
import { Euro, CalendarDays, Percent, Receipt } from 'lucide-react';
import { Section } from '@/shared/ui/section';

const CONDITIONS = [
  { icon: Euro, title: 'Сумма', text: 'от 500 до 50,000 EUR' },
  { icon: CalendarDays, title: 'Срок', text: 'от 7 до 90 дней' },
  { icon: Percent, title: 'Процентная ставка', text: 'определяется индивидуально' },
  { icon: Receipt, title: 'Погашение', text: 'равными платежами' },
];

export function ConditionsSection() {
  return (
    <Section className="py-16 sm:py-20" id="conditions">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Основные условия
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Итоговые условия зависят от результатов проверки клиента и предоставленных данных.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CONDITIONS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10">
              <item.icon className="size-5 text-[var(--color-secondary)]" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--color-on-surface)]">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
