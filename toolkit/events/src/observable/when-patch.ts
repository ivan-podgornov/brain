// Избрал не самый очевидный путь с патчем прототипа EventTarget, потому что иначе появляется
// проблема с зависимостями: Observable зависит от EventTarget, а EventTarget от Observable.
// Выбранный путь накладывает ограничения на использования внутри пакета. Если где-то нужно будет
// использовать метод when у EventTarget, импортировать EventTarget нужно будет из корня пакета.

import { EventTarget } from '../event-target';
import type { EventMap } from '../event-target';

import { Observable } from './observable';
import type { ObservableOptions } from './types';

declare module '../event-target/types' {
  interface IEventTarget<Events extends EventMap<Events>> {
    when<K extends keyof Events>(type: K, options?: ObservableOptions): Observable<Events[K][0]>;
  }
}

declare module '../event-target/event-target' {
  interface EventTarget<Events extends EventMap<Events>> {
    when<K extends keyof Events>(type: K, options?: ObservableOptions): Observable<Events[K][0]>;
  }
}

EventTarget.prototype.when = function <Events extends EventMap<Events>, K extends keyof Events>(
  this: EventTarget<Events>,
  type: K,
  options: ObservableOptions = {}
): Observable<Events[K][0]> {
  return new Observable<Events[K][0]>((subscriber) => {
    function listener(...args: Events[K]) {
      subscriber.next(args[0]);
    }

    this.addEventListener(type, listener);
    subscriber.addTeardown(() => this.removeEventListener(type, listener));
  }, options);
};
