# PROMPT_PLAN

## Delivery strategy
Проект реализуется поэтапно, чтобы не перегружать одну итерацию и сохранять качество.

## Phases
1. Foundation
2. Public website
3. Backend domain + API
4. User cabinet
5. Admin panel
6. QA, polish, docs

## Technical decisions
- Frontend: Next.js App Router + TypeScript + Tailwind CSS v4
- Frontend forms: React Hook Form + Valibot
- Frontend async state: TanStack Query
- Backend: NestJS
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + mock OTP flow

## Implementation principles
- Не выходить за рамки MVP scope
- Все важные пользовательские и админские данные должны жить в backend
- Клиентская и серверная валидация обязательны
- Реальные SMS и real-money integrations заменяются mock flow
- Визуальный стиль: современный clean fintech
