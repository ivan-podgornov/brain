# @brain/events

Инструменты для работы с событиями и отменой асинхронных операций. API повторяет браузерный,
поэтому если вы работали с `EventTarget` и `AbortController`, всё будет знакомо.

## Что внутри

- [`EventTarget`](./docs/event-target.md) — типизированный эмиттер событий.
- [`AbortController`](./docs/abort-controller.md) — позволяет прервать асинхронную операцию.
- [`AbortSignal`](./docs/abort-signal.md) — сообщает операции, что её нужно прервать.

## Быстрый старт

Таргет рассылает события подписчикам, а сигнал позволяет отписаться от них, когда подписка
больше не нужна:

```ts
import { AbortController, EventTarget } from '@brain/events';

type Events = {
  npcDied: number;
};

const target = new EventTarget<Events>();
const controller = new AbortController();

target.addEventListener('npcDied', (npcId) => console.log('Погиб NPC', npcId), {
  signal: controller.signal,
});

target.dispatchEvent('npcDied', 42); // Погиб NPC 42

controller.abort();

target.dispatchEvent('npcDied', 43); // обработчик уже отписан
```
