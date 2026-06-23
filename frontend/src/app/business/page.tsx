import { Section } from '@/shared/ui/section';

export default function BusinessPage() {
  return (
    <>
      <Section className="py-20 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold text-[var(--color-on-surface)] sm:text-5xl">
            Займы для бизнеса в Европе
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--color-on-surface-variant)]">
            Компания предлагает краткосрочные финансовые решения для
            предпринимателей и компаний, которым важно быстро получить доступ к
            средствам. Финансирование может использоваться для покрытия текущих
            расходов, поддержания оборотного капитала или решения операционных
            задач.
          </p>

          <h2 className="mt-16 text-2xl font-semibold text-[var(--color-on-surface)]">
            Когда это актуально
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Временный кассовый разрыв',
              'Закупка товаров или материалов',
              'Покрытие операционных расходов',
              'Запуск или расширение бизнеса',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-black/20 bg-white p-5"
              >
                <span className="size-2 rounded-full bg-[var(--color-secondary)]" />
                <span className="text-sm text-[var(--color-on-surface)]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-2xl font-semibold text-[var(--color-on-surface)]">
            Условия финансирования
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Сумма займа', 'от 30,000 до 500,000 EUR'],
              ['Срок', 'от 1 до 12 месяцев'],
              ['Формат', 'краткосрочное финансирование'],
              ['Залог', 'не требуется'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-black/20 bg-white p-6 text-center"
              >
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-on-surface)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
            Итоговые условия определяются индивидуально после рассмотрения
            заявки и предоставленных документов.
          </p>

          <h2 className="mt-16 text-2xl font-semibold text-[var(--color-on-surface)]">
            Преимущества
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Быстрый доступ к средствам',
                text: 'Решение принимается в короткие сроки, что позволяет оперативно закрывать финансовые задачи',
              },
              {
                title: 'Простая процедура',
                text: 'Минимальный пакет документов и понятный процесс подачи заявки',
              },
              {
                title: 'Прозрачные условия',
                text: 'Все параметры займа согласовываются заранее, без скрытых платежей',
              },
              {
                title: 'Поддержка бизнеса',
                text: 'Финансирование адаптировано под потребности малого и среднего бизнеса',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-black/20 bg-white p-6"
              >
                <h3 className="font-semibold text-[var(--color-on-surface)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-2xl font-semibold text-[var(--color-on-surface)]">
            Требования к заемщикам
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-black/20 bg-white p-6">
              <h3 className="font-semibold text-[var(--color-on-surface)]">
                Для компаний (PVT, LTD)
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Certificate of Incorporation',
                  'Регистрационный номер компании',
                  'Удостоверение личности директора',
                  'Банковская выписка за последние месяцы',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                    <span className="size-2 rounded-full bg-[var(--color-secondary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-black/20 bg-white p-6">
              <h3 className="font-semibold text-[var(--color-on-surface)]">
                Для индивидуальных предпринимателей
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Сертификат регистрации бизнеса',
                  'Регистрационный номер предпринимателя',
                  'Удостоверение личности владельца',
                  'Выписка по банковскому счёту',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                    <span className="size-2 rounded-full bg-[var(--color-secondary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
