import { Section } from '@/shared/ui/section';

export default function CreditPolicyPage() {
  return (
    <Section className="py-20 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-[var(--color-on-surface-variant)]">
        <h1 className="text-4xl font-semibold text-[var(--color-on-surface)]">
          Credit Policy
        </h1>
        <p>
          LumenBridge Finance Ltd предоставляет краткосрочные займы частным
          лицам и малому бизнесу в Европе. Настоящая кредитная политика
          определяет основные принципы и условия предоставления финансирования.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          1. Основные принципы
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Прозрачность всех условий кредитования</li>
          <li>Ответственное кредитование</li>
          <li>Соответствие европейскому законодательству</li>
          <li>Защита персональных данных клиентов</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          2. Условия предоставления займов
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Для физических лиц: от 500 до 50,000 EUR, срок от 7 до 90 дней
          </li>
          <li>
            Для бизнеса: от 30,000 до 500,000 EUR, срок от 1 до 12 месяцев
          </li>
          <li>
            Процентная ставка определяется индивидуально на основе оценки
            кредитоспособности
          </li>
          <li>Погашение осуществляется равными платежами</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          3. Требования к заемщикам
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Совершеннолетие заемщика</li>
          <li>Наличие действующего удостоверения личности</li>
          <li>
            Резидентство в стране присутствия сервиса (для физических лиц)
          </li>
          <li>
            Регистрация в качестве юридического лица или предпринимателя (для
            бизнес-клиентов)
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          4. Процесс рассмотрения заявок
        </h2>
        <p>
          Заявки рассматриваются на основе предоставленных данных. Компания
          оставляет за собой право запросить дополнительные документы для
          проверки информации. Решение принимается в короткие сроки.
        </p>

        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
          5. Конфиденциальность
        </h2>
        <p>
          Вся предоставленная информация обрабатывается в соответствии с
          Политикой конфиденциальности и требованиями GDPR.
        </p>
      </div>
    </Section>
  );
}
