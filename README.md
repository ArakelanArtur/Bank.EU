# LumenBridge Finance Ltd — Fullstack MVP

Учебный fullstack MVP сервиса онлайн-займов для частных лиц и малого бизнеса в Европе.

## Стек

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React Hook Form + Valibot, TanStack Query
- **Backend:** NestJS 11, TypeScript, Prisma ORM + PostgreSQL
- **Database:** PostgreSQL 17 via Docker
- **Auth:** JWT + mock-OTP (любой 4-значный код)

## Требования

- Node.js 20+
- npm 10+
- Docker

## Быстрый старт

### 1. PostgreSQL

```bash
docker run -d --name lumenbridge-pg --network host \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lumenbridge_mvp \
  postgres:17
```

### 2. Backend

```bash
cd backend
npm install

# Создать .env (или отредактировать существующий)
# DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/lumenbridge_mvp?schema=public"
# PORT=3001
# FRONTEND_URL="http://localhost:3000"
# JWT_SECRET="any-secret-key-for-dev"
# JWT_EXPIRES_IN="7d"
# OTP_TTL_MINUTES=5

# Миграция и seed
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# Сборка и запуск (порт 3001)
npm run build
npm run start:prod
```

Backend будет доступен на `http://localhost:3001`.
Swagger: `http://localhost:3001/api/docs`.

### 3. Frontend

```bash
cd frontend
npm install

# Создать .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Сборка и запуск (порт 3000)
npm run build
npm start
```

Frontend будет доступен на `http://localhost:3000`.

## Тестовые учётные данные

| Роль       | Логин                        | Пароль          |
|------------|------------------------------|-----------------|
| Админ      | admin@lumenbridge.example    | admin123        |
| Оператор   | operator@lumenbridge.example | operator123     |
| Пользователь | Телефон: +79999999999      | OTP: 0000       |

## Архитектура

```
frontend/          — Next.js 16 (App Router) :3000
  ├── app/          — Страницы и роутинг
  │   ├── admin/    — Админ-панель
  │   ├── cabinet/  — Личный кабинет клиента
  │   └── ...       — Публичные страницы
  ├── widgets/      — Блоки главной страницы
  ├── shared/       — Общие компоненты, API, конфиги
  └── views/        — Сборки страниц из виджетов

backend/           — NestJS 11 :3001
  ├── src/
  │   ├── applications/   — Заявки
  │   ├── auth/           — Аутентификация
  │   ├── loans/          — Займы
  │   ├── payments/       — Платежи
  │   └── notifications/  — Уведомления
  ├── prisma/
  │   ├── schema.prisma   — Модели БД
  │   └── seed.ts         — Тестовые данные
  └── .env                — Конфигурация
```

## API (основные endpointы)

| Метод | Путь                                    | Описание                  |
|-------|-----------------------------------------|---------------------------|
| GET   | /api/health                             | Проверка работоспособности|
| POST  | /api/auth/register                      | Регистрация пользователя  |
| POST  | /api/auth/login                         | Вход по паролю            |
| POST  | /api/otp/request                        | Запросить OTP-код         |
| POST  | /api/otp/verify                         | Подтвердить OTP           |
| POST  | /api/applications                       | Создать заявку            |
| GET   | /api/applications                       | Список заявок             |
| GET   | /api/loans                              | Список займов             |
| POST  | /api/loans/:id/request-sign-otp         | Запросить OTP для подписи |
| POST  | /api/loans/:id/sign                     | Подписать займ            |
| POST  | /api/payment-requests                   | Создать запрос на платёж  |
| GET   | /api/notifications                      | Уведомления               |
| POST  | /api/contact-requests                   | Отправить обращение       |
| POST  | /api/admin/auth/login                   | Вход в админку            |
| GET   | /api/admin/applications                 | Все заявки (админ)        |
| PATCH | /api/admin/applications/:id/status      | Сменить статус заявки     |
| GET   | /api/admin/loans                        | Все займы (админ)         |
| PATCH | /api/admin/loans/:id/status             | Сменить статус займа      |
| GET   | /api/admin/payment-requests             | Запросы на платежи (админ)|
| POST  | /api/admin/payments                     | Записать платеж           |

## Кредитный калькулятор

Формула аннуитетного платежа (одинакова на frontend и backend):

```
A = P × (r × (1 + r)^n) / ((1 + r)^n − 1)
Total = A × n
```

Где:
- **A** — размер ежедневного платежа
- **P** — сумма займа
- **r** — дневная ставка (0.8% = 0.008, учебное значение)
- **n** — срок займа в днях

Расчёт предварительный. Итоговые условия определяются после проверки заявки.

## Полный flow (заявка → закрытие)

1. Клиент подаёт заявку через публичную форму или личный кабинет
2. Оператор/админ проверяет и одобряет заявку (создаётся займ в статусе PENDING_SIGNATURE)
3. Клиент подписывает займ через OTP (создаётся график платежей, статус → ACTIVE)
4. Клиент создаёт запрос на платеж (PaymentRequest)
5. Админ проверяет и подтверждает платеж (Payment записывается, график пересчитывается)
6. После полного погашения займ автоматически закрывается (статус → CLOSED)

## Известные ограничения (учебный MVP)

- **SMS OTP** — имитация: любой 4-значный код считается верным (тестовый: 0000)
- **Платежи** — ручная проверка и фиксация администратором
- **Скоринг** — заявки обрабатываются вручную оператором
- **Документооборот** — договор отображается текстом на экране
- **Безопасность** — production-уровень (HTTPS, rate limiting) не применяется
- **Данные** — PostgreSQL через Docker, только для локальной разработки
