import { Section } from '@/shared/ui/section';

export default function CookiePolicyPage() {
  return (
    <Section className="py-20 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-[var(--color-on-surface-variant)]">
        <h1 className="text-4xl font-semibold text-[var(--color-on-surface)]">
          Политика использования файлов cookies
        </h1>
        <p>
          Настоящая Политика использования файлов cookies объясняет, какие
          cookies используются на сайте компании LumenBridge Finance Ltd и с
          какой целью.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          1. Что такое cookies
        </h2>
        <p>
          Cookies — это небольшие текстовые файлы, которые сохраняются на
          устройстве пользователя при посещении сайта и обеспечивают его
          корректную работу.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          2. Какие cookies мы используем
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            обязательные cookies — необходимы для функционирования сайта
          </li>
          <li>
            аналитические cookies — используются для анализа посещаемости
          </li>
          <li>
            функциональные cookies — запоминают пользовательские настройки
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          3. Правовое основание использования cookies
        </h2>
        <p>
          Обязательные cookies используются для обеспечения работы сайта.
          Аналитические и функциональные cookies используются с согласия
          пользователя.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          4. Управление cookies
        </h2>
        <p>
          Пользователь может управлять cookies через настройки браузера или с
          помощью cookie-баннера на сайте.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          5. Срок хранения cookies
        </h2>
        <p>
          Срок хранения cookies зависит от их типа и настроек системы.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          6. Изменения политики cookies
        </h2>
        <p>
          Компания оставляет за собой право вносить изменения в настоящую
          Политику. Актуальная версия всегда доступна на сайте.
        </p>

        <p className="text-xs text-[var(--color-outline)]">
          Настоящая политика действует с момента её публикации на сайте.
        </p>
      </div>
    </Section>
  );
}
