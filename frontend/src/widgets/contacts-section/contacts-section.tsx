'use client';

import { motion } from 'motion/react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { COMPANY_INFO } from '@/shared/config/company';
import { Section } from '@/shared/ui/section';

const CONTACT_CARDS = [
  { icon: MapPin, label: 'Адрес', value: COMPANY_INFO.address },
  { icon: Mail, label: 'Email', value: COMPANY_INFO.email },
  { icon: Phone, label: 'Телефон', value: COMPANY_INFO.phone },
];

export function ContactsSection() {
  return (
    <Section className="py-16 sm:py-20" id="contact-info">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
          Контактная информация
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Вы можете связаться с нами по любым вопросам, связанным с оформлением
          займа, условиями или обслуживанием.
        </p>
      </motion.div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {CONTACT_CARDS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
            className="rounded-2xl border border-black/20 bg-white p-6 text-center shadow-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 + 0.1, ease: 'easeOut' }}
              className="mx-auto flex size-12 items-center justify-center rounded-xl border-2 border-black bg-[var(--color-secondary)]/10 text-black"
            >
              <item.icon className="size-6" />
            </motion.div>
            <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-on-surface)]">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
