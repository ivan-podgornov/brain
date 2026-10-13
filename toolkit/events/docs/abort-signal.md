# AbortSignal

Сообщает асинхронной операции, что её нужно прервать. Сигнал только сообщает об отмене, прервать
его самостоятельно нельзя: для этого есть [`AbortController`](./abort-controller.md).

## Быстрый старт

Операция получает сигнал и реагирует на отмену:

```ts
import { AbortController, AbortSignal } from '@brain/events';

function doWork(signal: AbortSignal) {
  if (signal.aborted) {
    return;
  }

  signal.addEventListener('abort', (reason) => {
    console.log('Работа прервана:', reason);
  });
}

const controller = new AbortController();
doWork(controller.signal);

controller.abort('Больше не нужно');
```

## Состояния

Сигнал находится в одном из двух состояний:

- `pending` — отмены ещё не было. `aborted` равно `false`, `reason` равно `undefined`.
- `aborted` — сигнал прерван. `aborted` равно `true`, в `reason` лежит причина.

Переход из `pending` в `aborted` один и необратимый.

## Реакция на отмену

Есть три способа узнать, что сигнал прерван.

**Проверить состояние.** Подходит для проверки перед началом работы или между её шагами:

```ts
if (signal.aborted) {
  return;
}
```

**Выбросить причину.** `throwIfAborted` ничего не делает в состоянии `pending` и выбрасывает
`reason` в состоянии `aborted`:

```ts
function step(signal: AbortSignal) {
  signal.throwIfAborted();

  // ...остальная работа
}
```

**Подписаться на событие `abort`.** Событие срабатывает один раз при переходе. К моменту вызова
обработчика `aborted` и `reason` уже выставлены:

```ts
signal.addEventListener('abort', (reason) => cleanup(reason), { once: true });

// или через свойство
signal.onabort = (reason) => cleanup(reason);
```

## reason

Причина отмены. Её задаёт тот, кто прерывает сигнал. Если причина не указана, `reason` будет
объектом `Error` с именем `AbortError`:

```ts
const controller = new AbortController();

controller.abort();

controller.signal.reason.name; // 'AbortError'
```

## Готовые сигналы

### AbortSignal.abort

Возвращает сигнал, который уже находится в состоянии `aborted`. Событие `abort` на таком сигнале не
сработает, потому что подписаться раньше перехода невозможно. Всегда проверяйте `aborted` до
подписки:

```ts
const signal = AbortSignal.abort('Уже отменено');

signal.aborted; // true
signal.reason; // 'Уже отменено'
```

### AbortSignal.timeout

Возвращает сигнал, который прерывается через указанное число миллисекунд. Причиной будет `Error`
с именем `TimeoutError`:

```ts
const signal = AbortSignal.timeout(5000);

signal.addEventListener('abort', (reason) => {
  reason.name; // 'TimeoutError'
});
```

### AbortSignal.any

Объединяет несколько сигналов. Результат прерывается, как только прервётся любой из них, и берёт
причину сработавшего. Если один из сигналов уже прерван, результат сразу в состоянии `aborted`
с его причиной:

```ts
const userCancel = new AbortController();
const signal = AbortSignal.any([userCancel.signal, AbortSignal.timeout(5000)]);

userCancel.abort('Отмена пользователем');

signal.reason; // 'Отмена пользователем'
```
