# @brain/events

Инструменты для работы с событиями и отменой асинхронных операций. API повторяет браузерный,
поэтому если вы работали с `EventTarget` и `AbortController`, всё будет знакомо.

## Что внутри

- [`EventEmitter`](./docs/event-emitter.md) — типизированный эмиттер событий.
- [`AbortController`](./docs/abort-controller.md) — позволяет прервать асинхронную операцию.
- [`AbortSignal`](./docs/abort-signal.md) — сообщает операции, что её нужно прервать.

## Быстрый старт

Эмиттер рассылает события подписчикам, а сигнал позволяет отписаться от них, когда подписка
больше не нужна:

```ts
import { AbortController, EventEmitter } from '@brain/events';

type Events = {
  npcDied: number;
};

const emitter = new EventEmitter<Events>();
const controller = new AbortController();

emitter.addEventListener('npcDied', (npcId) => console.log('Погиб NPC', npcId), {
  signal: controller.signal,
});

emitter.dispatchEvent('npcDied', 42); // Погиб NPC 42

controller.abort();

emitter.dispatchEvent('npcDied', 43); // обработчик уже отписан
```
