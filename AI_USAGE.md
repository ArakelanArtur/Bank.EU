# AI_USAGE

## How AI was used
AI использовался для:
- анализа исходного ТЗ;
- декомпозиции scope в MVP;
- проектирования доменной модели;
- проектирования структуры frontend и backend;
- подготовки стартового foundation-кода;
- синхронизации calculator formula между frontend и backend.

## Manual review expectations
Перед финальной сдачей необходимо вручную проверить:
- соответствие всем обязательным пунктам из `twoinfo.md`;
- соответствие текстов и структуры страниц из `oneinfo.md`;
- корректность формулы калькулятора;
- корректность статусов заявок, займов и платежей;
- весь flow OTP и подписание займа;
- все empty/loading/error states;
- адаптивность и финальный UX;
- Valibot validation на всех формах;
- Cookie banner.

## What was fixed / added
- **OTP mock**: изменён с жёсткой проверки `0000` на принятие любого 4-значного кода
- **Admin login**: логины изменены на email-формат (admin@lumenbridge.example, operator@lumenbridge.example)
- **PaymentScheduleItem**: исправлены типы полей (principalAmount→principalPart, interestAmount→interestPart, totalAmount→amountDue)
- **Admin client detail**: создана страница `/admin/clients/[id]` с полной информацией о клиенте
- **Admin settings**: создана страница `/admin/settings`
- **Cookie banner**: добавлен компонент согласия на cookie
- **Valibot validation**: добавлена валидация форм (feedback, application, OTP login, cabinet new application)
- **TASK.md**: обновлён checklist
