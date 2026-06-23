import { HowItWorksStepsSection } from '@/widgets/how-it-works-steps-section/how-it-works-steps-section';
import { Section } from '@/shared/ui/section';

export default function HowItWorksPage() {
  return (
    <>
      <Section className="py-20 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold text-[var(--color-on-surface)] sm:text-5xl">
            Как работает сервис
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--color-on-surface-variant)]">
            Мы сделали процесс получения займа максимально простым и понятным.
            Вам не нужно посещать офис или собирать сложный пакет документов —
            всё оформляется онлайн за несколько минут.
          </p>
        </div>
      </Section>

      <HowItWorksStepsSection />

      <Section className="py-20 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold text-[var(--color-on-surface)] sm:text-4xl">
            Как проходит оформление займа
          </h2>
          <div className="mt-8 space-y-8">
            {[
              {
                title: 'Регистрация',
                text: 'Введите номер телефона и подтвердите его с помощью SMS-кода. После этого вы получаете доступ к личному кабинету, где можно управлять заявками и отслеживать статус займа.',
              },
              {
                title: 'Подача заявки',
                text: 'Выберите сумму и срок займа, укажите необходимую информацию и отправьте заявку на рассмотрение. Все условия отображаются заранее.',
              },
              {
                title: 'Проверка и одобрение',
                text: 'Заявка анализируется автоматически на основе предоставленных данных. Решение принимается в короткие сроки. При повторных обращениях могут быть доступны более выгодные условия.',
              },
              {
                title: 'Получение средств',
                text: 'После одобрения деньги переводятся на указанный банковский счёт. Перевод осуществляется сразу после подтверждения условий.',
              },
              {
                title: 'Погашение',
                text: 'Погашение осуществляется удобным для вас способом в установленный срок. Вы можете внести платеж заранее без дополнительных комиссий.',
              },
            ].map((step) => (
              <div key={step.title} className="border-l-2 border-[var(--color-secondary)] pl-6">
                <h3 className="text-xl font-semibold text-[var(--color-on-surface)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[var(--color-on-surface-variant)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-black/20 bg-white p-8">
            <h3 className="text-lg font-semibold text-[var(--color-on-surface)]">
              Важно знать
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                'Все условия займа отображаются до его оформления',
                'Мы не взимаем скрытые комиссии',
                'Данные клиентов обрабатываются в соответствии с требованиями законодательства',
                'Информация о погашении учитывается во внутренней истории клиента',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                  <span className="size-2 rounded-full bg-[var(--color-secondary)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
