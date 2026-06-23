import { Section } from '@/shared/ui/section';

export default function AmlKycPolicyPage() {
  return (
    <Section className="py-20 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-[var(--color-on-surface-variant)]">
        <h1 className="text-4xl font-semibold text-[var(--color-on-surface)]">
          AML/KYC Policy
        </h1>
        <p>
          LumenBridge Finance Ltd соблюдает требования законодательства по
          противодействию отмыванию денег (AML) и политику «Знай своего
          клиента» (KYC).
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          1. Цель политики
        </h2>
        <p>
          Настоящая политика направлена на предотвращение использования
          сервиса для легализации доходов, полученных преступным путем,
          финансирования терроризма и других незаконных операций.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          2. Идентификация клиентов (KYC)
        </h2>
        <p>
          Компания проводит процедуру идентификации всех клиентов перед
          предоставлением услуг. Для физических лиц требуется удостоверение
          личности, для юридических лиц — регистрационные документы компании.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          3. Мониторинг операций
        </h2>
        <p>
          Компания проводит мониторинг всех финансовых операций на предмет
          подозрительной активности. При выявлении подозрительных операций
          компания вправе приостановить обслуживание и уведомить компетентные
          органы.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          4. Хранение данных
        </h2>
        <p>
          Компания хранит данные клиентов и историю операций в соответствии с
          требованиями законодательства, но не менее 5 лет с момента
          завершения деловых отношений.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          5. Обучение персонала
        </h2>
        <p>
          Сотрудники компании проходят обучение по вопросам AML/KYC для
          своевременного выявления и предотвращения подозрительных операций.
        </p>
      </div>
    </Section>
  );
}
