# @brain/event-emitter

Типизированный эмиттер событий. Если вы работали с `EventTarget` в браузере, API покажется знакомым:
`addEventListener`, `removeEventListener`, `dispatchEvent`. Главное отличие в том, что названия
событий и данные, которые с ними передаются, описываются типами и проверяются компилятором.

## Быстрый старт

Сначала опишите события: ключ - название события, значение - тип данных, которые с ним передаются.

```ts
import { EventEmitter } from '@brain/event-emitter';

type Events = {
  npcDied: number;
};

const emitter = new EventEmitter<Events>();
```

Назначьте обработчик и породите событие:

```ts
function onNpcDied(id: number) {
  console.log(`NPC ${id} умер`);
}

emitter.addEventListener('npcDied', onNpcDied);
emitter.dispatchEvent('npcDied', 42); // NPC 42 умер
```

Когда обработчик больше не нужен, снимите его:

```ts
emitter.removeEventListener('npcDied', onNpcDied);
```

Компилятор проверит и название события, и тип данных.
Опечатка в названии или строка вместо числа не пройдут.

## События с данными и без них

Если у события есть данные, укажите их тип. Второй параметр `dispatchEvent` тогда обязателен:

```ts
type Events = {
  npcDied: number;
};

emitter.dispatchEvent('npcDied', 42); // ok
emitter.dispatchEvent('npcDied'); // ошибка: данные обязательны
```

Если данных нет, укажите `undefined`.
Тогда второй параметр не нужен, а обработчик не принимает аргументов:

```ts
type Events = {
  tick: undefined;
};

emitter.addEventListener('tick', () => console.log('тик'));
emitter.dispatchEvent('tick');
```

Чтобы передать несколько значений, объедините их в объект:

```ts
type Events = {
  npcMoved: { id: number; x: number; y: number };
};

emitter.dispatchEvent('npcMoved', { id: 1, x: 10, y: 20 });
```

## Снятие обработчиков

Чтобы снять обработчик, `removeEventListener` нужно передать ту же функцию, что и при назначении.
Поэтому, если обработчик придётся снимать, сохраните его в переменную или объявите функцией.
Анонимную стрелочную функцию снять не получится:

```ts
emitter.addEventListener('tick', () => console.log('тик')); // снять нельзя

const onTick = () => console.log('тик');
emitter.addEventListener('tick', onTick);
emitter.removeEventListener('tick', onTick); // можно
```

Если обработчика нет, `removeEventListener` ничего не делает и не выбрасывает ошибок.

## Обработчик на один раз

Третьим параметром `addEventListener` принимает опции. Опция `once` делает обработчик одноразовым:
он сработает при ближайшем порождении события и после этого снимется сам.

```ts
emitter.addEventListener('npcDied', onNpcDied, { once: true });

emitter.dispatchEvent('npcDied', 1); // NPC 1 умер
emitter.dispatchEvent('npcDied', 2); // ничего не произойдёт
```

Такой обработчик снимается до вызова, а не после. Поэтому, если внутри него снова породить то же
событие, повторно он не вызовется. Если обработчик выбросит исключение, он всё равно будет снят.

Пока одноразовый обработчик не сработал, его можно снять вручную тем же `removeEventListener`
и той же функцией:

```ts
emitter.addEventListener('npcDied', onNpcDied, { once: true });
emitter.removeEventListener('npcDied', onNpcDied);
emitter.dispatchEvent('npcDied', 1); // ничего не произойдёт
```

## Повторное назначение

Обработчик определяется парой «название события + функция». Если назначить ту же функцию на то же
событие второй раз, второе назначение будет проигнорировано:

```ts
emitter.addEventListener('tick', onTick);
emitter.addEventListener('tick', onTick);

emitter.dispatchEvent('tick'); // onTick вызовется один раз
emitter.removeEventListener('tick', onTick); // и одного снятия достаточно
```

Опции в эту пару не входят. Если функция уже назначена, то повторное назначение с другими опциями
ничего не изменит, и останутся опции первого назначения:

```ts
emitter.addEventListener('tick', onTick); // обычный обработчик
emitter.addEventListener('tick', onTick, { once: true }); // игнорируется

emitter.dispatchEvent('tick');
emitter.dispatchEvent('tick'); // onTick вызвался оба раза
```

А вот одну и ту же функцию можно назначить на несколько разных событий, и они не влияют друг на
друга. Если одноразовый обработчик уже сработал, он снят, и назначить его снова можно
с любыми опциями.

## Изменение обработчиков во время события

Обработчики можно назначать и снимать прямо внутри других обработчиков. Правила такие.

Обработчик, назначенный во время порождения события, в текущем порождении не вызывается. Он начнёт
работать со следующего:

```ts
emitter.addEventListener('tick', () => {
  emitter.addEventListener('tick', onTick);
});

emitter.dispatchEvent('tick'); // onTick не вызван
emitter.dispatchEvent('tick'); // onTick вызван
```

Обработчик, снятый до того, как до него дошла очередь, не вызывается,
даже если событие уже порождено:

```ts
emitter.addEventListener('tick', () => {
  emitter.removeEventListener('tick', onTick);
});
emitter.addEventListener('tick', onTick);

emitter.dispatchEvent('tick'); // onTick не вызван
```

Обработчики вызываются в том порядке, в котором были назначены.

## Обработка ошибок

Исключение в одном обработчике не должно ломать остальные, поэтому эмиттер перехватывает ошибки сам.

- `dispatchEvent` не выбрасывает исключения наружу, даже если обработчик упал.
- Остальные обработчики события продолжают вызываться.
- Упавший обработчик остаётся назначенным и вызовется при следующем порождении события (кроме одноразового: он снимается в любом случае).

Чтобы узнать об ошибке, передайте в конструктор функцию `onError`. Она получит выброшенное исключение:

```ts
const emitter = new EventEmitter<Events>({
  onError: (error) => console.error('Ошибка в обработчике', error),
});

emitter.addEventListener('tick', () => {
  throw new Error('boom');
});

emitter.dispatchEvent('tick'); // в консоль попадёт ошибка, исключение наружу не вылетит
```

Если упало несколько обработчиков, `onError` вызывается для каждого исключения отдельно, в порядке
вызова обработчиков.

Обратите внимание на два момента:

- **Если `onError` не указан, ошибки теряются без следа.** В браузере исключение из обработчика хотя
  бы попадает в консоль, а здесь сообщать об ошибке некому. Поэтому `onError` стоит указывать всегда
- **Исключение, выброшенное самим `onError`, игнорируется.** Обработка ошибки не должна ломать
  остальные обработчики, так что внутри `onError` позаботьтесь о своих ошибках сами.
