# LumenBridge Finance Ltd — Fullstack MVP

Учебный fullstack MVP сервиса онлайн-займов для частных лиц и малого бизнеса в Европе.

## Стек

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React Hook Form + Valibot, TanStack Query
- **Backend:** NestJS 11, TypeScript, Prisma ORM + SQLite
- **Auth:** JWT + mock-OTP (любой 4-значный код)

## Требования

- Node.js 20+
- npm 10+

## Быстрый старт

### 1. Backend

```bash
cd backend

# Установка зависимостей
npm install

# Создать .env из примера (если ещё нет)
cp .env.example .env
```

Отредактируйте `backend/.env` — для SQLite укажите:
```
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="any-secret-key-for-dev"
JWT_EXPIRES_IN="7d"
OTP_TTL_MINUTES=5
```

```bash
# Сгенерировать Prisma Client и создать таблицы
npx prisma generate
npx prisma db push

# Заполнить БД тестовыми данными
npx tsx prisma/seed.ts

# Собрать и запустить (порт 3001)
npm run build
npm run start:prod
```

Backend будет доступен на `http://localhost:3001`.  
Swagger: `http://localhost:3001/api/docs`.

### 2. Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Создать .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Собрать и запустить (порт 3000)
npm run build
npm start
```

Frontend будет доступен на `http://localhost:3000`.

### 3. Запуск одной командой (из корня)

```bash
npm install                  # установить concurrently
npm run install:all          # установить зависимости и frontend и backend
# Затем запустить оба одновременно:
npm run dev                  # backend :3001 + frontend :3000
```

## Тестовые учётные данные

| Роль       | Логин                         | Пароль       |
|------------|-------------------------------|--------------|
| Админ      | admin@lumenbridge.example     | admin123     |
| Оператор   | operator@lumenbridge.example  | operator123  |
| Пользователь | Телефон: +1234567890        | OTP: любой 4-значный (например 1111) |

## API

| Метод | Путь                    | Описание               |
|-------|-------------------------|------------------------|
| POST  | /api/auth/otp/request   | Запросить OTP-код      |
| POST  | /api/auth/otp/verify    | Подтвердить OTP        |
| POST  | /api/applications       | Создать заявку         |
| GET   | /api/applications       | Список заявок          |
| GET   | /api/loans              | Список займов          |
| GET   | /api/notifications      | Уведомления            |
| POST  | /api/admin/auth/login   | Вход в админ-панель    |
| ...   | ...                     | Полная документация в Swagger |

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

## Известные ограничения (учебный MVP)

- **SMS OTP** — имитация: любой 4-значный код считается верным
- **Платежи** — ручная проверка и фиксация администратором
- **Скоринг** — заявки обрабатываются вручную оператором
- **Документооборот** — договор отображается текстом на экране
- **Безопасность** — production-уровень (HTTPS, rate limiting) не применяется
- **Данные** — SQLite, только для локальной разработки
