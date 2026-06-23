'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Section } from '@/shared/ui/section';
import { Button } from '@/shared/ui/button';
import { MessageSquare } from 'lucide-react';
import { createContactRequest } from '@/shared/api/contact-requests';
import { ApiError } from '@/shared/api/client';
import * as v from 'valibot';
import Link from 'next/link';

export function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consentAccepted: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const feedbackSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Имя обязательно')),
    email: v.pipe(v.string(), v.email('Некорректный email')),
    phone: v.optional(v.string()),
    message: v.pipe(v.string(), v.minLength(10, 'Сообщение должно содержать минимум 10 символов')),
    consentAccepted: v.pipe(v.boolean(), v.value(true, 'Необходимо согласие на обработку данных')),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const result = v.safeParse(feedbackSchema, formData);
    if (!result.success) {
      const firstIssue = result.issues[0];
      setErrorMsg(firstIssue.message);
      setStatus('error');
      return;
    }

    try {
      await createContactRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        consentAccepted: formData.consentAccepted,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Section className="py-16 sm:py-20" id="contacts">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-xl rounded-2xl border-2 border-black/85 px-8 pb-8 pt-14 text-center"
      >
        <div className="-mt-22 mb-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-black/85 bg-white">
            <MessageSquare className="size-6 text-green-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl">
            Свяжитесь с нами
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
            Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
          </p>
        </div>

        {status === 'success' ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-lg font-semibold text-emerald-800">Спасибо за обращение!</p>
            <p className="mt-2 text-sm text-emerald-600">Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-black">
                  Имя *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
                />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-black">
                  Телефон
                </label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-black">
                  Сообщение *
                </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Прикрепление файла
              </label>
              <input
                type="file"
                className="mt-1 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-secondary)] file:px-3 file:py-1.5 file:text-xs file:text-white focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
            </div>
            <label className="flex items-start gap-3">
              <input
                required
                type="checkbox"
                checked={formData.consentAccepted}
                onChange={(e) => setFormData((p) => ({ ...p, consentAccepted: e.target.checked }))}
                className="mt-1 size-4 rounded border-black/20 text-[var(--color-secondary)]"
              />
              <span className="text-sm text-black">
                Я согласен на обработку персональных данных *
              </span>
            </label>

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <Button type="submit" disabled={status === 'loading'} className="w-full">
              {status === 'loading' ? 'Отправка...' : 'Отправить'}
            </Button>
          </form>
        )}
      </motion.div>
    </Section>
  );
}
