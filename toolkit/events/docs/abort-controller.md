# AbortController

Позволяет прервать асинхронную операцию. Контроллер создаёт [`AbortSignal`](./abort-signal.md)
и переводит его в состояние `aborted`. Сигнал передаётся операции, а контроллер остаётся у того,
кто решает, когда отменять. Так операция может узнать об отмене, но не может отменить сама.

## Быстрый старт

```ts
import { AbortController } from '@brain/events';

const controller = new AbortController();

doWork(controller.signal);

controller.abort('Больше не нужно');
```

## signal

Сигнал, которым управляет контроллер. Это всегда один и тот же объект, поэтому тот, кто получил
сигнал до вызова `abort`, узнает об отмене.

## abort

Переводит сигнал в состояние `aborted`. Принимает причину отмены, которая попадает в `signal.reason`

```ts
const controller = new AbortController();

controller.abort('Отмена пользователем');

controller.signal.aborted; // true
controller.signal.reason; // 'Отмена пользователем'
```

Если причину не указать, `reason` будет объектом `Error` с именем `AbortError`:

```ts
const controller = new AbortController();

controller.abort();

controller.signal.reason.name; // 'AbortError'
```

Повторный вызов `abort` ничего не делает: причина не меняется, обработчики повторно не вызываются.

```ts
const controller = new AbortController();

controller.abort('Первая причина');
controller.abort('Вторая причина');

controller.signal.reason; // 'Первая причина'
```

## Примеры

### Отмена устаревшей операции

Новый запрос отменяет предыдущий:

```ts
let controller: AbortController | undefined;

function search(query: string) {
  controller?.abort('Появился новый запрос');
  controller = new AbortController();

  return fetchResults(query, controller.signal);
}
```

### Одна отмена для нескольких операций

Один сигнал можно передать сколько угодно раз:

```ts
const controller = new AbortController();

loadProfile(controller.signal);
loadSettings(controller.signal);

controller.abort('Пользователь вышел');
```

Чтобы отмена могла произойти ещё и по таймауту, объедините сигналы через
[`AbortSignal.any`](./abort-signal.md#abortsignalany).
