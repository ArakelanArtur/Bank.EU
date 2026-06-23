# LumenBridge Finance Ltd — Правила для AI-инструмента

## Общие правила

- Проект — учебный fullstack MVP, не production
- Все изменения должны соответствовать `oneinfo.md` (контент страниц) и `twoinfo.md` (технические требования)
- Изменения вносятся только по явной просьбе пользователя
- Не добавлять комментарии к коду без необходимости
- Не создавать документацию (*.md) без явного запроса

## Стек

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React Hook Form + Valibot, TanStack Query
- **Backend:** NestJS 11, TypeScript, Prisma ORM + SQLite
- **Хранение:** SQLite через `@prisma/adapter-libsql`
- **Auth:** JWT + mock-OTP (любой 4-значный код)

## Важные замечания

1. **Next.js v16** — может иметь breaking changes. Смотреть `node_modules/next/dist/docs/` перед написанием кода
2. **Prisma v7** — `datasource.url` в schema.prisma запрещён. URL передаётся через `prisma.config.ts` и env `DATABASE_URL`
3. **SQLite** — не поддерживает `mode: 'insensitive'`, `Decimal` (использовать `Float`)
4. **`NEXT_PUBLIC_API_URL`** — обязателен с суффиксом `/api` (строится в `.next` при сборке)

## Команды

```bash
# Backend
cd backend
npm run build          # nest build
npm run start:prod     # node dist/src/main.js

# Frontend
cd frontend
npm run build          # next build
npm start              # next start -p 3000
```

## Request 1
Goal: Добавить уведомления LOAN_CLOSED при закрытии займа
Prompt: "не хватает нотификации лоан closеd в payments.service.ts." Затем последовательно добавлены уведомления в loans.service.ts (updateStatus) и payments.service.ts (applyPaymentToSchedule, recalculateSchedule).
Result: Edited manually
What I learned: Уведомления LOAN_CLOSED создаются в сервисах, а не через триггеры БД — SQLite не поддерживает триггеры. Надо сначала проверить наличие loan-переменной в скоупе, иначе TS-ошибка.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 2
Goal: Добавить loading/error/empty состояния на админ-дашборд
Prompt: "проверь все на соответствие oneinfo.md и twoinfo.md" (в ходе аудита обнаружено отсутствие состояний)
Result: Edited manually
What I learned: Дашборд использует три TanStack Query запроса (applications, loans, payment-requests). Если любой в loading/error — показывается общий спиннер/ошибка, а не по отдельности.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 3
Goal: Исправить редиректы в CabinetLayout
Prompt: Обнаружено при сверке с ТЗ — редирект /login вместо /cabinet/login, и auth guard без pathname.
Result: Edited manually
What I learned: CabinetLayout имеет два места с редиректом: auth guard (logout → /login) и сам logout. Проверка `!isAuthenticated && pathname !== '/login'` на строке 36.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 4
Goal: Полная сверка с ТЗ (oneinfo.md, twoinfo.md)
Prompt: "проверь все на соответствие oneinfo.md и twoinfo.md" → полный аудит всех страниц, бэкенд flow, админ-панели.
Result: Used as-is (анализ, отчёт, заведение туду)
What I learned: Найдено 6 критических + 4 средних несоответствия. Основные: homepage headings не совпадают с ТЗ, ID document / IBAN полей нет в форме заявки, заголовки /credit-policy и /aml-kyc-policy на английском.
Model used: DeepSeek V4 Flash
Instrument used: opencode (explore + general agents)

## Request 5
Goal: Починить TS-ошибку build — loan not in scope в payments.service.ts
Prompt: "error TS2304: Cannot find name 'loan'" на строке 146, хотя уведомление добавили в applyPaymentToSchedule, где нет переменной loan.
Result: Edited manually
What I learned: В applyPaymentToSchedule не было fetch loan. Добавил `const loan = await this.prisma.loan.findUnique(...)` в начале метода перед использованием `loan.userId`.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 6
Goal: Перезапустить бэкенд после падения
Prompt: "ошибка вхожа при заходе http://localhost:3000/admin/login" — backend на port 3001 не отвечал (EADDRINUSE, затем процесс убит и не перезапущен).
Result: Edited manually
What I learned: Start-Process с -NoNewWindow вызывает ChildProcess.kill при завершении шелла. Надо использовать Start-Process -WindowStyle Hidden или cmd /c "start /B ...". DATABASE_URL обязательно передавать.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 7
Goal: Починить seed-скрипт под SQLite и добавить пользователя admin
Prompt: При логине 401 на admin / admin123. Выяснилось: seed использует PrismaPg (Postgres-адаптер), не работает с SQLite; пользователь admin (без email) отсутствовал.
Result: Edited manually
What I learned: Seed-файл надо адаптировать под SQLite — заменить PrismaPg на PrismaLibSql. Добавить seed-команду в prisma.config.ts (migrations.seed). После перезапуска seed оба логина работают.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)

## Request 8
Goal: Сделать иконку ShieldCheck на админ-дашборде чёрной
Prompt: "сделай обводку иконки черной" → сначала добавлен drop-shadow (белая + чёрная обводка), затем пользователь уточнил "сделай икону черной" → заменено на text-black.
Result: Edited manually
What I learned: Lucide-react иконки рендерятся через SVG с stroke="currentColor". text-white/black управляет цветом обводки. Если нужна обводка другого цвета поверх — CSS filter: drop-shadow() помогает.
Model used: DeepSeek V4 Flash
Instrument used: opencode (general agent)
